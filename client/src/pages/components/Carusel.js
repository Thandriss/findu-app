import React from 'react'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Carusel.css';

// for showing images on the profile page
const Carusel = (props) => {
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