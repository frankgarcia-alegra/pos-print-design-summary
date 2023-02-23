import React from 'react'
import { I18n } from '@aws-amplify/core';
import { get } from 'lodash';
import { useSelector } from 'react-redux';

import { companySelector, country as countrySelector, dateFormat as dateFormatSelector } from '../../../selectors/company'
import {
  getID,
  renderAddress,
  getRegime,
  getIVACondition,
  getIibbCondition,
  getActivityStartDate
} from './utilities';

const Company = ({ invoice: { stamp, economicActivity }, setting: { align, template } }) => {
  const company = useSelector(companySelector);
  const country = useSelector(countrySelector);
  const dateFormat = useSelector(dateFormatSelector);

  return (
    <div className={`w-100 text-${align} py-2 d-flex flex-column ${template === 'modern' ? 'border-top' : ''}`}>

      {
        country === 'spain' && (
          !!get(company, 'localSettings.tradeName', null) ? (
            <>
              <h3 className="h3 font-weight-bold">{get(company, 'localSettings.tradeName', null)}</h3>
              <p>{get(company, 'name', null)}</p>
            </>
          ) : (
            <h3 className="h3 font-weight-bold">{get(company, 'name')}</h3>
          )
        )
      }

      {
        country !== 'spain' && (
          country === 'colombia' && !!get(company, 'tradeName', null)
            ?
            <>
              <h3 className="h3 font-weight-bold">{get(company, 'tradeName')}</h3>
              <p>{get(company, 'name')}</p>
            </>

            : <h3 className="h3 font-weight-bold">{get(company, 'name')}</h3>
        )
      }

      {country === 'colombia' && !!stamp && !!get(company, 'tradeName', null)
        ? <p>{`${get(company, 'name')} - ${getID(company)}`}</p>
        : <p>{getID(company)}</p>
      }

      {country === 'costaRica' && !!economicActivity &&
        <p>
          <strong>{I18n.get('economicActivity', 'actividad económica')}</strong>
          {economicActivity}
        </p>
      }

      {renderAddress(company, country)}

      {!!get(company, 'phone', null) &&
        <p>
          <strong>{I18n.get('phone', 'teléfono')}</strong>
          {get(company, 'phone')}
        </p>
      }
      {!!get(company, 'email', null) &&
        <p>
          {get(company, 'email')}
        </p>
      }
      {!!get(company, 'website', null) &&
        <p>
          <strong>{I18n.get('website', 'sitio web')}</strong>
          {get(company, 'website')}
        </p>
      }

      {!!getIVACondition(company, country) && (
        <p>
          <strong>{I18n.get('ivaCondition', 'Condición de IVA')}</strong>
          {getIVACondition(company, country)}
        </p>
      )}

      {!!getActivityStartDate(company, country, dateFormat) && (
        <p>
          <strong>{I18n.get('activityStartDate', 'Inicio de actividades')}</strong>
          {getActivityStartDate(company, country, dateFormat)}
        </p>
      )}

      {!!getIibbCondition(company, country) && (
        <p>
          <strong>{I18n.get('iibbCondition', 'Condición IIBB')}</strong>
          {getIibbCondition(company, country)}
        </p>
      )}

      {!!getRegime(company, country) &&
        <p>
          <strong>{I18n.get('regime', 'régimen')}</strong>
          {getRegime(company, country)}
        </p>
      }
    </div>
  )
};

export default Company;