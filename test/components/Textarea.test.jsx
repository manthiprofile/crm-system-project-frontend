import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Textarea from '../../src/components/Textarea/Textarea';

describe('Textarea Component', () => {
  it('renders textarea field', () => {
    render(<Textarea value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Textarea label="Description" value="" onChange={() => {}} />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Textarea placeholder="Enter description" value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('displays value', () => {
    render(<Textarea value="Some text" onChange={() => {}} />);
    expect(screen.getByDisplayValue('Some text')).toBeInTheDocument();
  });

  it('calls onChange handler when value changes', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('shows required indicator when required', () => {
    render(<Textarea label="Description" required value="" onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Textarea error="This field is required" value="" onChange={() => {}} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    const { container } = render(
      <Textarea error="Error" value="" onChange={() => {}} />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea.className).toContain('error');
  });

  it('sets textarea id and name', () => {
    render(<Textarea id="desc-textarea" name="description" value="" onChange={() => {}} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'desc-textarea');
    expect(textarea).toHaveAttribute('name', 'description');
  });

  it('associates label with textarea using id', () => {
    render(<Textarea id="desc-textarea" label="Description" value="" onChange={() => {}} />);
    const textarea = screen.getByRole('textbox');
    const label = screen.getByText('Description');
    expect(label).toHaveAttribute('for', 'desc-textarea');
    expect(textarea).toHaveAttribute('id', 'desc-textarea');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Textarea className="custom-textarea" value="" onChange={() => {}} />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea.className).toContain('custom-textarea');
  });

  it('sets required attribute when required prop is true', () => {
    render(<Textarea required value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('sets rows attribute', () => {
    render(<Textarea rows={6} value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
  });

  it('defaults to 4 rows', () => {
    render(<Textarea value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
  });
});

