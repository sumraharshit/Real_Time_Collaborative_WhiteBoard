import React from "react";
import { useState } from "react";
import './style.css';

function UploadFile(props){
const [imageFile,uploadImageFile] = useState();

function upload(event){
    const file = event.target.files[0]
    uploadImageFile(URL.createObjectURL(file));
    props.imageSource(URL.createObjectURL(file));
}


return (
    <div>
        <input type="file" onChange={upload} accept="image/*"/>
    </div>
)
}


export default UploadFile;
