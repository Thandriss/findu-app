import React from 'react'
import Menu from './components/Menu'
import './Chats.css';
import Pagination from './components/Pagination'
import ChatList from './components/ChatList'
import { useState, useEffect } from 'react'

const Chats = () => {
  
  const [listOfMatched, setList] = useState([])
  const [cur, setCur] = useState(1);
  const [chatsPerPage, setChats] = useState(10);

  //get all id of chats
  const getChats = async () => {
    let names = await fetch('/users/matches');
    let data = await names.json();
    setList(data.data)
  }

  useEffect(() => {
    getChats()
  }, [])
  
  //current posts
  let indexOfLastPost = cur * chatsPerPage;
  let indexOfFirstPost = indexOfLastPost - chatsPerPage;
  let curList = listOfMatched.slice(indexOfFirstPost, indexOfLastPost)
  //change page
  const paginate = (pageNumber) => {
    setCur(pageNumber)
  }
  return (
    <div>
        <Menu/> {/*button for opening menu*/}
        <ChatList curList={curList}/>
        {listOfMatched.length <= chatsPerPage? <></>: <Pagination chatsPerPage={chatsPerPage} total={listOfMatched.length} paginate={paginate}/>}
    </div>
  )
}

export default Chats