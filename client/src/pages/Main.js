import React from 'react'
import TinderCard from 'react-tinder-card'
import {useState, useEffect} from 'react'
import './Main.css';
import Menu from './components/Menu'
import {useNavigate} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';


export const Main = () => {
    const [genderedUsers, setGenderedUsers] = useState([])
    const nav = useNavigate();
    const { t } = useTranslation(); //for translation

    //function for getting the list of all user's, who was not liked or disliked
    const getUsers = async () => {
        try {
            let userInterest = await fetch('/data/interest')
            let interest = await userInterest.json()
            let response = await fetch('/users/toswipe/' + interest.interest)
            let data = await response.json()
            setGenderedUsers(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    //if user presed on the name on the card he will go on user's profile
    const goToUser = async (name, desc, gender, images, date) => {
        let save = [];
        for (let i=0; i<images.length; i++) {
            let imgInfo = await fetch('/data/images/' + images[i]);
            let img = await imgInfo.blob();
            save.push(img)
        }
        nav('/profile',  {state: {images: save, date: date, name: name, description: desc, gender: gender, mode: false}})
    }
    //if match happened a toast with button, which after click on it refers to user's profile
    const goToChat = (id) => {
        nav('/userChat', {state: {id: id}})
    }

    // function, which works when user swipes
    const onSwipe = async (direction, userId) => {
        //if card is swiped on the right user liked another one
        if (direction === 'right') {
            let message = await fetch('/users/like/' + userId, {
                method: "POST",
                header: {
                  'Content-type': 'application/json'
                }
              })
            let data = await message.json()
            if (data.message === "is matched") {
                fetch('/mess/create/' + data.id)
                toast((e) => (
                    <span>
                      {t('You have a match! Open the chat for dialogue')}
                      <button onClick={() => goToChat(data.id)}>
                      {t('Open chat!')}
                      </button>
                    </span>
                ));
            }
        } else if (direction === 'left') {
            //if card is swiped on the left user disliked another one
            let dislike = await fetch('/users/dislike/' + userId, {
                method: "POST",
                header: {
                  'Content-type': 'application/json'
                }
            })
        }
    }
      
    const outOfFrame = (myIdentifier) => {
        console.log(myIdentifier + ' left the screen')
    }

  return (
    <div>
        <Menu/> {/*button for opening menu*/}
        <Toaster /> {/*toast notification with button to open the chat*/}
        <div className="info">
            <div className='swipe-container'>
                <div>
                    <div className='card-container'>
                        {genderedUsers.map((character) => //genetration card to swipe
                        <TinderCard className='swipe' key={character.name} onSwipe={(dir)=>onSwipe(dir, character._id)} onCardLeftScreen={() => outOfFrame(character.name)}>
                            <div style={{backgroundImage:'url(' + ')'}} className='card'>
                                <h3 onClick={() => goToUser(character.name, character.description, character.gender, character.images, character.date)}>{character.name}</h3>
                                <div className='discription'>{character.description}</div>
                            </div>
                        </TinderCard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    
  )
}
export default Main;