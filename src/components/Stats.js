import Box from '@mui/material/Box';
import { formatTz } from '../libs/utils';

export default function Stats({ totalSalesCount, totalSalesVolume }) {
  return (
    <Box>
      <div>Sales: {totalSalesCount}</div>
      <div>Volume: {formatTz(totalSalesVolume)}</div>
    </Box>
  );
}
