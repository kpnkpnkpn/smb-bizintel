import { TextInput, Select, NumberInput, Button, Stack, Group, Title } from '@mantine/core';
import { useFilterStore } from './filterStore';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export function FilterPanel({ onApply }: { onApply?: () => void }) {
  const {
    name, city, starRating, naicsCode, yearStarted,
    setName, setCity, setStarRating, setNaicsCode, setYearStarted, reset
  } = useFilterStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);
  const [naicsOptions, setNaicsOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingNaics, setLoadingNaics] = useState(false);
  const [errorCities, setErrorCities] = useState<string | null>(null);
  const [errorNaics, setErrorNaics] = useState<string | null>(null);

  useEffect(() => {
    setLoadingCities(true);
    setErrorCities(null);
    fetch('/api/businesses/cities')
      .then(res => res.json())
      .then(data => {
        setCityOptions(data.map((c: string) => ({ value: c, label: c })));
        setLoadingCities(false);
      })
      .catch(e => {
        setErrorCities('Failed to load cities');
        setLoadingCities(false);
      });
    setLoadingNaics(true);
    setErrorNaics(null);
    fetch('/api/businesses/naics-codes')
      .then(res => res.json())
      .then(data => {
        setNaicsOptions(data.map((n: { code: string; description: string }) => ({ value: n.code, label: `${n.code} - ${n.description}` })));
        setLoadingNaics(false);
      })
      .catch(e => {
        setErrorNaics('Failed to load NAICS codes');
        setLoadingNaics(false);
      });
  }, []);

  return (
    <aside
      aria-label="Filter Panel"
      role="region"
      aria-labelledby="filter-panel-heading"
      style={{
        width: '100%',
        maxWidth: isMobile ? '100%' : 360,
        minWidth: isMobile ? '100%' : 240,
        padding: 16,
        boxSizing: 'border-box',
      }}
    >
      <Stack gap="md">
        <Title
          id="filter-panel-heading"
          order={3}
          style={{ marginBottom: 8, position: 'relative' }}
        >
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            Filter Panel
          </span>
          Filters
        </Title>
        <TextInput
          label="Business Name"
          placeholder="Enter name"
          aria-label="Business Name"
          data-testid="filter-name"
          value={name}
          onChange={e => setName(e.currentTarget.value)}
        />
        <Select
          label="City"
          placeholder={loadingCities ? "Loading..." : errorCities ? errorCities : "Select city"}
          aria-label="City"
          data-testid="filter-city"
          data={cityOptions}
          searchable
          clearable
          value={city}
          onChange={v => setCity(v || '')}
          disabled={loadingCities || !!errorCities}
        />
        <NumberInput
          label="Star Rating (min)"
          placeholder="e.g. 4.0"
          min={0}
          max={5}
          step={0.1}
          precision={1}
          aria-label="Star Rating"
          data-testid="filter-star-rating"
          value={starRating}
          onChange={v => setStarRating(typeof v === 'number' ? v : null)}
        />
        <Select
          label="NAICS Code"
          placeholder={loadingNaics ? "Loading..." : errorNaics ? errorNaics : "Select NAICS code"}
          aria-label="NAICS Code"
          data-testid="filter-naics"
          data={naicsOptions}
          searchable
          clearable
          value={naicsCode}
          onChange={v => setNaicsCode(v || '')}
          disabled={loadingNaics || !!errorNaics}
        />
        <NumberInput
          label="Year Started"
          placeholder="e.g. 2010"
          min={1800}
          max={new Date().getFullYear()}
          step={1}
          aria-label="Year Started"
          data-testid="filter-year-started"
          value={yearStarted}
          onChange={v => setYearStarted(typeof v === 'number' ? v : null)}
        />
        <Group justify="flex-end" mt="md">
          <Button type="button" variant="default" onClick={reset} aria-label="Reset Filters" data-testid="reset-filters">
            Reset
          </Button>
          <Button
            type="button"
            variant="filled"
            color="blue"
            aria-label="Apply Filters"
            data-testid="apply-filters"
            onClick={onApply}
          >
            Apply Filters
          </Button>
        </Group>
      </Stack>
    </aside>
  );
}

export default FilterPanel; 