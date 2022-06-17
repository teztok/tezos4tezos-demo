import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

export function shortenTzAddress(address) {
  return `${address.substr(0, 5)}…${address.substr(-5)}`;
}

export function getUsername(data, field) {
  if (!data[`${field}_address`]) {
    return '';
  }

  return get(data, `${field}_profile.twitter`) ? `@${get(data, `${field}_profile.twitter`)}` : shortenTzAddress(data[`${field}_address`]);
}

export function formatTz(amount) {
  if (!isNumber(amount)) {
    return '–';
  }

  const amountFixed = (amount / 1000000).toFixed(2);
  return `${amountFixed.endsWith('.00') ? amountFixed.slice(0, -3) : amountFixed} ꜩ`;
}

export function ipfsToGatewayUri(ipfsUri) {
  const ipfsHash = ipfsUri.replace('ipfs://', '');
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}
