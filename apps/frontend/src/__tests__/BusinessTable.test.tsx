import { render, screen, waitFor } from '@testing-library/react';
import { BusinessTable } from '../BusinessTable';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockBusinesses = [
  {
    id: '1',
    name: 'Test Biz',
    address: '123 Main St',
    city: 'Townsville',
    state: 'TS',
    zipCode: '12345',
    latitude: 1.23,
    longitude: 4.56,
    website: 'https://test.biz',
    phoneNumber: '555-1234',
    ownerName: 'Alice',
    yearStarted: 2000,
    starRating: 4.5,
    reviewCount: 10,
    naicsCode: '123456',
    createdAt: '2024-07-25T00:00:00Z',
    updatedAt: '2024-07-25T00:00:00Z',
  },
];

describe('BusinessTable', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading indicator', () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<BusinessTable />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('renders table with businesses', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockBusinesses,
    } as any);
    render(<BusinessTable />);
    await waitFor(() => expect(screen.getByText('Test Biz')).toBeInTheDocument());
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('shows empty message if no businesses', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    } as any);
    render(<BusinessTable />);
    await waitFor(() => expect(screen.getByText(/no businesses/i)).toBeInTheDocument());
  });

  it('shows error message on API error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ detail: { message: 'API fail' } }),
    } as any);
    render(<BusinessTable />);
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/api fail/i));
  });

  it('shows error message on network error', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network down'));
    render(<BusinessTable />);
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.some(a => a.textContent?.toLowerCase().includes('network down'))).toBe(true);
    });
  });
}); 