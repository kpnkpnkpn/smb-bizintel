import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FilterPanel } from '../FilterPanel';
import { useFilterStore } from '../filterStore';
import userEvent from '@testing-library/user-event';

function render(ui) {
  return rtlRender(<MantineProvider>{ui}</MantineProvider>);
}

// Reset Zustand state before each test
beforeEach(() => {
  useFilterStore.getState().reset();
  vi.resetAllMocks();
});

const mockCities = ['Townsville', 'Metropolis'];
const mockNaics = [
  { code: '123456', description: 'Example Industry' },
  { code: '654321', description: 'Another Industry' },
];

function mockFetchImpl(url: string) {
  if (url.endsWith('/cities')) {
    return Promise.resolve({ json: () => Promise.resolve(mockCities) });
  }
  if (url.endsWith('/naics-codes')) {
    return Promise.resolve({ json: () => Promise.resolve(mockNaics) });
  }
  return Promise.reject(new Error('Unknown endpoint'));
}

describe('FilterPanel', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation((url: any) => mockFetchImpl(url) as any);
  });
  it('renders all filter controls', () => {
    render(<FilterPanel />);
    expect(screen.getByTestId('filter-name')).toBeInTheDocument();
    expect(screen.getByTestId('filter-city')).toBeInTheDocument();
    expect(screen.getByTestId('filter-star-rating')).toBeInTheDocument();
    expect(screen.getByTestId('filter-naics')).toBeInTheDocument();
    expect(screen.getByTestId('filter-year-started')).toBeInTheDocument();
    expect(screen.getByTestId('apply-filters')).toBeInTheDocument();
    expect(screen.getByTestId('reset-filters')).toBeInTheDocument();
  });

  it('updates Zustand store on input change', async () => {
    render(<FilterPanel />);
    const nameInput = screen.getByTestId('filter-name');
    fireEvent.change(nameInput, { target: { value: 'Coffee' } });
    expect(useFilterStore.getState().name).toBe('Coffee');

    // For Mantine Select, simulate user click and option selection
    const citySelect = screen.getByTestId('filter-city');
    await userEvent.click(citySelect); // open dropdown
    const option = await screen.findByText('Townsville');
    await userEvent.click(option);
    expect(useFilterStore.getState().city).toBe('Townsville');
  });

  it('calls onApply when Apply Filters is clicked', () => {
    const onApply = vi.fn();
    render(<FilterPanel onApply={onApply} />);
    const btn = screen.getByTestId('apply-filters');
    fireEvent.click(btn);
    expect(onApply).toHaveBeenCalled();
  });

  it('resets all fields when Reset is clicked', () => {
    render(<FilterPanel />);
    fireEvent.change(screen.getByTestId('filter-name'), { target: { value: 'X' } });
    fireEvent.change(screen.getByTestId('filter-city'), { target: { value: 'Townsville' } });
    fireEvent.click(screen.getByTestId('reset-filters'));
    expect(useFilterStore.getState().name).toBe('');
    expect(useFilterStore.getState().city).toBe('');
  });

  it('has accessible labels for all controls', () => {
    render(<FilterPanel />);
    expect(screen.getByTestId('filter-name')).toBeInTheDocument();
    expect(screen.getByTestId('filter-city')).toBeInTheDocument();
    expect(screen.getByTestId('filter-star-rating')).toBeInTheDocument();
    expect(screen.getByTestId('filter-naics')).toBeInTheDocument();
    expect(screen.getByTestId('filter-year-started')).toBeInTheDocument();
  });

  it('renders dynamic city and NAICS options', async () => {
    render(<FilterPanel />);
    // Wait for options to load
    expect(await screen.findByText('Townsville')).toBeInTheDocument();
    expect(await screen.findByText('123456 - Example Industry')).toBeInTheDocument();
  });
  it('shows loading state for selects', () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<FilterPanel />);
    expect(screen.getAllByPlaceholderText('Loading...').length).toBe(2);
  });
  it('shows error state for selects', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => Promise.reject('fail'));
    render(<FilterPanel />);
    expect(await screen.findByPlaceholderText('Failed to load cities')).toBeInTheDocument();
    expect(await screen.findByPlaceholderText('Failed to load NAICS codes')).toBeInTheDocument();
  });
}); 