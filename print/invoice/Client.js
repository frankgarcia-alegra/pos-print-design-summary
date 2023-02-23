import React, { useEffect, useState, useCallback } from 'react'
import { I18n } from '@aws-amplify/core';
import { get, isString } from 'lodash';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import { country as countrySelector } from '../../../selectors/company';
import { getID, renderAddress, getIVACondition } from './utilities';
import { getClientById as getClientbyIdFromDb } from '../../../database/contactsDB'
import alegraAPI from '../../../reducers/alegraAPI';
import { isDefaultClient } from '../../../reducers/activeInvoice';

const Client = ({ invoice: { client }, setting: { align, template } }) => {
  const country = useSelector(countrySelector);
  const [fullClient, setFullClient] = useState('')

  const fetchCurrentClient = useCallback(
    async (id) => {
      try {
        const responseDB = await getClientbyIdFromDb(parseInt(id))
        if (isEmpty(responseDB)) {
          const responseAPI = await alegraAPI.get(`/contacts/${id}`)
          setFullClient(responseAPI.data)
        }
        else {
          setFullClient(responseDB)
        }
      } catch (error) {
        setFullClient('')
      }
    },
    [],
  )

  useEffect(() => {
    if (!(client))
      setFullClient('')
    else
      fetchCurrentClient(client.id);
  }, [client, fetchCurrentClient])

  if (!client) return null;

  const renderClientName = () => {
    if (!!get(client, 'name')) {
      if (!!isString(get(client, 'name')))
        return get(client, 'name')
      return `${get(client, 'name.firstName', '')}${!!get(client, 'name.secondName', null)
        ? ' ' + get(client, 'name.secondName') : ''}${!!get(client, 'name.lastName', null)
          ? ' ' + get(client, 'name.lastName') : ''}`;
    }
    return ''
  }

  const renderClientIdentification = (client, fullClient, country) => {
    if(isDefaultClient(client, country))
      return null;
    
    if (['peru', 'republicaDominicana'].includes(country) && !!get(fullClient, 'identificationObject.type') && !!get(fullClient, 'identificationObject.number'))
      return (
        <p>
          <strong>{fullClient.identificationObject.type}</strong>
          {fullClient.identificationObject.number}
        </p>
      )

    if (!!get(client, 'identification', null) || !!get(client, 'identificationObject', null))
        return (
          <p>
            <strong>{getIdTitle()}</strong>
            {getID(client)}
          </p>
        )
    
    return null;
  }

  const getIdTitle = () => {
    if (country === 'panama')
      return 'RUC';

    return I18n.get('identification', 'identificación');
  }

  return (
    <div className={`w-100 text-${align} py-2 d-flex flex-column ${template !== 'classic' ? 'border-top' : ''}`}>

      <h3 className={`h3 font-weight-bold ${template}`}>
        {template !== 'classic' && <strong>{I18n.get('client', 'cliente')}</strong>}
        {renderClientName()}
      </h3>

      {renderAddress(client, country)}

      {!!get(client, 'phonePrimary', null) &&
        <p>
          <strong>{I18n.get('phone', 'teléfono')}</strong>
          {get(client, 'phonePrimary')}
        </p>
      }
      {renderClientIdentification(client, fullClient, country)}

      {!!getIVACondition(client, country) && (
        <p>
          <strong>{I18n.get('ivaCondition', 'Condición de IVA')}</strong>
          {getIVACondition(client, country)}
        </p>
      )}
    </div>
  )
};

export default Client;