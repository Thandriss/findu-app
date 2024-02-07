import Menu from './components/Menu'
import './UsersChat.css';
import {useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react'

const UsersChat = () => {
  const location = useLocation();
  let [messages, setMess] = useState(["hi"])

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      let mess = document.getElementById("message").value
      document.getElementById("message").value = ""
      setMess([...messages, mess])
      console.log(mess)
      console.log(messages)
    }
  }
  return (
    <div>
        <Menu/>
        <div className='main-cont'>
            <div className='message-cont'>
                {messages.map((mess)=> 
                <div className='box'>
                  {mess}
                </div>)}
            </div>
            <div className="mess_input">
                    <input className='in_mess' id='message' placeholder='Message' onKeyDown={(event) => handleKeyPress(event)}></input>
            </div>
        </div>
    </div>
  )
}

export default UsersChat