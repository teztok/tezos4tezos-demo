import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Token from './Token';

export default function TokenGrid({ tokens }) {
  return (
    <Box sx={{ mt: 5 }}>
      <Masonry columns={{ maximum: 6, desktop: 5, laptop: 4, tablet: 3, tablet_portrait: 2, mobile: 1 }} spacing={4}>
        {tokens.map((token) => (
          <Token token={token} key={`${token.fa2_address}_${token.token_id}`} />
        ))}
      </Masonry>
    </Box>
  );
}
