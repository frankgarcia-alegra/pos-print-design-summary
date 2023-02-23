import React from 'react'
import { useSelector } from 'react-redux';
import { I18n } from '@aws-amplify/core';

import { country as countrySelector } from '../../../selectors/company'

const Title = ({ setting: { align }, invoice: { stamp } }) => {
    const country = useSelector(countrySelector);

    if (country !== 'panama')
        return null;
    
    if (!stamp)
        return null;
    
    return (
        <div className={`h3 font-weight-bold w-100 text-${align} py-2`}>
            {I18n.get('auxiliaryElectronicInvoiceReceipt', 'Comprobante Auxiliar de Factura Electrónica')}
        </div>
    )
};

export default Title;