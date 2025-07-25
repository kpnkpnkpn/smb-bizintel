import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders Business Directory heading', () => {
    rtlRender(
      <MantineProvider>
        <App />
      </MantineProvider>
    );
    expect(screen.getByText(/Business Directory/i)).toBeInTheDocument();
  });
}); 