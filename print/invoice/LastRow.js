import React from 'react'
import { I18n } from '@aws-amplify/core';
import { useSelector } from 'react-redux';

import { origin } from '../../../selectors/company'

const LastRow = () => {
  const companyOrigin = useSelector(origin)
  return (
    <p className="w-100 text-center py-2 h5 text-capitalize-first">
      {companyOrigin === 'partner-claro'
        ? I18n.get('invoicePrintFooterClaro', 'Generado en Software Contable Claro Negocios con tecnología de Alegra - software-contable.com.co')
        : I18n.get('invoicePrintFooter', 'Generado en Alegra POS - alegra.com/pos')
      }
    </p>
  )
};

export default LastRow;