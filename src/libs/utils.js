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

function getIpfsUri(token) {
  const platform = token.platform;

  if (platform === 'HEN') {
    return token.display_uri;
  }

  if (
    platform === 'FXHASH' &&
    token.thumbnail_uri === 'ipfs://QmbvEAn7FLMeYBDroYwBP8qWc3d3VVWbk19tTB83LCMB5S' &&
    token.fx_collection_thumbnail_uri
  ) {
    return token.fx_collection_thumbnail_uri;
  }

  return token.thumbnail_uri;
}

export function getPreviewImage(token) {
  const ipfsUri = getIpfsUri(token);

  if (!ipfsUri) {
    return null; // TODO: placeholder image
  }

  const ipfsHash = ipfsUri.replace('ipfs://', '');

  if (token.platform === 'FXHASH') {
    return `https://gateway.fxhash.xyz/ipfs/${ipfsHash}`;
  }

  return `https://ipfs.io/ipfs/${ipfsHash}`;
}
