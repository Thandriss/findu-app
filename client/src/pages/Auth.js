import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import './Auth.css'
const Auth = () => {
    const [action, setAction] = useState("Sign Up")
    const nav = useNavigate();

    //function for registration which is usin email and password data from input
    function registration() {
        fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: '{ "email": "' + document.getElementById("email").value +'", "password":"' + document.getElementById("password").value +'" }'
        })
    }

    //function for login which is usin email and password data from input
    function loggin() {
        fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: '{ "email": "' + document.getElementById("email").value +'", "password":"' + document.getElementById("password").value +'" }'
        })
        //after login user goes on the main page with cards
        nav('/cards')    
    }

    //autherisation via google
    function googleLog() {
        window.open(`http://localhost:1234/auth/google`, "_self");   
    }

  return (
    <div className="b">
        <div className="container">
            <div className="header">
                <div className="text"> {action}</div>
            </div>
            <div className="inputs">
                <div className="auth_input">
                    <input className='in' id='email' type="email" placeholder='Email'></input>
                </div>
                <div className="auth_input">
                    <input className='in' id='password' type="password" placeholder='Password'></input>
                </div>
            </div>
            <div className="submit-container"> {/*if "log in" mode the SignUp button become inactive and gray and log In batton active and black. After ckicking the black button, the registration or log in will be executed*/}
                <div className={action==="Log In"? "submit grey": "submit"} onClick={() => {action==="Sign Up"? registration():setAction("Sign Up")}}>Sign up</div>
                <div className={action==="Sign Up"? "submit grey": "submit"} onClick={() => {action==="Log In"? loggin():setAction("Log In")}}>Log in</div>
            </div>
            {action==="Log In"? <div className="thirdP"><div id='googleAuth' onClick={() => googleLog()}>Google+</div></div>: <></>}
        </div>
    </div>
  )
}

export default Auth;