import React from 'react'
import {useNavigate} from 'react-router-dom'
import './Page.css'
import { useTranslation } from 'react-i18next';

const Page = () => {
    const nav = useNavigate();
    const { t } = useTranslation(); //for translation

    const logOut = async() => {//fuction to log out
        fetch("/auth/logout");
        nav('/')
    }

    const goToCards = async () => { //function to do on the card page
        nav('/cards')
    } 

  return (
    <div>
        <div className='logout_b' onClick={() => logOut()}>{t('Log out')}</div>
        <div className='cards_b' onClick={() => goToCards()}>{t('Cards')}</div>
    </div>
  )
}

export default Page