import React from 'react'
import Menu from './components/Menu'
import './Chats.css';
import { useState } from 'react'
import {useLocation} from 'react-router-dom';
import {useNavigate} from 'react-router-dom'

const Chats = () => {
  
  const location = useLocation();
  const [listOfMatched, setList] = useState(location.state.list)
  console.log(location.state.list)
  const nav = useNavigate();

  const goToUserChat = (chatId) => {
    nav('/userChat', {state: {id: chatId}})
  }

  return (
    <div>
        <Menu/>
        <div className='chat-cont'>
            <div className='list-chats'>
              {listOfMatched.map((character) => 
                  <div className='cont-UC' onClick={() => goToUserChat(character.chatId)}>{character.name}</div>
              )}
            </div>
        </div>
    </div>
  )
}

export default Chats