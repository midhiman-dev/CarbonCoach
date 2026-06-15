import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders CarbonCoach heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CarbonCoach');
    expect(
      screen.getByText('Understand your footprint. Make better everyday choices.'),
    ).toBeInTheDocument();
  });
});
