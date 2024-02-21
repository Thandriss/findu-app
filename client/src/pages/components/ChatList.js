import React from 'react'
import {useNavigate} from 'react-router-dom'
//for fast change of chats during changing the page
const ChatList = ({curList}) => {
    const nav = useNavigate();

    const goToUserChat = (chatId, userId, name) => {//after clicking on the dashboard with chat, go to user chat, where you can write mesages
        nav('/userChat', {state: {id: chatId, idOfUser: userId, name: name}})
      } 
  return (
    <div>
        <div className='chat-cont'>
            <div className='list-chats'>
              {curList.map((character) => 
                  <div className='cont-UC' key={character.chatId} onClick={() => goToUserChat(character.chatId, character.id, character.name)}>{character.name}</div>
              )}
            </div>
        </div>
    </div>
  )
}

export default ChatList