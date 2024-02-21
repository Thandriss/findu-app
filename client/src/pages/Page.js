import React from 'react'
import {useNavigate} from 'react-router-dom'
import './Page.css'

const Page = () => {
    const nav = useNavigate();

    const logOut = async() => {//fuction to log out
        fetch("/auth/logout");
        nav('/')
    }

    const goToCards = async () => { //function to do on the card page
        nav('/cards')
    } 

  return (
    <div>
        <div className='logout_b' onClick={() => logOut()}>Log out</div>
        <div className='cards_b' onClick={() => goToCards()}>Cards</div>
    </div>
  )
}

export default Page