import { useState } from 'react';
import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import laggy from './libs/swr-laggy-middleware';
import Stats from './components/Stats';
import TokenGrid from './components/TokenGrid';
import './App.css';

const TAG = process.env.REACT_APP_TAG || 'tezos4tezos';
const TEZTOK_API = 'https://api.teztok.com/v1/graphql';

const TokensByTagsQuery = gql`
  query TokensByTags($tags: [String], $orderBy: tokens_order_by!) {
    stats: tokens_aggregate(where: { tags: { tag: { _in: $tags } } }) {
      aggregate {
        sum {
          sales_count
          sales_volume
        }
      }
    }
    tokens(where: { tags: { tag: { _in: $tags } }, editions: { _gt: "0" }, display_uri: { _is_null: false } }, order_by: [$orderBy]) {
      fa2_address
      token_id
      platform
      editions
      sales_count
      artist_address
      artist_profile {
        twitter
        alias
      }
      display_uri
      name
      description
      mime_type
      minted_at
      price
      objkt_artist_collection_id
    }
  }
`;

function useTokensByTags(tags, orderColumn) {
  const { data, error, isValidating } = useSWR(
    ['/tokens-by-tag', ...tags, orderColumn],
    () => request(TEZTOK_API, TokensByTagsQuery, { tags, orderBy: { [orderColumn]: 'desc' } }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      use: [laggy],
    }
  );

  return {
    tokens: data && data.tokens,
    totalSalesCount: data && data.stats.aggregate.sum.sales_count,
    totalSalesVolume: data && data.stats.aggregate.sum.sales_volume,
    error,
    isLoading: isValidating,
  };
}

function App() {
  // Sorting
  const [type, setSorting] = useState('minted_at');
  const handleSorting = (event) => {
    setSorting(event.target.value);
    setOrderColumn(event.target.value);
  };

  const [orderColumn, setOrderColumn] = useState('minted_at');
  const { tokens, totalSalesCount, totalSalesVolume, error } = useTokensByTags([TAG, `#${TAG}`], orderColumn);

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  if (!tokens) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <div className="App">
      <Box
        sx={{
          m: 4,
          mr: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Stack direction="row" spacing={6} alignItems="center" sx={{ width: '75%' }}>
            <Typography variant="h1" component="h1" color="primary">
              #{TAG}
            </Typography>
            <Stats totalSalesCount={totalSalesCount} totalSalesVolume={totalSalesVolume} />
          </Stack>
          <FormControl sx={{ m: 1, mr: 4, ml: 'auto', minWidth: 120 }} size="small">
            <InputLabel>Sort by</InputLabel>
            <Select value={type} label="Sort by" onChange={handleSorting}>
              <MenuItem dense value="sales_count">
                Sales
              </MenuItem>
              <MenuItem dense value="minted_at">
                Minted
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TokenGrid tokens={tokens} />
      </Box>
    </div>
  );
}

export default App;
