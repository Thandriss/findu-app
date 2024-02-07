import React from 'react'
import TinderCard from 'react-tinder-card'
import {useState, useEffect} from 'react'
import './Main.css';
import Menu from './components/Menu'
import {useNavigate} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';


export const Main = () => {
    const [dir, setLastDir] = useState()
    const [genderedUsers, setGenderedUsers] = useState([])
    const nav = useNavigate();

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
        console.log(genderedUsers)
    }, [])

    const goToUser = async (name, desc, gender, images, date) => {
        let save = [];
        for (let i=0; i<images.length; i++) {
            let imgInfo = await fetch('/data/images/' + images[i]);
            let img = await imgInfo.blob();
            save.push(img)
            console.log(save)
        }
        console.log(save)
        nav('/profile',  {state: {images: save, date: date, name: name, description: desc, gender: gender, mode: false}})
    }
    
    const onSwipe = async (direction, userId) => {
        if (direction === 'right') {
            let message = await fetch('/users/like/' + userId, {
                method: "POST",
                header: {
                  'Content-type': 'application/json'
                }
              })
            let data = await message.json()
            if (data.message === "is matched") {
                toast((t) => (
                    <span>
                      You have a match! Open the chat for dialogue
                      <button onClick={() => nav('/chat')}>
                        Open chat! 
                      </button>
                    </span>
                  ));
            }
            console.log(data.message)
        }
        setLastDir(direction)
    }
      
    const outOfFrame = (myIdentifier) => {
        console.log(myIdentifier + ' left the screen')
    }

  return (
    <div>
        <Menu/>
        <Toaster />
        <div className="info">
            <div className='swipe-container'>
                <div>
                    <div className='card-container'>
                        {genderedUsers.map((character) => 
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