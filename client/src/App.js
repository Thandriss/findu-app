import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Auth from './pages/Auth';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import UsersChat from './pages/UsersChat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Auth/>}></Route>
        <Route path='/cards' element={<Main/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/chats' element={<Chats/>}></Route>
        <Route path='/userChat' element={<UsersChat/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
