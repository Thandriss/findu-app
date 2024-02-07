import React from 'react'
import { MdClose } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import './Menu.css';

export const Menu = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const nav = useNavigate();

    const goToProfile = async () => {
        let userInfo = await fetch("/data/userProf");
        let data = await userInfo.json();
        let save = [];
        console.log(data)
        for (let i=0; i<data.user.images.length; i++) {
            let imgInfo = await fetch('/data/images/' + data.user.images[i]);
            let img = await imgInfo.blob();
            save.push(img)
            console.log(save)
        }
        console.log(save)
        
        nav('/profile',  {state: {images: save, date: data.user.date, name: data.user.name, description: data.user.description, gender: data.user.gender, mode: true}})
    }

    const goToCards = async () => {
        nav('/cards')
    } 

    const logOut = async() => {
        fetch("/auth/logout");
        nav('/')
    }

    const goToChat = async () => {
        let names = await fetch('/users/matches');
        let data = await names.json();
        console.log(data)
        nav('/chats', {state: {list: data.data}})
    }
    
  return (
    <div>
        <nav className="navbar">
            <button className="toggle" onClick={() => setNavbarOpen((prev) => !prev)}>
                {navbarOpen ? (
                <MdClose style={{ width: '32px', height: '32px' }} />
                    ) : (
                <FiMenu style={{width: '32px', height: '32px',}}/>
                )}
            </button>
            <ul className={`menu-nav${navbarOpen ? ' show-menu' : ''}`}>
                    <li onClick={()=> goToProfile()}>Profile</li>
                    <li onClick={()=> goToCards()}>Cards</li>
                    <li onClick={()=> goToChat()}>Chats</li>
                    <li onClick={()=> logOut()}>Log out</li>
            </ul>
        </nav>
    </div>
  )
}
export default Menu;