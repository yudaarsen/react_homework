import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const name = useRef();
    const password = useRef();

    const navigate = useNavigate();
    
    function handleSubmit() {
        fetch('http://localhost:8080/register',
        {
            method: 'POST',
            body: JSON.stringify({name : name.current.value, password : password.current.value})
        })
        .then(response => {
            navigate("/");
        });
        
    }

    return (
        <div>
            <div>
                <input ref={name} type="text" placeholder="Введите логин"></input>
                <input ref={password} type="text" placeholder="Введите пароль"></input>
            <button onClick={handleSubmit}>Регистрация</button>
        </div>
        </div>
    );
}