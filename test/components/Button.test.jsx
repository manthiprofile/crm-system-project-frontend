import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../src/components/Button/Button';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies primary variant by default', () => {
    const { container } = render(<Button>Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('primary');
  });

  it('applies secondary variant', () => {
    const { container } = render(<Button variant="secondary">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('secondary');
  });

  it('applies danger variant', () => {
    const { container } = render(<Button variant="danger">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('danger');
  });

  it('applies medium size by default', () => {
    const { container } = render(<Button>Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('medium');
  });

  it('applies small size', () => {
    const { container } = render(<Button size="small">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('small');
  });

  it('applies large size', () => {
    const { container } = render(<Button size="large">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('large');
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Click Me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('custom-class');
  });

  it('sets button type to button by default', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toHaveAttribute('type', 'button');
  });

  it('sets button type to submit', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');
  });

  it('sets button type to reset', () => {
    render(<Button type="reset">Reset</Button>);
    expect(screen.getByText('Reset')).toHaveAttribute('type', 'reset');
  });

  it('renders disabled button', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});

