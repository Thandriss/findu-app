import React from 'react'
import { MdClose } from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import './Menu.css';

export const Menu = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const nav = useNavigate();
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
                    <li onClick={()=> nav('/profile') }>Profile</li>
                    <li >Log out</li>
            </ul>
        </nav>
    </div>
  )
}
export default Menu;