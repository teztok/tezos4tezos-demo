import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatTz } from '../libs/utils';

export default function Stats({ totalSalesCount, totalSalesVolume }) {
  return (
    <Box>
      <Stack direction="row" spacing={4} alignItems="center">
        <Typography variant="body2" component="p" color="primary">
          <strong>Artists</strong>
          <br />0
        </Typography>
        <Typography variant="body2" component="p" color="primary">
          <strong>Artworks</strong>
          <br />0
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
