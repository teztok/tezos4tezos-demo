import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

export default function PlatformFilters({ filters, onChange, platform }) {
  return (
    <ButtonGroup size="large">
      {filters.map(({ label, value, count }) => (
        <Button
          key={value}
          disabled={count === 0}
          onClick={() => {
            onChange(value);
          }}
        >
          {label} ({count}) {platform === value ? '*' : ''}
        </Button>
      ))}
    </ButtonGroup>
  );
}
