import { BusinessTable } from './BusinessTable';
import { FilterPanel } from './FilterPanel';
import { Container, Group } from '@mantine/core';
import { useFilterStore } from './filterStore';
import { useState } from 'react';

function App() {
  const filterState = useFilterStore();
  const [appliedFilters, setAppliedFilters] = useState<{
    name: string;
    city: string;
    starRating: number | null;
    naicsCode: string;
    yearStarted: number | null;
  }>({
    name: '',
    city: '',
    starRating: null,
    naicsCode: '',
    yearStarted: null,
  });

  const handleApply = () => {
    setAppliedFilters({
      name: filterState.name,
      city: filterState.city,
      starRating: filterState.starRating,
      naicsCode: filterState.naicsCode,
      yearStarted: filterState.yearStarted,
    });
  };

  return (
    <Container size="xl" py="md">
      <h1>Business Directory</h1>
      <Group align="flex-start" gap="xl" wrap="nowrap">
        <div style={{ flex: '0 0 28%', minWidth: 240, maxWidth: 360 }}>
          <FilterPanel onApply={handleApply} />
        </div>
        <div style={{ flex: '1 1 0%', width: '100%' }}>
          <BusinessTable filters={appliedFilters} />
        </div>
      </Group>
    </Container>
  );
}

export default App;
