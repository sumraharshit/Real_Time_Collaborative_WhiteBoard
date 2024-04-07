import React from "react";
import { useState } from "react";

function UploadFile(){
const [imageFile,uploadImageFile] = useState();

function upload(event){
    uploadImageFile(URL.createObjectURL(event.target.files[0]));
}

return (
    <div>
        <input type="file" onChange={upload} accept="image/*"/>
        <img src={imageFile} />
    </div>
)

}

export default UploadFile;