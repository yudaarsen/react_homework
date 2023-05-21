import { useNavigate } from "react-router-dom";

export default function Lk({accessToken}) {

    const navigate = useNavigate();

    fetch('http://localhost:8080/lk',
        {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken
            })
        })
        .then(response => {
            if(response.status != 200)
                navigate("/login");
        });

    return (
        <div>Lk</div>
    );
}