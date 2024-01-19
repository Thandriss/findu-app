import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Auth from './pages/Auth';
import Main from './pages/Main';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Auth/>}></Route>
        <Route path='/cards' element={<Main/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
