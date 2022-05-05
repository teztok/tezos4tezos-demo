import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { ipfsToCloudflareUri, getUsername, formatTz } from '../libs/utils';

function getTokenLink(token) {
  switch (token.platform) {
    case 'HEN': {
      return `https://teia.art/objkt/${token.token_id}`;
    }
    case 'FXHASH': {
      return `https://www.fxhash.xyz/gentk/${token.token_id}`;
    }
    case 'VERSUM': {
      return `https://versum.xyz/token/versum/${token.token_id}`;
    }
    case '8BIDOU': {
      if (token.fa2_address === 'KT1MxDwChiDwd6WBVs24g1NjERUoK622ZEFp') {
        return `https://www.8bidou.com/listing/?id=${token.token_id}`;
      }

      if (token.fa2_address === 'KT1TR1ErEQPTdtaJ7hbvKTJSa1tsGnHGZTpf') {
        return `https://ui.8bidou.com/item_g/?id=${token.token_id}`;
      }

      if (token.fa2_address === 'KT1VikAWA8wQHLZgHoAGL7Z9kCjgbCEnvWA3') {
        return `https://www.8bidou.com/r_item/?id=${token.token_id}`;
      }
      break;
    }
    default: {
      return `https://objkt.com/asset/${token.fa2_address}/${token.token_id}`;
    }
  }
}

export default function Token({ token }) {
  return (
    <ImageListItem key={token.token_id}>
      <img src={ipfsToCloudflareUri(token.display_uri)} alt={token.name} loading="lazy" />
      <ImageListItemBar
        title={token.name}
        subtitle={
          <>
            <a href={getTokenLink(token)}>#{token.token_id}</a>
            <br />
            platform: {token.platform === 'HEN' ? 'TEIA' : token.platform}
            <br />
            artist: {getUsername(token, 'artist')}
            <br />
            price: {formatTz(token.price)}
            <br />
            editions: {token.editions}
            <br />
            sales: {token.sales_count}
          </>
        }
        actionIcon={
          <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }} aria-label={`info about ${token.name}`}>
            <InfoIcon />
          </IconButton>
        }
      />
    </ImageListItem>
  );
}
