import { render, screen } from '@testing-library/react';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders Business Directory heading', () => {
    render(<App />);
    expect(screen.getByText(/Business Directory/i)).toBeInTheDocument();
  });
}); 