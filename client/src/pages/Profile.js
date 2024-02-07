import React from 'react'
import './Profile.css';
import Menu from './components/Menu';
import { useState } from 'react'
import {useLocation} from 'react-router-dom';
import Carusel from './components/Carusel';

export const Profile = (props) => {
  const [mode, setMode] = useState("View")
  const location = useLocation();
  const [date, setDate] = useState(location.state.date) 
  const [name, setName] = useState(location.state.name) 
  const [description, setDesc] = useState(location.state.description) 
  const [gender, setGender] = useState(location.state.gender) 
  const [UserInterest, setInt] = useState("") 
  console.log(location.state)
  let save = [];

  const handleSendPhoto = async (e) => {
    save = [];
    const files = e.target.files
    save = files;
    console.log(save)
  }
  
  const sendData = async () => {
    let img_id = [];
    let deletion = await fetch('/data/delImgs')
    if(save.length !== 0) {
      const formData = new FormData();
      formData.append("name", "smth");
      for (let i=0; i<save.length; i++) {
        formData.append("images", save[i]);
      }
      let response = await fetch("/data/images", {
          method: "post",
          body: formData,
          header: {
              "Content-Type": "multipart/form-data",
            }
        });
      let data = response.json();
      console.log(data);
      await data.then((value) => {
        console.log(value.id);
        img_id=value.id;
      });
    }
    
    // let partname = document.getElementsByTagName('p')[0].innerText
    let partname = document.getElementsByTagName('p')[1].innerText
    let desc = document.getElementsByTagName('p')[2].innerText
    let selector = document.getElementById("selectMode");
    let Usergender = selector.options[selector.selectedIndex].text;
    console.log(Usergender)
    let SelectInterest = document.getElementById("selectInt");
    let interest = SelectInterest.options[SelectInterest.selectedIndex].text;
    console.log(interest);
    let toSend = {
      id: img_id,
      date: date,
      name: partname,
      description: desc,
      gender:Usergender,
      interest: interest
    }
    console.log(toSend)
    let text = JSON.stringify(toSend)
    console.log(text)
    let response2 = await fetch("/data/profData", {
      method: "POST",
      body: text,
      header: {
        'Content-type': 'application/json'
      }
    })
      console.log(img_id);
      setMode("View")
      setName(partname)
      setDesc(desc)
      setGender(Usergender)
      setInt(interest)
  }

  return (
    <div>
      <Menu/>
      <div className='contain'>
        <div className='info_user'>
          <div></div>
          <div className='date'>
            <p className='name_part'>{date}</p>
          </div>
          <div className='name'>
            {mode==='View'? <p className='sname_part'>{name}</p>: <p contentEditable="true" className='sname_part'>{name}</p>}
          </div>
          <div className='description'>
            {mode==='View'? <p className='desc_part'>{description}</p>: <p contentEditable="true" className='desc_part'>{description}</p>}
            
          </div>
          <div className='gen'>
            <tr>
              {mode==='View'? <div>Gender: {gender}</div>: 
              <><div className='ch_gen'>
                Gender:
                  <select id="selectMode" defaultValue="mode1" multiple={false}>
                    <option value="mode1">female</option>
                    <option value="mode2">male</option>
                  </select>
                </div>
                <div className='int'>
                  Interest:
                    <select id="selectInt" defaultValue="mode1" multiple={false}>
                      <option value="mode1">female</option>
                      <option value="mode2">male</option>
                    </select>
                  </div>
                  </>
              }
            </tr>
          </div>
          {location.state.mode? mode==='View'? <div className='submit_new' onClick={()=> setMode("Edit")}>Edit</div> : <div className='submit_new' onClick={()=> sendData()}>View</div>: <></>}
        </div>
        <div className='img_container'>
          <Carusel imgData={location.state.images}/>
          {mode==='View'? <div></div> : <div className='add-photo' ><form action="/images" method="post" enctype="multipart/form-data">
                    <input type="file" id="image-input" accept="image/png, image/jpeg" name="uploaded_file" onChange={(e)=> handleSendPhoto(e)} multiple/>
                </form></div>}
        </div>
      </div>
    </div>
  )
}
export default Profile;