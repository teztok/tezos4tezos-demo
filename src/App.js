import { useState } from 'react';
import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import GitHubIcon from '@mui/icons-material/GitHub';
import Select from '@mui/material/Select';
import Stats from './components/Stats';
import laggy from './libs/swr-laggy-middleware';
import PlatformFilters from './components/PlatformFilters';
import TokenGrid from './components/TokenGrid';
import theme from './theme';
import './App.css';

const TAG = process.env.REACT_APP_TAG || 'tezos4tezos';
const TEZTOK_API = 'https://api.teztok.com/v1/graphql';
const DEFAULT_LIMIT = 30;

const TokensByTagsQuery = gql`
  query TokensByTags($tags: [String], $orderBy: tokens_order_by!, $platform: String_comparison_exp!, $limit: Int!) {
    stats: tokens_aggregate(where: { tags: { tag: { _in: $tags } }, display_uri: { _is_null: false } }) {
      aggregate {
        count
        artists_count: count(distinct: true, columns: artist_address)
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
      limit: $limit
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

function useTokensByTags(tags, orderColumn, platform, limit) {
  const { data, error, isValidating } = useSWR(
    ['/tokens-by-tag', ...tags, orderColumn, platform, limit],
    () =>
      request(TEZTOK_API, TokensByTagsQuery, {
        tags,
        platform: platform === '__ALL__' ? {} : { _eq: platform },
        limit,
        orderBy: { [orderColumn]: 'desc' },
      }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      use: [laggy],
    }
  );

  return {
    tokens: data && data.tokens,
    totalTokensCount: data && data.stats.aggregate.count,
    totalArtistsCount: data && data.stats.aggregate.artists_count,
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
  const [orderColumn, setOrderColumn] = useState('minted_at');
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [platform, setPlatform] = useState('__ALL__');
  const {
    tokens,
    totalSalesCount,
    totalSalesVolume,
    totalTokensCount,
    totalArtistsCount,
    teiaTokenCount,
    objktTokenCount,
    versumTokenCount,
    eightbidouTokenCount,
    fxhashTokenCount,
    error,
  } = useTokensByTags([TAG, `#${TAG}`], orderColumn, platform, limit);

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
          <Stack
            direction={{ tablet: 'row', tablet_short: 'row', tablet_portrait: 'column', mobile: 'column' }}
            alignItems={{ tablet: 'center', tablet_short: 'center', tablet_portrait: 'start', mobile: 'start' }}
            spacing={6}
            sx={{ width: '75%' }}
          >
            <Typography variant="h1" component="h1" color="primary">
              #{TAG}
            </Typography>
            <Box sx={{ mt: '0 !important' }}>
              <Stats
                totalTokensCount={totalTokensCount}
                totalArtistsCount={totalArtistsCount}
                totalSalesCount={totalSalesCount}
                totalSalesVolume={totalSalesVolume}
              />
            </Box>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 4,
              width: '25%',
              [theme.breakpoints.down('tablet_portrait')]: {
                display: 'none !important',
              },
            }}
          >
            <FormControl sx={{ m: 1, mr: 4, ml: 'auto', minWidth: 120 }} size="small">
              <InputLabel>Sort by</InputLabel>
              <Select value={orderColumn} label="Sort by" onChange={(ev) => setOrderColumn(ev.target.value)}>
                <MenuItem dense value="sales_count">
                  Sales
                </MenuItem>
                <MenuItem dense value="minted_at">
                  Minted
                </MenuItem>
              </Select>
            </FormControl>
            <Link href="https://github.com/teztok/tezos4tezos-demo">
              <GitHubIcon />
            </Link>
          </Box>
        </Box>
        <PlatformFilters
          filters={[
            { label: 'ALL', value: '__ALL__', count: totalTokensCount },
            { label: 'TEIA', value: 'HEN', count: teiaTokenCount },
            { label: 'OBJKT', value: 'OBJKT', count: objktTokenCount },
            { label: 'VERSUM', value: 'VERSUM', count: versumTokenCount },
            { label: 'FXHASH', value: 'FXHASH', count: fxhashTokenCount },
            { label: '8BIDOU', value: '8BIDOU', count: eightbidouTokenCount },
          ]}
          onChange={(value) => {
            setLimit(DEFAULT_LIMIT);
            setPlatform(value);
          }}
          platform={platform}
        />
        <TokenGrid tokens={tokens} />
        {!(tokens.length % DEFAULT_LIMIT) && (
          <Box
            sx={{
              mb: 10,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Button onClick={() => setLimit(limit + DEFAULT_LIMIT)} variant="outlined" size="normal">
              Load more
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default App;
