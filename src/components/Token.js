import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { ipfsToCloudflareUri, getUsername, formatTz } from '../libs/utils';

export default function Token({ token }) {
  return (
    <ImageListItem key={token.token_id}>
      <img src={ipfsToCloudflareUri(token.display_uri)} alt={token.name} loading="lazy" />
      <ImageListItemBar
        title={token.name}
        subtitle={`${getUsername(token, 'artist')}, price: ${formatTz(token.price)}, editions: ${token.editions}, sales: ${
          token.sales_count
        }`}
        actionIcon={
          <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }} aria-label={`info about ${token.name}`}>
            <InfoIcon />
          </IconButton>
        }
      />
    </ImageListItem>
  );
}
