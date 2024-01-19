import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import './Auth.css'
const Auth = () => {
    const [action, setAction] = useState("Sign Up")
    const nav = useNavigate();

    function registration() {
        console.log("reg")
            console.log(action)
            fetch("/auth/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: '{ "email": "' + document.getElementById("email").value +'", "password":"' + document.getElementById("password").value +'" }'
              })
    }

    function loggin() {
        console.log("log")
            console.log(action)
            fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: '{ "email": "' + document.getElementById("email").value +'", "password":"' + document.getElementById("password").value +'" }'
            })
        
        nav('/cards')    
    }

  return (
    <div className="b">
        <div className="container">
            <div className="header">
                <div className="text"> {action}</div>
            </div>
            <div className="inputs">
                <div className="input">
                    <input id='email' type="email" placeholder='Email'></input>
                </div>
                {/* <div className="input">
                    <input type="UserName" placeholder='Username'></input>
                </div> */}
                <div className="input">
                    <input id='password' type="password" placeholder='Password'></input>
                </div>
            </div>
            <div className="submit-container">
                <div className={action==="Log In"? "submit grey": "submit"} onClick={() => {action==="Sign Up"? registration():setAction("Sign Up")}}>Sign up</div>
                <div className={action==="Sign Up"? "submit grey": "submit"} onClick={() => {action==="Log In"? loggin():setAction("Log In")}}>Log in</div>
            </div>
        </div>
    </div>
  )
}

export default Auth;