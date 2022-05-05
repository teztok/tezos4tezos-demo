import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatTz } from '../libs/utils';
import theme from '../theme';

export default function Stats({ totalTokensCount, totalArtistsCount, totalSalesCount, totalSalesVolume }) {
  return (
    <Box
      sx={{
        [theme.breakpoints.down('tablet_portrait')]: {
          mt: 2,
        },
      }}
    >
      <Stack direction="row" spacing={4} alignItems="center">
        <Typography variant="body2" component="p" color="primary">
          <strong>Artists</strong>
          <br />
          {totalArtistsCount}
        </Typography>
        <Typography variant="body2" component="p" color="primary">
          <strong>Artworks</strong>
          <br />
          {totalTokensCount}
        </Typography>
        <Typography variant="body2" component="p" color="primary">
          <strong>Sales</strong>
          <br />
          {totalSalesCount}
        </Typography>
        <Typography variant="body2" component="p" color="primary">
          <strong>Volume</strong>
          <br />
          {formatTz(totalSalesVolume)}
        </Typography>
      </Stack>
    </Box>
  );
}
