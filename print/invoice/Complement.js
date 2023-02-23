import React from 'react'
import { I18n } from '@aws-amplify/core';
import { useSelector } from 'react-redux';
import { get, capitalize } from 'lodash';

import { country as countrySelector } from '../../../selectors/company'

const Complement = ({ invoice: { anotation, termsConditions, numberTemplate, stamp } }) => {
  const country = useSelector(countrySelector);
  const peruCondition = country === 'peru' ? get(numberTemplate, 'isElectronic', false) : true;

  return (
    <div className={`w-100 text-center py-2 d-flex flex-column`}>
      {!!termsConditions && <p>{termsConditions}</p>}
      {!!anotation && <p>{anotation}</p>}

      {peruCondition && !!get(numberTemplate, 'invoiceText', null) && <p>{get(numberTemplate, 'invoiceText', null)}</p>}

      {peruCondition && !!get(numberTemplate, 'text', null) && <p>{get(numberTemplate, 'text', null)}</p>}

      {country === 'colombia' && !!stamp &&
        <p>{capitalize(I18n.get('printedRepresentationOfElectronicInvoice', 'Representación impresa de la factura electrónica'))}</p>
      }

      {country === 'argentina' && !stamp &&
        <p>{capitalize(I18n.get('notValidInvoiceArg', 'Factura no valida como comprobante fiscal'))}</p>
      }
    </div>
  )
};

export default Complement;