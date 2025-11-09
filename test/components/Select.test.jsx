import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../../src/components/Select/Select';

describe('Select Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders select dropdown', () => {
    render(<Select value="" options={options} onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Select label="Country" value="" options={options} onChange={() => {}} />);
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select value="" options={options} onChange={() => {}} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('displays selected value', () => {
    render(<Select value="option2" options={options} onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('option2');
  });

  it('calls onChange handler when value changes', () => {
    const handleChange = vi.fn();
    render(<Select value="" options={options} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('shows required indicator when required', () => {
    render(<Select label="Country" required value="" options={options} onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Select error="This field is required" value="" options={options} onChange={() => {}} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    const { container } = render(
      <Select error="Error" value="" options={options} onChange={() => {}} />
    );
    const select = container.querySelector('select');
    expect(select.className).toContain('error');
  });

  it('sets select id and name', () => {
    render(<Select id="country-select" name="country" value="" options={options} onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'country-select');
    expect(select).toHaveAttribute('name', 'country');
  });

  it('associates label with select using id', () => {
    render(<Select id="country-select" label="Country" value="" options={options} onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    const label = screen.getByText('Country');
    expect(label).toHaveAttribute('for', 'country-select');
    expect(select).toHaveAttribute('id', 'country-select');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Select className="custom-select" value="" options={options} onChange={() => {}} />
    );
    const select = container.querySelector('select');
    expect(select.className).toContain('custom-select');
  });

  it('sets required attribute when required prop is true', () => {
    render(<Select required value="" options={options} onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toBeRequired();
  });

  it('handles empty options array', () => {
    render(<Select value="" options={[]} onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

