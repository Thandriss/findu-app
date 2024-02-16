import React from 'react'
import {useNavigate} from 'react-router-dom'

const ChatList = ({curList}) => {
    const nav = useNavigate();

    const goToUserChat = (chatId) => {
        nav('/userChat', {state: {id: chatId}})
      } 
  return (
    <div>
        <div className='chat-cont'>
            <div className='list-chats'>
              {curList.map((character) => 
                  <div className='cont-UC' key={character.chatId} onClick={() => goToUserChat(character.chatId)}>{character.name}</div>
              )}
            </div>
        </div>
    </div>
  )
}

export default ChatList