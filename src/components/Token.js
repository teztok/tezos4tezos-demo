import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
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
    <>
      <Box className="item" key={token.token_id}>
        <Link href={getTokenLink(token)}>
          <Box
            sx={{
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              className="artwork"
              src={ipfsToCloudflareUri(token.display_uri)}
              alt={token.name}
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
              }}
            />
            {token.platform != null && (
              <Chip
                label={token.platform === 'HEN' ? 'TEIA' : token.platform}
                color="secondary"
                size="small"
                sx={{
                  pointerEvents: 'none',
                  position: 'absolute',
                  top: 20,
                  left: 20,
                }}
              />
            )}
          </Box>
          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" component="p">
                <strong>Editions</strong>
                <br />
                {token.editions}
              </Typography>
              <Typography variant="body2" component="p">
                <strong>Sales</strong>
                <br />
                {token.sales_count}
              </Typography>
              <Typography variant="body2" component="p">
                <strong>Price</strong>
                <br />
                {formatTz(token.price)}
              </Typography>
              <Chip label={getUsername(token, 'artist')} color="primary" size="small" sx={{ ml: 'auto !important' }} />
            </Stack>
          </Box>
        </Link>
      </Box>
    </>
  );
}
