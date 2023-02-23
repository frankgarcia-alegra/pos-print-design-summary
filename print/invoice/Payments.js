import React from 'react'
import { I18n } from '@aws-amplify/core';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { BigNumber } from 'bignumber.js'

import { decimalPrecision, country as countrySelector } from '../../../selectors/company'
import { activeNumerations } from '../../../selectors/numerations'
import { calculateItemsValues } from '../../../utils';
import { getSubDocumentType } from './utilities'

const shouldShowDiscount = (country, invoice, numerations) => {
  switch (country) {
    case 'argentina':
      const subDocumentType = getSubDocumentType(invoice, numerations)
      if (subDocumentType === 'INVOICE_B' || subDocumentType === 'INVOICE_C')
        return false
      return true

    default:
      return true
  }
}

const shouldShowTaxes = (country, invoice, numerations) => {
  switch (country) {
    case 'argentina':
      const subDocumentType = getSubDocumentType(invoice, numerations)
      if (subDocumentType === 'INVOICE_B' || subDocumentType === 'INVOICE_C')
        return false
      return true

    default:
      return true
  }
}

const Payments = ({ invoice, setting: { template, totalLines } }) => {
  let { items, currency, totalReceived, cashReturned } = invoice
  const decimal = useSelector(decimalPrecision);
  const country = useSelector(countrySelector)
  const numerations = useSelector(activeNumerations)

  if (!items) return null;


  const prefix = !!get(currency, 'symbol')
    ? get(currency, 'symbol') : null;

  const fmt = prefix ? {
    prefix,
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  } : null;

  const { subtotal, total, taxes, discount, discSubtotal } = calculateItemsValues(items, decimal);
  const showDiscount = discount.gt(0) && shouldShowDiscount(country, invoice, numerations)
  const showTaxes = shouldShowTaxes(country, invoice, numerations)

  return (
    <div className={`w-100 py-2 d-flex flex-column ${template !== 'simple' ? 'border-top border-bottom' : ''}`}>

      <div className="text-right pb-2">
        {(!!showDiscount || !!showTaxes) && (
          <p>
            <strong>{I18n.get('subtotal', 'subtotal')}</strong>
            {subtotal.toFormat(decimal, fmt)}
          </p>
        )}

        {!!showDiscount && (
          <>
            <p>
              <strong>{I18n.get('discount', 'descuento')}</strong>
              {`-${discount.toFormat(decimal, fmt)}`}
            </p>
            <p>
              <strong>{I18n.get('subtotal', 'subtotal')}</strong>
              {discSubtotal.toFormat(decimal, fmt)}
            </p>
          </>
        )}

        {!!showTaxes
          ? taxes.map((tax, index) => (
            <h4 key={index} className="h4">
              <strong>{tax.name}</strong>
              {tax.value.toFormat(decimal, fmt)}
            </h4>
          ))
          : null
        }

        <h3 className="h3">
          <strong>{I18n.get('total', 'total')}</strong>
          {total.toFormat(decimal, fmt)}
        </h3>
      </div>

      {country !== 'argentina' && (
        <div className="text-left">
          {!!totalReceived && (
            <p>
              <strong>{I18n.get('totalReceived', 'total recibido')}</strong>
              {new BigNumber(totalReceived).toFormat(decimal, fmt)}
            </p>
          )}
          {!!cashReturned && (
            <p>
              <strong>{I18n.get('cashReturned', 'cambio')}</strong>
              {new BigNumber(cashReturned).toFormat(decimal, fmt)}
            </p>
          )}
          {
            totalLines && (
              <>
                <p>
                  <strong>{I18n.get('totalRows', 'total de líneas')}</strong>
                  {items.length}
                </p>
                <p>
                  <strong>{I18n.get('totalItems', 'total de productos')}</strong>
                  {items.map(item => +get(item, 'quantity', 0)).reduce((prev, curr) => prev + curr, 0)}
                </p>
              </>
            )
          }
        </div>
      )}

    </div>
  )
};

export default Payments;