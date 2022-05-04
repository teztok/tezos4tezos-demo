import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import Token from './Token';

export default function TokenGrid({ tokens }) {
  return (
    <Box sx={{ overflowY: 'scroll' }}>
      <ImageList variant="masonry" cols={6} gap={8}>
        {tokens.map((token) => (
          <Token token={token} key={`${token.fa2_address}_${token.token_id}`} />
        ))}
      </ImageList>
    </Box>
  );
}
