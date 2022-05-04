import { useState } from 'react';
import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
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
  const [orderColumn, setOrderColumn] = useState('sales_count');
  const { tokens, totalSalesCount, totalSalesVolume, error } = useTokensByTags([TAG, `#${TAG}`], orderColumn);

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  if (!tokens) {
    return 'loading...';
  }

  return (
    <div className="App">
      <h1>#{TAG}</h1>
      <Stats totalSalesCount={totalSalesCount} totalSalesVolume={totalSalesVolume} />
      <ButtonGroup size="large">
        <Button
          onClick={() => {
            setOrderColumn('sales_count');
          }}
        >
          By Sales {orderColumn === 'sales_count' ? '*' : ''}
        </Button>
        <Button
          onClick={() => {
            setOrderColumn('minted_at');
          }}
        >
          By Creation {orderColumn === 'minted_at' ? '*' : ''}
        </Button>
      </ButtonGroup>
      <TokenGrid tokens={tokens} />
    </div>
  );
}

export default App;
