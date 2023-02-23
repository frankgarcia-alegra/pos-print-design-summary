import React from 'react';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode'
import { useSelector } from 'react-redux'
import { I18n } from '@aws-amplify/core';
import { get, lowerCase } from 'lodash'
import dayjs from 'dayjs'

import { country as countrySelector, dateFormat as dateFormatSelector } from '../../../selectors/company'
import { allNumerations } from '../../../selectors/numerations'
import { getDateTime, getDocumentType } from './utilities';

const renderQR = (country, qrCode, stamp) => {
  if (!qrCode)
    return null

  switch (country) {
    case 'argentina':
      return !!get(stamp, 'fiscalQrUrl')
        ? (
          <QRCode
            value={get(stamp, 'fiscalQrUrl')}
            renderAs='svg'
            size={120}
            level="M"
          />
        ) : null
    default:
      return (
        <QRCode
          value={qrCode}
          renderAs='svg'
          size={120}
          level="M"
        />
      )
  }
}

const renderBarcode = (country, barcode) => {
  if (!barcode)
    return null

  switch (country) {
    case 'argentina':
      return (
        <div className="break-all">
          <Barcode
            value={barcode}
            height={25}
            width={.75}
            displayValue={false}
          />
          <p className="break-all px-2">
            {barcode}
          </p>
        </div>
      )
    default:
      return null
  }
}

const Electronic = ({ setting: { align, template }, invoice }) => {
  const { stamp, barCodeContent, currency } = invoice;
  const country = useSelector(countrySelector);
  const numerations = useSelector(allNumerations);
  const dateFormat = useSelector(dateFormatSelector);

  let code = !!stamp ? get(stamp, 'barCodeContent') : barCodeContent

  let mode = get(stamp, 'mode')

  let shouldShowQR = false;

  if (country === 'colombia' || country === 'costaRica')
    shouldShowQR = !!code && (getDocumentType(invoice, numerations) === 'invoice' || !!stamp)
  if (country === 'peru' || country === 'panama')
    shouldShowQR = !!code
  if (country === 'argentina') {
    shouldShowQR = !!get(stamp, 'cae') || !!get(stamp, 'caea')
    mode = (mode || 'CAE')
  }
  if (country === 'republicaDominicana') {
    shouldShowQR = !!get(stamp, 'url')
    code = get(stamp, 'url', null)
  }

  if (!shouldShowQR) return null;


  return (
    <div className={`w-100 text-${align} py-2 d-flex flex-column align-items-center qr-info-panama`}>
      {template !== 'simple' && country === 'panama' && (
        <div className="d-flex flex-column justify-content-center align-items-center electronic-info pt-2">
          <p><strong>Protocolo de autorización: {get(stamp, 'authorizationNumber', '').replace('0000155709116-2-2021', '')} al {dayjs(get(stamp, 'authorizationDate', null)).format('DD-MM-YYYY HH:mm:ss')}</strong></p>
          <p className='mt-2'><strong>Consulte por la clave de acceso en https://dgi-fep.mef.gob.pa/Consultas/FacturasPorCUFE con el CUFE:</strong></p>
          {!!get(stamp, 'cufe', null) &&
            <p className="break-all">
              <strong>{get(stamp, 'cufe', null)}</strong>
            </p>
          }
          <p className='mt-2 mb-4'><strong>Documento  validado  por  ALANUBE  SOLUCIONES,  S.A  con  RUC  155709116-2-2021-2021  DV20,  es  Proveedor  Autorizado Calificado, Resolución No. 201-613 de 22/08/2022</strong></p>
        </div>
      )}

      {renderQR(country, code, stamp)}

      {renderBarcode(country, code)}

      <div className="d-flex flex-column justify-content-center align-items-center electronic-info pt-2">
        {template !== 'simple' && country === 'colombia' && (
          <>
            {!!get(currency, 'code', null) &&
              <p>
                <strong>{I18n.get('currency', 'moneda')}</strong>
                {get(currency, 'code', null)}
              </p>
            }
            {!!get(stamp, 'cufe', null) &&
              <p className="break-all">
                <strong>{I18n.get('cufe', 'CUFE')}</strong>
                {get(stamp, 'cufe', null)}
              </p>
            }
            {
              country === 'colombia' && !!get(invoice, 'stamp', null) && (
                <>
                  {
                    !!get(invoice, 'datetime', null) && (
                      <p>
                        <strong>{I18n.get('generated', 'Generado')} : </strong>
                        {getDateTime(invoice, country, dateFormat, 'datetime')}
                      </p>
                    )
                  }
                  {
                    !!get(invoice, 'stamp.date', null) && (
                      <p>
                        <strong>{I18n.get('dianValidation', 'Validación DIAN')} : </strong>
                        {getDateTime(invoice, country, dateFormat, 'stamp')}
                      </p>
                    )
                  }
                </>

              )
            }
          </>
        )}
        {template !== 'simple' && country === 'costaRica' && (
          <>
            {!!get(currency, 'code', null) &&
              <p>
                <strong>{I18n.get('currency', 'moneda')}</strong>
                {get(currency, 'code', null)}
              </p>
            }
            {!!get(stamp, 'uuid', null) &&
              <p className="break-all">
                <strong>{I18n.get('code', 'clave')}</strong>
                {get(stamp, 'uuid', null)}
              </p>
            }
          </>
        )}
        {template !== 'simple' && country === 'peru' && (
          <>
            {!!get(currency, 'code', null) &&
              <p>
                <strong>{I18n.get('currency', 'moneda')}</strong>
                {get(currency, 'code', null)}
              </p>
            }
          </>
        )}
        {template !== 'simple' && country === 'argentina' && (
          <>
            {!!get(currency, 'code', null) &&
              <p>
                <strong>{I18n.get('currency', 'moneda')}</strong>
                {get(currency, 'code', null)}
              </p>
            }
            {!!get(stamp, 'cae', null) &&
              <p className="break-all">
                <strong>{I18n.get(lowerCase(mode), 'CAE')}</strong>
                {get(stamp, 'cae', null)}
              </p>
            }
            {!!get(stamp, 'caeDueDate', null) &&
              <p className="break-all">
                <strong>{I18n.get(`${lowerCase(mode)}DueDate`, 'Fecha de vencimiento CAE')}</strong>
                {dayjs(get(stamp, 'caeDueDate', null)).isValid()
                  ? dayjs(get(stamp, 'caeDueDate', null)).format(!!dateFormat ? dateFormat.toUpperCase() : I18n.get('dateFormat', 'DD/MM/YYYY'))
                  : get(stamp, 'caeDueDate', null)
                }
              </p>
            }
            {!!get(stamp, 'caea', null) &&
              <p className="break-all">
                <strong>{I18n.get(lowerCase(mode), 'CAEA')}</strong>
                {get(stamp, 'caea', null)}
              </p>
            }
            {!!get(stamp, 'caeaDueDate', null) &&
              <p className="break-all">
                <strong>{I18n.get(`${lowerCase(mode)}DueDate`, 'Fecha de vencimiento CAEA')}</strong>
                {dayjs(get(stamp, 'caeaDueDate', null)).isValid()
                  ? dayjs(get(stamp, 'caeaDueDate', null)).format(!!dateFormat ? dateFormat.toUpperCase() : I18n.get('dateFormat', 'DD/MM/YYYY'))
                  : get(stamp, 'caeaDueDate', null)
                }
              </p>
            }
          </>
        )}
        {country === 'republicaDominicana' && (
          <>
            {!!get(stamp, 'securityCode') && (
              <p className="w-100 text-center h5 text-capitalize-first text-nowrap">
                <strong>{I18n.get('securityCode', 'Código de seguridad')}</strong>
                {get(stamp, 'securityCode')}
              </p>
            )}
            {!!get(stamp, 'date') && (
              <p className="w-100 text-center h5 pt-1 text-capitalize-first text-nowrap">
                <strong>{I18n.get('digitalSignDate', 'Fecha de firma digital')}</strong>
                {get(stamp, 'date')}
              </p>
            )}
          </>
        )}
      </div>

    </div>
  )
}

export default Electronic;