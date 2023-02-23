import React from 'react'
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux'

import { invoiceToPrint } from '../../selectors/print'
import PrintInvoice from './print/invoice/Print'

const PrintChild = (props) => {
  const invoice = useSelector(invoiceToPrint)

  if (!!props.preview)
    return (<PrintInvoice {...props} />)

  switch (props.type) {
    case 'invoice':
      return (<PrintInvoice invoice={invoice} />)
      // eliminados los demás para este repo
    default:
      return null
  }
}

const Print = (props) => {
  const print = document.getElementById('print');
  return createPortal(PrintChild(props), print)
}

export default Print