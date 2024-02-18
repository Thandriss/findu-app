import Menu from './components/Menu'
import './UsersChat.css';
import {useLocation} from 'react-router-dom';
import { useState } from 'react'

const UsersChat = () => {
  const location = useLocation();
  let [messages, setMess] = useState([]) //all messages
  const [edit, setEdit] = useState(false);
  const [chatId, setChatId] = useState(location.state.id) //id of chat for fetch
  const [messId, setMessId] = useState('');

  //function to send a message, if user pressed enter 
  const handleKeyPress = async (event) => { 
    if(event.key === 'Enter'){
      let mess = document.getElementById("message").value
      document.getElementById("message").value = ""
      let toSend = {
        messages: mess
      }
      let send = await fetch('/mess/send/' + chatId, { //send message in the db
        method: "POST",
        headers: {
          "Content-type": "application/json"
          },
        body: JSON.stringify(toSend)
      })
      let data = await send.json()
      setMess(data.messages)//message saved in 
    }
  }
  //function to get all messages
  const getAll = async () => {
    let getInfo = await fetch('/mess/all/' + chatId)
    let data = await getInfo.json() //getting the json 
    console.log(data.messages)
    setMess(data.messages) //show messages on the screen
  }

  const editMess = (mess) => {
    setEdit(true);
    setMessId(mess)
    console.log("edit")
  }

  const handleChange = async (event) => {
    try {
      let toSend = {
        messages: event.target.value,
        chatId: chatId
      }
      let send = await fetch('/mess/edit/' + messId, { //send message in the db
        method: "POST",
        headers: {
          "Content-type": "application/json"
          },
        body: JSON.stringify(toSend)
      })
      let data = await send.json()
      if (!data.message) {
        setMess(data.messages)//message saved in
        console.log("edit")
      }
    } catch (err) {
      console.log(err)
    }
  };

  const handleBlur = () => {
    setEdit(false);
  };

  return (
    <div>
        <Menu/> {/*button for opening menu*/}
        <div className='main-cont'>
            <div className='message-cont'>
                {messages.map((mess)=> 
                <div className='mess-box'onDoubleClick={()=> editMess(mess._id)}>
                  {mess.name + ' '+ mess.date+': '}
                  {edit ? (
                    <input
                      type="text"
                      value={mess.text}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />) : (<span>{mess.text}</span>)}
                </div>)}
            </div>
            <div className="mess_input">
                    <input className='in_mess' id='message' placeholder='Message' onKeyDown={(event) => handleKeyPress(event)}></input>
                <div className="button-get">
                  <div className='get' onClick={() => getAll()}>Get Message</div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default UsersChat