import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';

export default function PlatformFilters({ filters, onChange, platform }) {
  return (
    <TabContext value={platform}>
      <Box sx={{ mr: 4, borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={(ev, val) => onChange(val)} textColor="secondary" indicatorColor="secondary">
          {filters.map(({ label, value, count }) => (
            <Tab disabled={!count} key={value} label={`${label} (${count})`} value={value} />
          ))}
        </TabList>
      </Box>
    </TabContext>
  );
}
