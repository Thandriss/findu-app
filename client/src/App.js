import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Auth from './pages/Auth';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import UsersChat from './pages/UsersChat';
import {useCookies} from 'react-cookie'
import Page from './pages/Page';

function App() {
  const [cookies, setCookie] = useCookies(['connect.sid'])
  return (
    <Router>
      <Routes>
        {!cookies['connect.sid'] &&<Route path='/' element={<Auth/>}></Route>} {/*registration page*/}
        {cookies['connect.sid'] &&<Route path='/cards' element={<Main/>}></Route>}  {/*route for the main page*/}
        {cookies['connect.sid'] &&<Route path='/profile' element={<Profile/>}></Route>} {/*profile page*/}
        {cookies['connect.sid'] &&<Route path='/chats' element={<Chats/>}></Route>} {/*page with all awailable chats*/}
        {cookies['connect.sid'] &&<Route path='/userChat' element={<UsersChat/>}></Route>} {/*page with dialogue*/}
        {cookies['connect.sid'] &&<Route path='/' element={<Page/>}></Route>}{/*if user authorized and want to go on registration page*/}
      </Routes>
    </Router>
  );
}

export default App;
