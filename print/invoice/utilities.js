import { I18n } from '@aws-amplify/core';
import { get, has, repeat, isString, lowerCase } from 'lodash';
import dayjs from 'dayjs';

import argentinaIVAConditions from '../../countriesData/argentina/ivaConditions'
import argentinaIibbConditions from '../../countriesData/argentina/conditionsIibb'

import { fiscalResponsabilities as colombiaFiscalResponsabilities } from '../../countriesData/colombia/fiscalResponsabilities'

export const calculateDV = identification => {
  const id = identification;
  let dv = null;
  if (!id || id.length > 15) {
    return '';
  }

  const primeNumbers = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  let totalSum = 0;

  for (let i = 0; i < id.length; i++) {
    totalSum += (id[i] * primeNumbers[id.length - i - 1]);
  }

  const mod = totalSum % 11;

  dv = [0, 1].indexOf(mod) !== -1 ? mod : 11 - mod;
  return dv;
}

export const getID = entity => {
  if (!entity) return '';
  let identification = '';

  if (!!get(entity, 'identificationObject', null)) {
    const number = get(entity, 'identificationObject.number')
    const type = get(entity, 'identificationObject.type')

    if (get(entity, 'identificationObject.type', null) === 'NIT')
      identification = `${type || ''} ${number || ''}-${calculateDV(number)}`
    else
      identification = `${type || ''} ${number || ''}`
  } else
    identification = !!get(entity, 'identification', null)
      ? get(entity, 'identification') : ''

  if (!!identification && !isString(identification)) {
    const number = get(identification, 'number')
    const type = get(identification, 'type')

    identification = `${type || ''} ${number || ''}`
  }

  return identification;
}

export const renderAddress = (entity, country) => {
  let address = [];
  switch (country) {
    case 'colombia':
      address.push(!!get(entity, 'address.address') ? get(entity, 'address.address') : '')
      address.push(!!get(entity, 'address.city') ? get(entity, 'address.city') : '')
      address.push(!!get(entity, 'address.department') ? get(entity, 'address.department') : '')
      break

    case 'costaRica':
      address.push(!!get(entity, 'address.address') ? get(entity, 'address.address') : '')
      address.push(!!get(entity, 'address.city') ? get(entity, 'address.city') : '')
      address.push(!!get(entity, 'address.department') ? get(entity, 'address.department') : '')
      break

    case 'argentina':
      address.push(!!get(entity, 'address.address') ? get(entity, 'address.address') : '')
      address.push(!!get(entity, 'address.city')
        ? lowerCase(get(entity, 'address.city')) === 'ciudad autonoma de buenos aires'
          ? 'CABA'
          : get(entity, 'address.city')
        : ''
      )
      address.push(!!get(entity, 'address.province')
        ? lowerCase(get(entity, 'address.province')) === 'ciudad autonoma de buenos aires'
          ? 'CABA'
          : get(entity, 'address.province')
        : ''
      )
      break

    case 'republicaDominicana':
      address.push(!!get(entity, 'address.address') ? get(entity, 'address.address') : '')
      address.push(!!get(entity, 'address.description') ? get(entity, 'address.description') : '')
      address.push(!!get(entity, 'address.municipality') ? get(entity, 'address.municipality') : '')
      address.push(!!get(entity, 'address.province') ? get(entity, 'address.province') : '')
      break

    case 'peru':
      address.push(!!get(entity, 'address.address') ? get(entity, 'address.address') : '')
      address.push(!!get(entity, 'address.urbanization') ? get(entity, 'address.urbanization') : '')
      address.push(!!get(entity, 'address.district') ? get(entity, 'address.district') : '')
      address.push(!!get(entity, 'address.city') ? get(entity, 'address.city') : '')
      address.push(!!get(entity, 'address.state') ? get(entity, 'address.state') : '')
      address.push(!!get(entity, 'address.ubigeoCode') ? get(entity, 'address.ubigeoCode') : '')
      break

    case 'mexico':
      address.push(!!get(entity, 'address.street') ? get(entity, 'address.street') : '')
      address.push(!!get(entity, 'address.exteriorNumber') ? get(entity, 'address.exteriorNumber') : '')
      address.push(!!get(entity, 'address.interiorNumber') ? get(entity, 'address.interiorNumber') : '')
      address.push(!!get(entity, 'address.colony') ? get(entity, 'address.colony') : '')
      address.push(!!get(entity, 'address.municipality') ? get(entity, 'address.municipality') : '')
      address.push(!!get(entity, 'address.locality') ? get(entity, 'address.locality') : '')
      address.push(!!get(entity, 'address.state') ? get(entity, 'address.state') : '')
      address.push(!!get(entity, 'address.zipCode') ? get(entity, 'address.zipCode') : '')
      address.push(!!get(entity, 'address.country') ? get(entity, 'address.country') : '')
      break

    case 'panama':
      if (get(entity, 'name', '') === 'Consumidor final' && get(entity, 'identification', '') === '')
        break;
      address.push(!!get(entity, 'address.address') ? get(entity, 'address.address') : '')
      address.push(!!get(entity, 'address.city') ? get(entity, 'address.city') : '')
      break;

    default:
      address.push(!!get(entity, 'address.address') ? get(entity, 'address.address') : '')
      address.push(!!get(entity, 'address.city') ? get(entity, 'address.city') : '')
      break
  }
  return address.filter(d => d !== '').join(', ');
}

export const getDocumentType = (invoice, numerations) => {
  if (!numerations || !numerations.find) return null;

  const numerationDocumentType = numerations.find(numeration => get(numeration, 'id') === get(invoice, 'numberTemplate.id'));
  return numerationDocumentType ? get(numerationDocumentType, 'documentType') : null;
}

export const getSubDocumentType = (invoice, numerations) => {
  if (!numerations || !numerations.find) return null;

  const numerationSubDocumentType = numerations.find(numeration => get(numeration, 'id') === get(invoice, 'numberTemplate.id'));
  return numerationSubDocumentType ? get(numerationSubDocumentType, 'subDocumentType') : null;
}

export const getIsElectronic = (invoice, numerations) => {
  if (!numerations || !numerations.find) return null;

  const numerationDocumentType = numerations.find(numeration => get(numeration, 'id') === get(invoice, 'numberTemplate.id'));
  return get(numerationDocumentType, 'isElectronic', null);
}

export const getNumerationEndDate = (invoice, numerations) => {
  if (!numerations || !numerations.find) return null;

  const numerationDocumentType = numerations.find(numeration => get(numeration, 'id') === get(invoice, 'numberTemplate.id'));
  return get(numerationDocumentType, 'endDate', null);
}

export const getInvoiceType = (invoice, country, numerations) => {
  if (!invoice) return ''

  const number = getInvoiceNumber(invoice);
  const templateDocumentType = getDocumentType(invoice, numerations);
  const isElectronic = getIsElectronic(invoice, numerations);

  if (country === 'republicaDominicana') {
    switch (invoice.numberTemplate?.prefix) {
      case 'B01':
        return I18n.get('taxCreditInvoice', 'Factura de Crédito Fiscal');
      case 'B02':
        return I18n.get('consumptionInvoice', 'Factura de Consumo');
      case 'B14':
        return I18n.get('specialTaxationRegimeInvoice', 'Factura de Régimen Especial de Tributación');
      case 'B15':
        return I18n.get('governmentInvoice', 'Factura Gubernamental');
      case 'E31':
        return I18n.get('taxElectronicCreditInvoice', 'Factura electrónica de crédito fiscal');
      case 'E32':
        return I18n.get('consumptionElectronicInvoice', 'Factura electrónica de consumo');
      default:
        return I18n.get('invoiceNFC', 'Factura/NFC');
    }
  };

  if (country === 'peru') {
    if (/B.{3}/.test(number) && isElectronic) {
      return I18n.get('electronicTicket', 'boleta electrónica');
    }
    else if (/F.{3}/.test(number) && isElectronic)
      return I18n.get('electronicInvoice', 'factura electrónica');
    else if (templateDocumentType !== 'invoice')
      return I18n.get('saleTicket', 'boleta de venta')
    else
      return I18n.get('invoiceOfSale', 'factura de venta')
  }

  if (country === 'colombia' && !!get(invoice, 'stamp', null))
    return I18n.get('electronicSalesInvoice', 'factura electrónica de venta');
  if (country === 'colombia' && templateDocumentType === 'invoice')
    return I18n.get('paperSalesInvoice', 'factura de venta de papel');
  if (country === 'colombia')
    return I18n.get('equivalentDocumentPOSSystem', 'documento equivalente sistema P.O.S.');

  if (country === 'panama' && !!get(invoice, 'stamp', null))
    return I18n.get('internalOperationInvoice', 'Factura de operación interna');

  return I18n.get('invoice', 'factura');
}

export const getInvoiceSubType = (invoice, country, numerations) => {
  if (!invoice) return ''

  const templateSubDocumentType = getSubDocumentType(invoice, numerations)

  if (country === 'argentina') {
    switch (templateSubDocumentType) {
      case 'INVOICE_A':
        return 'A'
      case 'INVOICE_B':
        return 'B'
      case 'INVOICE_C':
        return 'C'
      case 'INVOICE_X':
        return 'X'
      default:
        return null
    }
  }

  return null
}

const getFormattedNumber = (invoice, country) => {
  if (!invoice) return null;

  let number = !!get(invoice, 'numberTemplate.number', null)
    ? '' + get(invoice, 'numberTemplate.number', null) : null;

  switch (country) {
    case 'peru':
      return `${!!number ? repeat('0', 8 - number.length) : ''}${number || ''}`
    case 'argentina':
      return `${!!number ? repeat('0', 8 - number.length) : ''}${number || ''}`
    case 'costaRica':
      if (!!get(invoice, 'numberTemplate.stamp', null))
        return `${!!number ? repeat('0', 10 - number.length) : ''}${number || ''}`
      return number;
    case 'republicaDominicana':
      return `${!!number ? repeat('0', 8 - number.length) : ''}${number || ''}`
    case 'panama':
      return `${!!number ? repeat('0', 10 - number.length) : ''}${number || ''}`
    default:
      return number;
  }
}

export const getInvoiceNumber = (invoice, country) => {
  if (!invoice) return null;

  if (!get(invoice, 'numberTemplate', null)) return null;

  const valuePrefix = country === 'republicaDominicana'
    ? invoice.numberTemplate.isElectronic ? 'e-NCF' : 'NCF' : 'N°'

  const fullNumber = get(invoice, 'numberTemplate.fullNumber', null);
  const prefix = !!get(invoice, 'numberTemplate.prefix', null)
    ? get(invoice, 'numberTemplate.prefix', null) : '';
  let formattedNumber = getFormattedNumber(invoice, country);

  if (!!fullNumber && country !== 'panama')
    return `${valuePrefix} ${fullNumber || ''}`;

  switch (country) {
    case 'peru':
      return `${valuePrefix} ${prefix ? `${prefix}-` : ''}${formattedNumber || ''}`;
    case 'argentina':
      return `${valuePrefix} ${prefix ? `${prefix}-` : ''}${formattedNumber || ''}`;
    case 'panama':
      return `${valuePrefix} ${formattedNumber || ''}`;
    default:
      return `${valuePrefix} ${prefix || ''}${formattedNumber || ''}`;
  }
}

export const getPrefix = (invoice, country) => {
  if (!invoice || !get(invoice, 'numberTemplate', null)) return null;

  const prefix = get(invoice, 'numberTemplate.prefix', '') || '';

  if (country === 'panama' && !!prefix) return `${repeat('0', 3 - prefix.length)}${prefix}`;

  return prefix;
}

export const getDateTimeTitle = (invoice, country, numerations) => {
  const templateDocumentType = getDocumentType(invoice, numerations);
  if (['panama', 'republicaDominicana'].includes(country) && !!get(invoice, 'stamp'))
    return I18n.get("emissionDate", "Fecha de emisión");

  if (country === 'colombia' && !!get(invoice, 'stamp'))
    return I18n.get("emissionDate", "Fecha de emisión");

  if (country === 'colombia' && templateDocumentType === 'invoice')
    return I18n.get("emissionDate", "Fecha de emisión");

  if (country === 'colombia')
    return I18n.get("emissionDate", "Fecha de emisión");

  return I18n.get('date', 'fecha');
}

export const getDateTime = (invoice, country, dateFormat, typeDate = '') => {

  let datetime;
  if (!!get(invoice, 'stamp.date'))
    datetime = get(invoice, 'stamp.date');
  else if (!!get(invoice, 'createdAt'))
    datetime = get(invoice, 'createdAt');
  else if (!!get(invoice, 'datetime'))
    datetime = get(invoice, 'datetime');
  else
    datetime = get(invoice, 'timestamp');

  if (country === "peru" && !!get(invoice, 'stamp')) {
    return dayjs(datetime).isValid() ? dayjs(datetime).format('YYYY-MM-DDTHH:mm:ss') : '';
  }

  if (country === "colombia") {
    if (typeDate === 'stamp') {
      const datetime = get(invoice, 'stamp.date');
      return dayjs(datetime).isValid() ? dayjs(datetime).format('DD/MM/YYYY h:mm a') : I18n.get('dateTimeFormat', 'DD/MM/YYYY');
    }
    if (typeDate === 'datetime') {
      const datetime = get(invoice, 'datetime');
      return dayjs(datetime).isValid() ? dayjs(datetime).format('DD/MM/YYYY h:mm a') : I18n.get('dateTimeFormat', 'DD/MM/YYYY');
    }
    return dayjs(datetime).isValid() ? dayjs(datetime).format('DD/MM/YYYY h:mm a') : I18n.get('dateTimeFormat', 'DD/MM/YYYY');
  }

  return dayjs(datetime).isValid() ? dayjs(datetime).format(!!dateFormat ? `${dateFormat.toUpperCase()} h:mm a` : I18n.get('dateTimeFormat', 'DD/MM/YYYY h:mm a')) : '';
}

export const getDueDate = (invoice, dateFormat) => {
  let date = get(invoice, 'dueDate', null)
  return dayjs(date).isValid() ? dayjs(date).format(!!dateFormat ? dateFormat.toUpperCase() : I18n.get('dateFormat', 'DD/MM/YYYY')) : '';
}

export const getActivityStartDate = (company, country, dateFormat) => {
  let date = null
  if (country === 'argentina')
    date = get(company, 'activityStartDate', null)

  return dayjs(date).isValid() ? dayjs(date).format(!!dateFormat ? dateFormat.toUpperCase() : I18n.get('dateFormat', 'DD/MM/YYYY')) : '';
}

export const getInvoicePaymentMethd = (invoice, country, numerations) => {
  const paymentForm = getInvoicePaymentForm(invoice, country, numerations);

  if (country === 'colombia' && paymentForm === I18n.get('credit', 'Crédito')) return "";
  let method = "";

  if (invoice.payments)
    invoice.payments.forEach(payment => {
      if (has(payment, 'paymentMethod')) {
        method += method === "" ? "" : ", ";
        method += I18n.get(payment.paymentMethod, payment.paymentMethod);
      }
    });

  return method === "" ? I18n.get('cash', 'efectivo') : method;
}

export const getInvoicePaymentForm = (invoice, country, numerations) => {
  const templateDocumentType = getDocumentType(invoice, numerations)

  switch (country) {
    case 'peru':
      if (templateDocumentType === 'invoice')
        return I18n.get('paymentForm.Cash', 'Contado')
      break;
    case 'colombia':
      const fullPaid = Number(invoice.total) === Number(invoice.totalPaid)
      return fullPaid ? I18n.get('paymentForm.Cash', 'Contado') : I18n.get('credit', 'Crédito')
    default:
      break;
  }
  return ''
}

export const getInvoiceSaleCondition = (invoice, country) => {
  if (!!get(invoice, 'saleCondition')) {
    if (country === 'argentina') {
      switch (get(invoice, 'saleCondition')) {
        case 'CASH':
          return I18n.get('cash', 'Contado')
        case 'DEBIT_CARD':
          return I18n.get('debitCard', 'Tarjeta débito')
        case 'CREDIT_CARD':
          return I18n.get('creditCard', 'Tarjeta crédito')
        case 'TRANSFER':
          return I18n.get('transfer', 'Transferencia')
        default:
          return null;
      }
    }
    if (country === 'costaRica' || country === 'colombia') {
      switch (get(invoice, 'saleCondition')) {
        case '01':
        case 'CASH':
          return I18n.get('paymentForm.Cash', 'Contado')
        case '02':
        case 'CREDIT':
          return I18n.get('credit', 'Crédito')
        default:
          return null;
      }
    }
  }
  return null
}

export const getInvoicePaymentType = (invoice) => {
  const isFree = invoice.items.every(item => item.discount === 100)
  const fullPaid = Number(invoice.total) === Number(get(invoice, 'payments[0].amount'))
  return isFree
    ? I18n.get('free', 'Gratis')
    : fullPaid
      ? I18n.get('paymentForm.Cash', 'Contado')
      : I18n.get('credit', 'Crédito')
}

export const getInvoiceSaleConcept = (invoice) => {
  if (get(invoice, 'saleConcept')) {
    switch (get(invoice, 'saleConcept')) {
      case 'SERVICES':
        return I18n.get('services', 'Servicios')
      case 'PRODUCTS':
        return I18n.get('products', 'Productos')
      case 'PRODUCTS_SERVICES':
        return I18n.get('productsAndServices', 'Productos y servicios')

      default:
        return null
    }
  }
  return null
}

export const getIVACondition = (entity, country) => {
  if (country === 'argentina') {
    return !!argentinaIVAConditions.find(condition => condition.key === get(entity, 'ivaCondition'))
      ? argentinaIVAConditions.find(condition => condition.key === get(entity, 'ivaCondition')).value
      : null
  }

  return null
}

export const getIibbCondition = (company, country) => {
  if (country === 'argentina')
    return !!argentinaIibbConditions.find(condition => condition.key === get(company, 'conditionIibb'))
      ? argentinaIibbConditions.find(condition => condition.key === get(company, 'conditionIibb')).value
      : null

  return null
}

export const getRegime = (company, country) => {
  if (country === 'argentina' || country === 'usa')
    return null

  if (!!get(company, 'regime'))
    return get(company, 'regime', null)

  return null
}

export const getFiscalResponsabilities = (company, country) => {
  let fiscalResponsabilitiesNames = [];
  switch (country) {
    case 'colombia':
      const fiscalResponsabilities = get(company, 'fiscalResponsabilities', []);
      if (!fiscalResponsabilities || fiscalResponsabilities.length === 0) return ''
      fiscalResponsabilities.forEach((res) => {
        const item = colombiaFiscalResponsabilities.find(fiscal => fiscal.id === +res);
        if (item) {
          fiscalResponsabilitiesNames.push(item.value);
        }
      })
      return fiscalResponsabilitiesNames.length > 0 ? fiscalResponsabilitiesNames.join('-') : ''
    default:
      return ''
  }
}