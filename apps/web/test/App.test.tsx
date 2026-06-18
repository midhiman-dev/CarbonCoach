import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders CarbonCoach heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CarbonCoach');
    expect(
      screen.getByText('Understand your footprint. Make better everyday choices.'),
    ).toBeInTheDocument();
  });

  it('opens mobile navigation drawer on menu click and closes on close button click', () => {
    render(<App />);

    const menuButton = screen.getByRole('button', { name: 'Open navigation' });
    expect(menuButton).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Navigation drawer' })).not.toBeInTheDocument();

    fireEvent.click(menuButton);
    const drawer = screen.getByRole('dialog', { name: 'Navigation drawer' });
    expect(drawer).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close navigation' });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog', { name: 'Navigation drawer' })).not.toBeInTheDocument();
  });

  it('closes mobile navigation drawer on Escape key press', () => {
    render(<App />);
    const menuButton = screen.getByRole('button', { name: 'Open navigation' });
    fireEvent.click(menuButton);

    expect(screen.getByRole('dialog', { name: 'Navigation drawer' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Navigation drawer' })).not.toBeInTheDocument();
  });

  it('closes mobile navigation drawer on backdrop click', () => {
    render(<App />);
    const menuButton = screen.getByRole('button', { name: 'Open navigation' });
    fireEvent.click(menuButton);

    const drawer = screen.getByRole('dialog', { name: 'Navigation drawer' });
    expect(drawer).toBeInTheDocument();

    fireEvent.click(drawer);
    expect(screen.queryByRole('dialog', { name: 'Navigation drawer' })).not.toBeInTheDocument();
  });

  it('selecting a navigation item in mobile drawer closes the drawer and changes screen', () => {
    render(<App />);
    const menuButton = screen.getByRole('button', { name: 'Open navigation' });
    fireEvent.click(menuButton);

    const choiceLabButton = screen.getAllByRole('button', { name: /Daily Choice Lab/i })[0];
    fireEvent.click(choiceLabButton);

    expect(screen.queryByRole('dialog', { name: 'Navigation drawer' })).not.toBeInTheDocument();
    expect(screen.getAllByText('Daily Choice Lab').length).toBeGreaterThan(0);
  });
});
