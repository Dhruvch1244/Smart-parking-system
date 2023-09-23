import "./Modal.css"
import React from 'react';
import { Close } from "@mui/icons-material";
import axios from 'axios';
import { useState } from "react";

const Modal = ({ closeModal ,slot_no,v_type,loc}) => {
 
  const [ isbook, setIsbook] = useState({
    name: "",
    licence_no:"",
    slot_no:slot_no,
    v_type :v_type,
    loc: loc,
    booked:"yes",
})
var Price=localStorage.getItem('price');
const handleChange = e => {
  const { name, value } = e.target
  setIsbook({
      ...isbook,
      [name]: value
  })
}  

  const onbook= () =>{
    const{name ,licence_no ,slot_no,loc,booked="yes" } = isbook
  
    if(name && licence_no){
      
      axios.post('http://localhost:9000/slots', isbook)
      .then((res)=> {
        alert(res.data.message)
        closeModal(false)
      })
    
    }
    else{
      alert("Invalid inputs");
    }
  }

  //reloader
  const refresh = () =>{ 
    window.location.reload(true)
    window.location.reload(true)
    window.location.reload(true)
  }
  
  return (
    
    <div className="superoverlay"  onClick={()=>closeModal(false)}>
    <div className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <div className='modalRight'>
          <p className='closeBtn' onClick={()=>closeModal(false)}>
          <Close/>
          </p>
          <div className='content'>
              <div className='name'>
                <input className="namer" type="text" name="name"  placeholder=" Enter Guest Name"  onChange={handleChange}/>
              </div>
              <br/>
              <div className='licence'>
                <input className="licencer" type="text" name="licence_no"  placeholder=" Enter Licence Number"  onChange={handleChange}/>
              </div>
            <br/>
            <h1>Book Slot {slot_no}</h1>
            <h1>For {v_type}</h1>
            <p className="price">Price : ${Price}</p>
            
          </div>
          <div className='btnContainer'>
            <button className='btnPrimary' onClick={() => { onbook(); refresh();}}>
              <span className='bold' >YES</span>
            </button>
            <button className='btnOutline' onClick={()=>closeModal(false)} >
              <span className='bold'>NO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Modal;
