import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';

describe('Navigation Components Accessibility', () => {
  const setActiveSection = vi.fn();

  describe('DesktopNavigation', () => {
    it('has accessible nav landmark', () => {
      render(<DesktopNavigation activeSection="footprint" setActiveSection={setActiveSection} />);
      expect(screen.getByRole('navigation', { name: /desktop primary navigation/i })).toBeDefined();
    });

    it('buttons have accessible attributes and are clickable', () => {
      render(<DesktopNavigation activeSection="footprint" setActiveSection={setActiveSection} />);
      const btn = screen.getByRole('button', { name: /Footprint/i });
      expect(btn).toBeDefined();
      
      const choicesBtn = screen.getByRole('button', { name: /Daily Choice Lab/i });
      
      fireEvent.click(choicesBtn);
      expect(setActiveSection).toHaveBeenCalledWith('choice-lab');
    });
  });

  describe('MobileNavigation', () => {
    const defaultProps = {
      activeSection: 'footprint' as const,
      activeLabel: 'Footprint',
      mobileMenuOpen: false,
      setMobileMenuOpen: vi.fn(),
      setActiveSection: setActiveSection,
      menuButtonRef: { current: null },
      closeButtonRef: { current: null },
      handleBackdropClick: vi.fn(),
    };

    it('hamburger button has accessible name and toggles menu', () => {
      render(<MobileNavigation {...defaultProps} />);
      
      const menuBtn = screen.getByRole('button', { name: /open navigation/i });
      expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(menuBtn);
      expect(defaultProps.setMobileMenuOpen).toHaveBeenCalledWith(true);
    });
    
    it('close button is accessible and closes menu', () => {
      render(<MobileNavigation {...defaultProps} mobileMenuOpen={true} />);
      
      const closeBtn = screen.getByRole('button', { name: /close navigation/i });
      expect(closeBtn).toBeDefined();
      fireEvent.click(closeBtn);
      
      expect(defaultProps.setMobileMenuOpen).toHaveBeenCalledWith(false);
    });
  });
});
