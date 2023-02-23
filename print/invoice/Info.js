import React from 'react'
import { I18n } from '@aws-amplify/core';
import { useSelector } from 'react-redux'
import { capitalize, get } from 'lodash';

import { companySelector, country as countrySelector, dateFormat as dateFormatSelector } from '../../../selectors/company'
import { allNumerations } from '../../../selectors/numerations'
import {
  getInvoiceType,
  getInvoiceSubType,
  getDateTime,
  getDueDate,
  getInvoiceNumber,
  getInvoicePaymentMethd,
  getInvoicePaymentForm,
  getInvoiceSaleConcept,
  getInvoiceSaleCondition,
  getInvoicePaymentType,
  getNumerationEndDate,
  getDateTimeTitle,
  getPrefix,
  getFiscalResponsabilities,
} from './utilities';

const Info = ({ invoice, setting: { align, template }, pendingInvoice }) => {
  const country = useSelector(countrySelector);
  const numerations = useSelector(allNumerations);
  const dateFormat = useSelector(dateFormatSelector);
  const company = useSelector(companySelector);
  return (
    <div className={`w-100 text-${align} py-2 d-flex flex-column ${template !== 'classic' ? 'border-top' : ''}`}>
      {!!pendingInvoice ? (
        <div className="font-weight-bold">
          <p>{capitalize(I18n.get('preInvoice', 'Pre-Factura'))}</p>
          <p>{capitalize(I18n.get('noFiscalValue', 'sin valor fiscal'))}</p>
        </div>
      ) : (
        <>
          <p className="font-weight-bold text-capitalize-first">{getInvoiceType(invoice, country, numerations)}</p>

          {!!getInvoiceSubType(invoice, country, numerations) && (
            <div className="px-2" style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '20px'
            }}>
              <p className="font-weight-bold text-uppercase">
                {`[ ${getInvoiceSubType(invoice, country, numerations)} ]`}
              </p>
            </div>
          )}

          <p className="font-weight-bold">{getInvoiceNumber(invoice, country)}</p>

          {country === 'republicaDominicana' && !!getNumerationEndDate(invoice, numerations) && (
            <p>
              <strong>{I18n.get('validDateTo', 'Valido hasta')}</strong>
              {getNumerationEndDate(invoice, numerations)}
            </p>
          )}

          {country === 'panama' &&
            <p className="font-weight-bold">{I18n.get('invoicePoint', 'Punto de facturación')} {getPrefix(invoice, country)}</p>
          }

          <p>
            <strong>{getDateTimeTitle(invoice, country, numerations)}</strong>
            {getDateTime(invoice, country, dateFormat)}
          </p>

          {country === 'republicaDominicana' && (
            <p>
              <strong>{I18n.get('paymentType', 'Tipo de pago')}</strong>
              {getInvoicePaymentType(invoice)}
            </p>
          )}

          {!!getInvoicePaymentForm(invoice, country, numerations) && (
            <p>
              <strong>{I18n.get('paymentForm', 'forma de pago')}</strong>
              {getInvoicePaymentForm(invoice, country, numerations)}
            </p>
          )}

          {!!getInvoiceSaleConcept(invoice) && (
            <p>
              <strong>{I18n.get('saleConcept', 'Concepto')}</strong>
              {getInvoiceSaleConcept(invoice)}
            </p>
          )}

          {!!getInvoiceSaleCondition(invoice, country) && (
            <p>
              <strong>{I18n.get('saleCondition', 'Condición de venta')}</strong>
              {getInvoiceSaleCondition(invoice, country)}
            </p>
          )}

          {!!getInvoicePaymentMethd(invoice, country, numerations) && (
            <p>
              <strong>{I18n.get('paymentMethod', 'método de pago')}</strong>
              {getInvoicePaymentMethd(invoice, country, numerations)}
            </p>
          )}

          {!!get(invoice, 'numberTemplate.branchOffice') &&
            <p>
              <strong>{I18n.get('branch', 'sucursal')}</strong>
              {get(invoice, 'numberTemplate.branchOffice', null)}
            </p>
          }
          {!!get(invoice, 'seller.name', null) &&
            <p>
              <strong>{I18n.get('seller', 'vendedor')}</strong>
              {get(invoice, 'seller.name', null)}
            </p>
          }
          {!!get(invoice, 'currency.code', null) &&
            <p>
              <strong>{I18n.get('currency', 'moneda')}</strong>
              {get(invoice, 'currency.code')}
            </p>
          }

          {country !== 'panama' &&
            <p className="text-capitalize-first">
              <strong>{I18n.get('dueDate', 'Fecha de vencimiento')}</strong>
              {getDueDate(invoice, dateFormat)}
            </p>
          }
          {!!getFiscalResponsabilities(company, country) &&
            <p className="text-capitalize-first">
              {getFiscalResponsabilities(company, country)}
            </p>
          }
        </>
      )}
    </div>
  )
};

export default Info;