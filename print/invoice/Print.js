import React from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { country as countrySelector, printSettings } from '../../../selectors/company'
import { numeration as numerationSelector } from '../../../selectors/activeInvoice';
import { stationInvoiceNumeration as stationNumerationSelector } from '../../../selectors/app';
import Company from './Company';
import Logo from './Logo';
import Info from './Info';
import Client from './Client';
import Items from './Items';
import Payments from './Payments';
import Electronic from './Electronic';
import LastRow from './LastRow';
import CustomPhrase from './CustomPhrase';
// usados para otros tipos de plantilla
// import Complement from './Complement';
// import ImageOrQr from './ImageOrQr';
// import Title from './Title';

const Print = ({ setting, invoice, preview, pendingInvoice }) => {
  const companySetting = useSelector(printSettings);
  const country = useSelector(countrySelector);
  const numeration = useSelector(numerationSelector);
  const stationNumeration = useSelector(stationNumerationSelector);
  if (!setting)
    setting = companySetting;

  return (
    <div
      id="print-invoice"
      className={`print-${setting.format} ${!!preview ? 'd-flex' : 'd-none'} flex-column overflow-hidden`}
      style={{ paddingLeft: `${setting.leftMargin}mm`, paddingRight: `${setting.rightMargin}mm` }}
    >
      {renderTemplate(setting.template, { setting, invoice, pendingInvoice, country, numeration: !!numeration ? numeration : stationNumeration })}
    </div>
  )
}

const renderTemplate = (template, props) => {
  const numeration = !!props.invoice.numberTemplate
    ? props.invoice.numberTemplate
    : !!props.invoice.numeration
      ? props.invoice.numeration
      : props.numeration

  if (props.country === 'republicaDominicana' && ["E31", "E32"].includes(numeration.prefix)) {
    return (
      <>
        <Company {...props} />
        <Logo {...props} />
        <Info {...props} />
        <Client {...props} />
        <Items {...props} />
        <Payments {...props} />
        <Electronic {...props} />
        <CustomPhrase {...props} />
        <LastRow />
      </>
    )
  }
  // usamos un switch para los demás casos (template 'simple' o diseño 'modern')
}



Print.propTypes = {
  setting: PropTypes.shape({
    template: PropTypes.oneOf(['classic', 'modern', 'simple']),
    align: PropTypes.oneOf(['left', 'center', 'right']),
    description: PropTypes.bool,
    unitPrice: PropTypes.bool,
    logo: PropTypes.bool,
    format: PropTypes.oneOf(['57', '80']),
    leftMargin: PropTypes.number,
    rightMargin: PropTypes.number
  }),
  invoice: PropTypes.object,
  preview: PropTypes.bool,
  pendingInvoice: PropTypes.bool,
}

export default Print;

