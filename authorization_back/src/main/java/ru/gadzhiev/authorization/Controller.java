package ru.gadzhiev.authorization;

import io.jsonwebtoken.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.boot.json.JsonParser;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
public class Controller {

    private static final String SECRET = "secretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecret";

    private Map<String, Object> refreshTokens;
    @Autowired
    private UserRepository repository;

    public Controller() {
        refreshTokens = new HashMap<>();
    }

    @PostMapping(path = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public String register(@RequestBody String body) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> requestBody = parser.parseMap(body);

        String name = (String) requestBody.get("name");
        String password = (String) requestBody.get("password");

        repository.addUser(name, password);
        return "";
    }

    @PostMapping(path = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> login(@RequestBody String body, HttpServletResponse response) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> requestBody = parser.parseMap(body);

        String name = (String) requestBody.get("name");
        String password = (String) requestBody.get("password");

        if(!repository.getUser(name, password)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        String accessToken = generateAccessToken();
        String refreshToken = generateRefreshToken();

        Map<String, String> result = new HashMap<>();
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);

        refreshTokens.put(refreshToken, null);

        return result;
    }

    private String generateAccessToken() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "access");
        claims.put("exp", Instant.now().plus(1, ChronoUnit.MINUTES).getEpochSecond());
        return Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.HS256, SECRET).compact();
    }

    private String generateRefreshToken() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        claims.put("exp", Instant.now().plus(5, ChronoUnit.MINUTES).getEpochSecond());
        return Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.HS256, SECRET).compact();
    }

    private boolean validateToken(String token, boolean isRefresh) {
        JwtParser parser = Jwts.parserBuilder().setSigningKey(SECRET).build();
        if(parser.isSigned(token)) {
            try {
                Claims claims = parser.parseClaimsJws(token).getBody();
                String type = (String) claims.get("type");
                if (type.equals("refresh") && refreshTokens.containsKey(token) || type.equals("access"))
                    return (isRefresh && type.equals("refresh") || !isRefresh && type.equals("access"));
            } catch (ExpiredJwtException e) {
                return false;
            }
        }
        return false;
    }

    @PostMapping(path = "/refresh", produces = MediaType.APPLICATION_JSON_VALUE)
    private Map<String, String> refresh(@RequestBody String body, HttpServletResponse response) {
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> requestBody = parser.parseMap(body);

        String refreshToken = (String) requestBody.get("refreshToken");
        if(!validateToken(refreshToken, true)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }

        Map<String, String> result = new HashMap<>();
        String newRefreshToken = generateRefreshToken();

        result.put("accessToken", generateAccessToken());
        result.put("refreshToken", generateRefreshToken());

        refreshTokens.remove(refreshToken);
        refreshTokens.put(newRefreshToken, null);

        return result;
    }

    @GetMapping(path = "/lk")
    public void lk(@RequestHeader(name = "Authorization") String authorization, HttpServletResponse response) {
        String token = authorization.substring(7);
        if(!validateToken(token, false)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

}
