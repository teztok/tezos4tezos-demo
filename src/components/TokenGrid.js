import { useState } from 'react';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import Token from './Token';

export default function TokenGrid({ tokens }) {
  // Filtering
  const [value, setValue] = useState('');
  const handleFiltering = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ mr: 4, borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleFiltering} textColor="secondary" indicatorColor="secondary">
            <Tab label="All" value="" />
            <Tab label="Teia" value="HEN" />
            <Tab label="Objkt" value="OBJKT" />
            <Tab label="Versum" value="VERSUM" />
            <Tab label="8bidou" value="8BIDOU" disabled />
            <Tab label="fxhash" value="FXHASH" disabled />
          </TabList>
        </Box>
      </TabContext>
      <Box sx={{ mt: 5 }}>
        <Masonry columns={{ maximum: 6, desktop: 5, laptop: 4, tablet: 3, tablet_portrait: 2, mobile: 1 }} spacing={4}>
          {tokens.map((token) => (
            <Token token={token} key={`${token.fa2_address}_${token.token_id}`} />
          ))}
        </Masonry>
      </Box>
    </>
  );
}
