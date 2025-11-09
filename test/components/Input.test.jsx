import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../src/components/Input/Input';

describe('Input Component', () => {
  it('renders input field', () => {
    render(<Input value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Name" value="" onChange={() => {}} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter name" value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('displays value', () => {
    render(<Input value="John Doe" onChange={() => {}} />);
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('calls onChange handler when value changes', () => {
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('shows required indicator when required', () => {
    render(<Input label="Name" required value="" onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input error="This field is required" value="" onChange={() => {}} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    const { container } = render(
      <Input error="Error" value="" onChange={() => {}} />
    );
    const input = container.querySelector('input');
    expect(input.className).toContain('error');
  });

  it('sets input type', () => {
    render(<Input type="email" value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('sets input id and name', () => {
    render(<Input id="name-input" name="name" value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'name-input');
    expect(input).toHaveAttribute('name', 'name');
  });

  it('associates label with input using id', () => {
    render(<Input id="name-input" label="Name" value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Name');
    expect(label).toHaveAttribute('for', 'name-input');
    expect(input).toHaveAttribute('id', 'name-input');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Input className="custom-input" value="" onChange={() => {}} />
    );
    const input = container.querySelector('input');
    expect(input.className).toContain('custom-input');
  });

  it('sets required attribute when required prop is true', () => {
    render(<Input required value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });
});

