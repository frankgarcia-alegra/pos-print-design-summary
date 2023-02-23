import React from 'react'
import { useSelector } from 'react-redux';

import { logo as logoSelector } from '../../../selectors/company'

const Logo = ({ setting: { logo, align } }) => {
  const companyLogo = useSelector(logoSelector);

  if (!companyLogo || !logo) return null;

  return (
    <div className={`w-100 text-${align} py-2`}>
      {logo && (
        <img alt="logo" src={companyLogo}/>
      )}
    </div>
  )
};

export default Logo;