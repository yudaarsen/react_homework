import { useRef } from "react";
import { useNavigate } from "react-router-dom";



export default function Login({setTokens}) {
    const name = useRef();
    const password = useRef();
    const navigate = useNavigate();
    
    function handleSubmit() {
        fetch('http://localhost:8080/login',
        {
            method: 'POST',
            body: JSON.stringify({name: name.current.value, password: password.current.value})
        })
        .then(response => response.json())
        .then(response => {
            setTokens(response.accessToken, response.refreshToken);
            navigate("/");
        });
    }

    return (
        <div>
            <input ref={name} type="text" placeholder="Введите логин"></input>
            <input ref={password} type="text" placeholder="Введите пароль"></input>
            <button onClick={handleSubmit}>Войти</button>
        </div>
    );
}