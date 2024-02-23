import React from 'react'
import './Profile.css';
import Menu from './components/Menu';
import { useState, useEffect } from 'react'
import {useLocation} from 'react-router-dom';
import Carusel from './components/Carusel';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const Profile = (props) => {
  const [mode, setMode] = useState("View") //mode of page can be "View" or "Edit"
  const location = useLocation();
  const [date, setDate] = useState("") 
  const [name, setName] = useState("") 
  const [description, setDesc] = useState("") 
  const [gender, setGender] = useState("") 
  const [UserInterest, setInt] = useState("")
  const [images, setImg] = useState([])
  let save = [];
  const { t } = useTranslation(); //for translation
  

  const getData = async () => { //show data to user
    try {
        if (location.state.mode) {
          let userInfo = await fetch("/data/userProf");
          let data = await userInfo.json();
          setDate(data.user.date)
          setName(data.user.name)
          setDesc(data.user.description)
          setGender(data.user.gender)
          let imgArr = [];
          for (let i=0; i<data.user.images.length; i++) {
            let imgInfo = await fetch('/data/images/' + data.user.images[i]);
            let img = await imgInfo.blob();
            imgArr.push(img)
          }
          setImg(imgArr)
        } else {
          let userInfo = await fetch("/data/userProf/" + location.state.id);
          let data = await userInfo.json();
          setDate(data.user.date)
          setName(data.user.name)
          setDesc(data.user.description)
          setGender(data.user.gender)
          let imgArr = [];
          for (let i=0; i<data.user.images.length; i++) {
            let imgInfo = await fetch('/data/images/' + data.user.images[i]);
            let img = await imgInfo.blob();
            imgArr.push(img)
          }
          setImg(imgArr)
        }
    } catch (error) {
        console.log(error)
    }
}

  useEffect(() => {
    getData()
  }, [])

  const handleSendPhoto = async (e) => {
    save = [];
    const files = e.target.files
    save = files;
  }
  
  const sendData = async () => {
    let img_id = [];
    fetch('/data/delImgs') //if user want to add new photos, the old one will be removed from db
    if(save.length !== 0) {
      const formData = new FormData();
      formData.append("name", "smth");
      for (let i=0; i<save.length; i++) {//adding in the formData images
        formData.append("images", save[i]);
      }
      let response = await fetch("/data/images", {
          method: "post",
          body: formData,
          header: {
              "Content-Type": "multipart/form-data",
            }
        });
      let data = await response.json();
      if (data.messages) {
        toast.error(t(data.messages))//toast for error
      }
      img_id=data.id;
    }
    //getting data from the fields
    let partname = document.getElementsByTagName('p')[1].innerText
    let desc = document.getElementsByTagName('p')[2].innerText
    let selector = document.getElementById("selectMode");
    let Usergender = selector.options[selector.selectedIndex].text;
    let SelectInterest = document.getElementById("selectInt");
    let interest = SelectInterest.options[SelectInterest.selectedIndex].text;
    let toSend = {//json to update profile, if name, description, gender and interests were changed
      id: img_id,
      date: date,
      name: partname,
      description: desc,
      gender:Usergender,
      interest: interest
    }
    let text = JSON.stringify(toSend)
    //update states
    setName(partname)
    setDesc(desc)
    setMode("View")
    setGender(Usergender)
    setInt(interest)
    let response2 = await fetch("/data/profData", {//update the profile
      method: "POST",
      body: text,
      header: {
        'Content-type': 'application/json'
      }
    })

  }

  return (
    <div>
        <Toaster
        position="top-center"
        reverseOrder={false}
        />
      <Menu/> {/*button for opening menu*/}
      <div className='contain'>
        <div className='info_user'>
          <div></div>
          <div className='date'>
            <p className='name_part'>{date}</p>
          </div>
          <div className='name'>{/*mode!='View' appearse the ability to edite the data*/}
            <p contentEditable={mode!=='View'} className='sname_part'>{name}</p>
          </div>
          <div className='description'>
            <p contentEditable={mode!=='View'} className='desc_part'>{description}</p>
            
          </div>
          <div className='gen'>
            <tr>
              {/*gender and interest selector*/}
              {mode==='View'? <div>Gender: {gender}</div>: 
                <>
                  <div className='ch_gen'>
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
          {/*if location.state.mode = true, it means that profile owner went on his own page, otherwise he click on card of another one user. And he can not edit profile of enother one user*/}
          {location.state.mode? mode==='View'? <div className='submit_new' onClick={()=> setMode("Edit")}>Edit</div> : <div className='submit_new' onClick={()=> sendData()}>View</div>: <></>}
        </div>
        <div className='img_container'>
          <Carusel imgData={images}/>
          {mode!=='View' && <div className='add-photo' ><form action="/images" method="post" enctype="multipart/form-data">
                    <input type="file" id="image-input" accept="image/png, image/jpeg" name="uploaded_file" onChange={(e)=> handleSendPhoto(e)} multiple/>
                </form></div>}
        </div>
      </div>
    </div>
  )
}
export default Profile;