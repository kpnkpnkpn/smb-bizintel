import { useEffect, useState } from 'react';
import type { Business } from '../../../packages/shared-types';

export function BusinessTable() {
  const [businesses, setBusinesses] = useState<Business[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/businesses');
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.detail?.message || 'Failed to fetch businesses');
        }
        const data = await res.json();
        setBusinesses(data);
      } catch (e: any) {
        setError(e.message || 'Unknown error');
        setBusinesses(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, []);

  if (loading) return <div role="status">Loading...</div>;
  if (error) return <div role="alert">Error: {error}</div>;
  if (!businesses || businesses.length === 0) return <div>No businesses found.</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>address</th>
          <th>city</th>
          <th>state</th>
          <th>zipCode</th>
          <th>latitude</th>
          <th>longitude</th>
          <th>website</th>
          <th>phoneNumber</th>
          <th>ownerName</th>
          <th>yearStarted</th>
          <th>starRating</th>
          <th>reviewCount</th>
          <th>naicsCode</th>
          <th>createdAt</th>
          <th>updatedAt</th>
        </tr>
      </thead>
      <tbody>
        {businesses.map(b => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>{b.name}</td>
            <td>{b.address}</td>
            <td>{b.city}</td>
            <td>{b.state}</td>
            <td>{b.zipCode}</td>
            <td>{b.latitude}</td>
            <td>{b.longitude}</td>
            <td>{b.website ?? ''}</td>
            <td>{b.phoneNumber ?? ''}</td>
            <td>{b.ownerName ?? ''}</td>
            <td>{b.yearStarted ?? ''}</td>
            <td>{b.starRating ?? ''}</td>
            <td>{b.reviewCount ?? ''}</td>
            <td>{b.naicsCode ?? ''}</td>
            <td>{b.createdAt}</td>
            <td>{b.updatedAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 