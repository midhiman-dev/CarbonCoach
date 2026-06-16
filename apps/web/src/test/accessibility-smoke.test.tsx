import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { Button, Card, Input, Select, StatusBadge, ProgressMeter } from '../components/ui';

describe('Accessibility Smoke Tests', () => {
  describe('App Shell & Primitives', () => {
    it('renders CarbonCoach heading and shell landmarks', () => {
      render(<App />);

      // Main landmark exists
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Navigation landmark exists (desktop or mobile header)
      expect(screen.getByRole('navigation', { name: /navigation/i })).toBeInTheDocument();

      // Heading level 1 exists
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CarbonCoach');
    });

    it('renders skip link for keyboard navigation', () => {
      render(<App />);
      const skipLink = screen.getByRole('link', { name: /skip to content/i });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('renders Button primitive accessibly', () => {
      render(<Button aria-label="Confirm Action">Click me</Button>);
      const btn = screen.getByRole('button', { name: /confirm action/i });
      expect(btn).toBeInTheDocument();
      expect(btn).not.toBeDisabled();
    });

    it('renders Card primitive as a semantic section', () => {
      render(<Card title="Carbon Footprint Card">Content details</Card>);
      expect(screen.getByRole('region', { name: /carbon footprint card/i })).toBeInTheDocument();
      expect(screen.getByText('Content details')).toBeInTheDocument();
    });

    it('renders Input primitive with linked label', () => {
      render(
        <Input label="Commute Distance" id="commute-input" helperText="Weekly distance in miles" />,
      );
      const label = screen.getByText('Commute Distance');
      const input = screen.getByLabelText('Commute Distance');
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'commute-input');
      expect(input).toHaveAttribute('aria-describedby', 'commute-input-helper');
    });

    it('renders Select primitive with options and linked label', () => {
      const options = [
        { value: 'metro', label: 'Metro Train' },
        { value: 'car', label: 'Gasoline Car' },
      ];
      render(
        <Select
          label="Transit Mode"
          id="transit-select"
          options={options}
          error="Select is required"
        />,
      );
      const select = screen.getByLabelText('Transit Mode');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('aria-invalid', 'true');
      expect(select).toHaveAttribute('aria-describedby', 'transit-select-error');
    });

    it('renders StatusBadge accessibly showing status text', () => {
      render(<StatusBadge variant="low" label="Low Impact" />);
      const badge = screen.getByText('Low Impact');
      expect(badge).toBeInTheDocument();
      // Ensure assistive text for screen readers exists
      expect(screen.getByText('low impact:')).toBeInTheDocument();
    });

    it('renders ProgressMeter with correct ARIA progress states', () => {
      render(<ProgressMeter value={45} max={100} label="Weekly Goal" />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '45');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
      expect(progress).toHaveAttribute('aria-label', 'Weekly Goal, 45 percent complete');
    });
  });
});
