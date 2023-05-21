package ru.gadzhiev.authorization;

import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
public class UserRepository {

    private Map<String, String> users;

    public UserRepository() {
        users = new HashMap<>();
    }

    public void addUser(String name, String password) {
        users.put(name, password);
    }

    public boolean getUser(String name, String password) {
        if(users.containsKey(name)) {
            return users.get(name).equals(password);
        }
        return false;
    }

}
