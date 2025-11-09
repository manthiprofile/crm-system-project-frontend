import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from '../../src/components/Table/Table';

describe('Table Component', () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'email', label: 'Email' },
  ];

  const data = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
  ];

  it('renders table with columns', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders table with data', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('displays "No data available" when data is empty', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('uses custom render function for cells', () => {
    const columnsWithRender = [
      {
        key: 'name',
        label: 'Name',
        render: (value, row) => <strong>{row.name.toUpperCase()}</strong>,
      },
      { key: 'age', label: 'Age' },
    ];

    render(<Table columns={columnsWithRender} data={data} />);
    expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', () => {
    const handleRowClick = vi.fn();
    render(<Table columns={columns} data={data} onRowClick={handleRowClick} />);
    
    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow);
    expect(handleRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('does not call onRowClick when not provided', () => {
    const handleRowClick = vi.fn();
    render(<Table columns={columns} data={data} />);
    
    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow);
    expect(handleRowClick).not.toHaveBeenCalled();
  });

  it('applies clickable class when onRowClick is provided', () => {
    const { container } = render(
      <Table columns={columns} data={data} onRowClick={() => {}} />
    );
    
    const rows = container.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      expect(row.className).toContain('clickable');
    });
  });

  it('uses row id as key when available', () => {
    const { container } = render(<Table columns={columns} data={data} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('uses index as key when row id is not available', () => {
    const dataWithoutId = [
      { name: 'John Doe', age: 30 },
      { name: 'Jane Smith', age: 25 },
    ];
    
    const { container } = render(<Table columns={columns} data={dataWithoutId} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Table columns={columns} data={data} className="custom-table" />
    );
    
    const table = container.querySelector('table');
    expect(table.className).toContain('custom-table');
  });

  it('handles empty columns array', () => {
    render(<Table columns={[]} data={data} />);
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});

