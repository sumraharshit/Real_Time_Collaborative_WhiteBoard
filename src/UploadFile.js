import React from "react";
import { useState } from "react";
import './style.css';
import { FaImage,FaRegSquareMinus } from "react-icons/fa6";

function UploadFile(props){
const [imageFile,uploadImageFile] = useState();

function upload(event){
    const file = event.target.files[0]
    uploadImageFile(URL.createObjectURL(file));
    props.imageSource(URL.createObjectURL(file));
}


return (
    <div>
        <label for="uploadedImage"><input type="file" onChange={upload} accept="image/*" id={props.id} style={{display: "none"}}/><FaImage size="40" className="button" style={{backgroundColor: "#243b55"}}/></label>
    </div>
)
}


export default UploadFile;
