import React from 'react'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Carusel.css';

// const images = [
//   "https://res.cloudinary.com/ifeomaimoh/image/upload/v1652345767/demo_image2.jpg",
//   "https://res.cloudinary.com/ifeomaimoh/image/upload/v1652366604/demo_image5.jpg",
//   "https://res.cloudinary.com/ifeomaimoh/image/upload/v1652345874/demo_image1.jpg",
// ];

const Carusel = (props) => {
  console.log(props.imgData)
  return (
    <div>
       <div className="box">
        <Carousel useKeyboardArrows={true}>
          {props.imgData.map((img, index) => (
            <div className="slide">
              <img alt="sample_file" src={URL.createObjectURL(img).toString()} key={index} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

export default Carusel