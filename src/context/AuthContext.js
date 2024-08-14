import axios from "axios"
const checkUser=(email,pass)=>{
    const response = axios.post("https://m97nrc17x0.execute-api.us-east-1.amazonaws.com/Prod/login/",
        {
            email: email,
            password: pass
        }
    );

    const jwt = response.access_token;
    
}