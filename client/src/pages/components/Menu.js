import React from 'react'
import { MdClose } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
import { useState} from 'react';
import {useNavigate} from 'react-router-dom'
import './Menu.css';
import i18n from "../../i18n.js";
import { useTranslation } from 'react-i18next';

export const Menu = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const nav = useNavigate(); //nav used, because the Link make UI worse
    const { t } = useTranslation();

    //if user clicked on profile button
    const goToProfile = async () => {
        //set parameters with all user's data
        nav('/profile',  {state: {mode: true}})
    }

    const goToCards = async () => {
        nav('/cards')
    } 

    const logOut = async() => {//fuction to log out
        fetch("/auth/logout");
        nav('/')
    }

    const goToChat = async () => { //go to dashboard with list of chats
        nav('/chats')
    }

    const changeLanguage = (lng) => { //switch languages
        i18n.changeLanguage(lng);
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
                    <li onClick={()=> goToProfile()}> {t('Profile')} </li>
                    <li onClick={()=> goToCards()}> {t('Cards')} </li>
                    <li onClick={()=> goToChat()}> {t('Chats')} </li>
                    <li onClick={() =>changeLanguage('en')}>EN</li>
                    <li onClick={() =>changeLanguage('rus')}>RUS</li>
                    <li onClick={()=> logOut()}> {t('Log out')} </li>
            </ul>
        </nav>
    </div>
  )
}
export default Menu;