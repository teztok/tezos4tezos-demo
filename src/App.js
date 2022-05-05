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
import Stats from './components/Stats';
import PlatformFilters from './components/PlatformFilters';
import TokenGrid from './components/TokenGrid';
import './App.css';

const TAG = process.env.REACT_APP_TAG || 'tezos4tezos';
const TEZTOK_API = 'https://api.teztok.com/v1/graphql';

const TokensByTagsQuery = gql`
  query TokensByTags($tags: [String], $orderBy: tokens_order_by!, $platform: String_comparison_exp!) {
    stats: tokens_aggregate(where: { tags: { tag: { _in: $tags } }, display_uri: { _is_null: false } }) {
      aggregate {
        count
        sum {
          sales_count
          sales_volume
        }
      }
    }
    stats_teia: tokens_aggregate(where: { tags: { tag: { _in: $tags } }, display_uri: { _is_null: false }, platform: { _eq: "HEN" } }) {
      aggregate {
        count
      }
    }
    stats_objkt: tokens_aggregate(where: { tags: { tag: { _in: $tags } }, display_uri: { _is_null: false }, platform: { _eq: "OBJKT" } }) {
      aggregate {
        count
      }
    }
    stats_versum: tokens_aggregate(
      where: { tags: { tag: { _in: $tags } }, display_uri: { _is_null: false }, platform: { _eq: "VERSUM" } }
    ) {
      aggregate {
        count
      }
    }
    stats_8bidou: tokens_aggregate(
      where: { tags: { tag: { _in: $tags } }, display_uri: { _is_null: false }, platform: { _eq: "8BIDOU" } }
    ) {
      aggregate {
        count
      }
    }
    stats_fxhash: tokens_aggregate(
      where: { tags: { tag: { _in: $tags } }, display_uri: { _is_null: false }, platform: { _eq: "FXHASH" } }
    ) {
      aggregate {
        count
      }
    }
    tokens(
      where: { tags: { tag: { _in: $tags } }, editions: { _gt: "0" }, display_uri: { _is_null: false }, platform: $platform }
      order_by: [$orderBy]
    ) {
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
    }
  }
`;

function useTokensByTags(tags, orderColumn, platform) {
  const { data, error, isValidating } = useSWR(
    ['/tokens-by-tag', ...tags, orderColumn, platform],
    () => request(TEZTOK_API, TokensByTagsQuery, { tags, platform: platform ? { _eq: platform } : {}, orderBy: { [orderColumn]: 'desc' } }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  return {
    tokens: data && data.tokens,
    totalTokensCount: data && data.stats.aggregate.count,
    totalSalesCount: data && data.stats.aggregate.sum.sales_count,
    totalSalesVolume: data && data.stats.aggregate.sum.sales_volume,
    teiaTokenCount: data && data.stats_teia.aggregate.count,
    objktTokenCount: data && data.stats_objkt.aggregate.count,
    versumTokenCount: data && data.stats_versum.aggregate.count,
    eightbidouTokenCount: data && data.stats_8bidou.aggregate.count,
    fxhashTokenCount: data && data.stats_fxhash.aggregate.count,
    error,
    isLoading: isValidating,
  };
}

function App() {
  const [orderColumn, setOrderColumn] = useState('sales_count');
  const [platform, setPlatform] = useState(null);
  const {
    tokens,
    totalSalesCount,
    totalSalesVolume,
    totalTokensCount,
    teiaTokenCount,
    objktTokenCount,
    versumTokenCount,
    eightbidouTokenCount,
    fxhashTokenCount,
    error,
  } = useTokensByTags([TAG, `#${TAG}`], orderColumn, platform);

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
        <PlatformFilters
          filters={[
            { label: 'ALL', value: null, count: totalTokensCount },
            { label: 'TEIA', value: 'HEN', count: teiaTokenCount },
            { label: 'OBJKT.COM', value: 'OBJKT', count: objktTokenCount },
            { label: 'VERSUM', value: 'VERSUM', count: versumTokenCount },
            { label: 'FXHASH', value: 'FXHASH', count: fxhashTokenCount },
            { label: '8BIDOU', value: '8BIDOU', count: eightbidouTokenCount },
          ]}
          onChange={(value) => {
            setPlatform(value);
          }}
          platform={platform}
        />

        <TokenGrid tokens={tokens} />
      </Box>
    </div>
  );
}

export default App;
