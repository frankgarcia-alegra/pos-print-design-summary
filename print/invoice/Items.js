import React from 'react'
import { I18n } from '@aws-amplify/core';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { BigNumber } from "bignumber.js";

import { decimalPrecision, country as countrySelector, isActiveNoIvaDay } from '../../../selectors/company'
import { calculateSingleItemValues } from '../../../utils';
import { allProductUnits } from '../../../selectors/units';

const renderNoIvaDayMessage = item => {
  return get(item, 'applyNoIvaDays', '') === 'yes'
    ? `- ${I18n.get('wellCovered', 'bien cubierto')} -`
    : null
}

const Items = ({ invoice, setting: { unitPrice, description, template, printDemo = false, unitOfMeasure, totalLines, printItemFullLine } }) => {
  const decimal = useSelector(decimalPrecision);
  const country = useSelector(countrySelector)
  const isIvaDay = useSelector(isActiveNoIvaDay)
  const allUnits = useSelector(allProductUnits);

  const { items, currency, stamp } = invoice;

  const prefix = !!get(currency, 'symbol')
    ? get(currency, 'symbol') : null;

  const fmt = prefix ? {
    prefix,
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  } : null;

  if (!items) return null;

  if (country === 'republicaDominicana' && get(invoice, 'numberTemplate.isElectronic', false)) return republicaDominicanaItemsSection({ items, template, decimal, fmt })
  if (printItemFullLine) return newItemsTemplateDesing({ items, decimal, fmt, country, template, unitPrice, unitOfMeasure, totalLines, description })

  return (
    <div className={`w-100 py-2 d-flex flex-column justify-content-center align-items-center ${template !== 'simple' ? 'border-top' : ''}`}>

      {items.map((item, index) => {
        const { price, discount, discountValue, total, taxValue } = calculateSingleItemValues(item, decimal);
        const currentUnitItem = allUnits.find((i) => i.key === get(item, 'unit', ''));

        return (
          <div key={index} className="w-100 d-flex flex-wrap form-row items-table mb-2">
            {country === 'colombia' && totalLines && <p className="col-1 break-all">{index + 1}</p>}
            <p className={`${!!unitPrice ? 'col-3' : 'col-5'} text-left break-all`}>
              {get(item, 'name', '')}
              {!printDemo && (
                <>
                  {!!item && !!currentUnitItem && unitOfMeasure && !!get(currentUnitItem, 'value', '') && (
                    <>
                      <br />
                      <span className="col-1 break-all">{`(${get(currentUnitItem, 'value', '')})`}</span >
                    </>
                  )}
                  {country === 'colombia' && !!item && !!get(item, 'productKey', '') && (
                    <>
                      <br />
                      <span className="col-1 break-all">{get(item, 'productKey', '')}</span >
                    </>
                  )}
                </>
              )}
              {
                printDemo && (
                  <>
                    {!!item && unitOfMeasure && !!get(item, 'unit', '') && (
                      <>
                        <br />
                        <span className="col-1 break-all">{`(${get(item, 'unit', '')})`}</span >
                      </>
                    )}
                    {country === 'colombia' && !!item && !!get(item, 'productKey', '') && (
                      <>
                        <br />
                        <span className="col-1 break-all">{get(item, 'productKey', '')}</span >
                      </>
                    )}
                  </>
                )
              }
            </p>
            <p className="text-center break-all col-2">{+get(item, 'quantity', 0)}</p>
            {!!unitPrice && (
              <p className="col-3 text-center break-all">
                {price.toFormat(decimal, fmt)}
              </p>
            )}
            <p className={`${!!unitPrice ? 'col-3' : 'col-4'} text-center break-all`}>
              {total.toFormat(decimal, fmt)}
            </p>

            {!!unitPrice && country === 'panama' && !!stamp && taxValue > 0 && (
              <>
                <p className="col-5 text-center break-all" />
                <p className="col-3 text-center break-all">
                  {taxValue.toFormat(decimal, fmt)}
                </p>
                <p className="col-3 text-center break-all" />
              </>
            )}


            {description && !!get(item, 'description', '') && <p className="text-left break-all col-12">{get(item, 'description')}</p>}

            {isIvaDay && !!renderNoIvaDayMessage(item) && (
              <p className="text-left break-all col-12">{renderNoIvaDayMessage(item)}</p>
            )}

            {discount > 0 && (
              <>
                {country === 'colombia' && <p className="col-1 break-all" />}
                <p className={`${!!unitPrice ? 'col-3' : 'col-5'} text-left text-nowrap text-capitalize-first`}>
                  {`${I18n.get('discount', 'descuento')} ${discount}%`}
                </p>
                <p className="col-2" />
                <p className={`${!!unitPrice ? 'col-3' : 'd-none'}`} />
                <p className={`${!!unitPrice ? 'col-3' : 'col-4'} text-center break-all`}>
                  {`-${new BigNumber(discountValue).toFormat(decimal, fmt)}`}
                </p>
              </>
            )}
          </div>
        )
      }
      )}
    </div>
  )
};

const newItemsTemplateDesing = ({ items, decimal, fmt, country, template, unitPrice, unitOfMeasure, totalLines, description }) => (
  <div className={`w-100 py-2 d-flex flex-column justify-content-center align-items-center ${template !== 'simple' ? 'border-top' : ''}`}>
    <div className="w-100 d-flex flex-wrap form-row items-table mb-2">
      <p className="col-1" />
      <p className="text-left break-all col-8 font-weight-bold">Item</p>
      <p className="text-center break-all col-3 font-weight-bold">Total</p>
    </div>

    {items.map((item, index) => {
      const { quantity, discount, discountValue, price } = calculateSingleItemValues(item, decimal);
      const productUnitOfMeasure = "units." + get(item, 'inventory.unit', 'unit');

      return (
        <div key={index} className="w-100 d-flex flex-wrap form-row items-table mb-2">
          {country === 'colombia' && !totalLines && <b className="col-1 break-all">{index + 1}.</b>}
          <div className={`col-${country === 'colombia' && !totalLines ? '8' : '9'}`}>
            <p className="m-0">{get(item, 'name', '')} {country === 'colombia' && !!get(item, 'productKey') && `(${get(item, 'productKey', '')})`}</p>
            <p className="m-0">
              {unitOfMeasure && <b>{quantity} {I18n.get(productUnitOfMeasure)}</b>}
              {unitPrice && <span>{" "}x {price.toFormat(decimal, fmt)}</span>}
              {discount !== 0 && (
                <span>{" "}(-{discount}%)</span>
              )}
            </p>
          </div>
          <p className="text-center break-all col-3">
            <p className="m-0">
              {price.multipliedBy(quantity).toFormat(decimal, fmt)}
            </p>
            {discountValue.toNumber() !== 0 && (
              <p className="m-0">
                -{discountValue.toFormat(decimal, fmt)}
              </p>
            )}
          </p>
          {description && !!get(item, 'description', '') && <p className="text-left break-all col-12">{get(item, 'description')}</p>}
        </div>
      )
    })}
  </div >
)

const republicaDominicanaItemsSection = ({ items, template, decimal, fmt }) => (
  <div className={`w-100 py-2 d-flex flex-column justify-content-center align-items-center ${template !== 'simple' ? 'border-top' : ''}`}>
    <div className="w-100 d-flex flex-wrap form-row items-table mb-2">
      <p className="col-4 text-left break-all font-weight-bold">{I18n.get('name', 'Nombre')}</p>
      <p className="text-center break-all col-2 font-weight-bold">Cant.</p>
      <p className="text-center break-all col-2 font-weight-bold">ITBIS</p>
      <p className="text-center break-all col-4 font-weight-bold">Total</p>
    </div>

    {items.map((item, index) => {
      const { discount, discountValue, total } = calculateSingleItemValues(item, decimal);
      const ITBIS = get(item, 'tax[0].type') === 'EXENTO' ? "E" : get(item, 'tax[0].percentage');
      return (
        <div key={index} className="w-100 d-flex flex-wrap form-row items-table mb-2">
          <p className="col-4 text-left break-all text-wrap">{get(item, 'name')}</p>
          <p className="text-center break-all col-2">({+get(item, 'quantity', 0)})</p>
          <p className="text-center break-all col-2">{isNaN(ITBIS) ? Number(item.total - (item.price * item.quantity)).toFixed(decimal) : ITBIS + '%'}</p>
          <p className="text-center break-all col-4">
            {total.toFormat(decimal, fmt)}
          </p>
          {discount > 0 && (
            <>
              <p className="col-4 text-left break-all text-capitalize-first">
                {`${I18n.get('discount', 'descuento')} ${discount}%`}
              </p>
              <p className="col-2" />
              <p className="col-2" />
              <p className="col-4 text-center break-all">
                {`-${new BigNumber(discountValue).toFormat(decimal, fmt)}`}
              </p>
            </>
          )}
        </div>
      )
    })}
  </div >
)

export default Items;