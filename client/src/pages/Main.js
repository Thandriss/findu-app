import React from 'react'
import TinderCard from 'react-tinder-card'
import {useState} from 'react'
import './Main.css';
import Menu from './components/Menu'

let characters = [
    {
        name: "Inna Lon"
    },
    {
        name: "Inna Lon 2"
    }
]

export const Main = () => {
    const [dir, setLastDir] = useState()
    
    const onSwipe = (direction) => {
        setLastDir(direction)
    }
      
    const outOfFrame = (myIdentifier) => {
        console.log(myIdentifier + ' left the screen')
    }

  return (
    <div>
        <Menu/>
        <div className="info">
            {/* <Chat/> */}
            <div className='swipe-container'>
                <div>
                    <div className='card-container'>
                        {characters.map((character) => 
                        <TinderCard className='swipe' key={character.name} onSwipe={(dir)=>onSwipe(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
                            {/* <div style={{backgroundImage:'url(' + character.url + ')'}} className='card'>
                                <h3>{character.name}</h3>
                                <div className='discription'>I like football</div>
                            </div> */}
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