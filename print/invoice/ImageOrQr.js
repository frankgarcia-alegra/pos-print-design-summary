import React from 'react'

const ImageOrQr = ({setting: {imageOrQr}}) => {
  if(!imageOrQr) return null;
  return (
    <div className="d-flex justify-content-center align-items-center mr-5 ml-5 mb-2">
      <div style={{width: '120px', maxHeight: '150px'}}>
        <img 
          src={imageOrQr}
          style={{maxWidth: "100%", height: "auto", aspectRatio: "auto"}}
          alt={"Custom icon for company"}
        />
      </div>
    </div>

  )
};

export default ImageOrQr;