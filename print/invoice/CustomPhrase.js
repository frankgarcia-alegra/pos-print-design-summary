import React from 'react'

const CustomPhrase = ({setting: {customPhrase}}) => {
  if(!customPhrase) return null;
  return (
    <p className="w-100 text-center py-2 h5 text-capitalize-first">
      {customPhrase}
    </p>
  )
};

export default CustomPhrase;