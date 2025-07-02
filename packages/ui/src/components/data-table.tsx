import * as React from 'react';
import { cn } from '../lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

export interface Column<T> {
  title: string;
  key?: keyof T;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  onRowClick?: (item: T, index: number) => void;
  rowClassName?: string | ((item: T, index: number) => string);
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

function DataTable<T = any>({
  data,
  columns,
  loading = false,
  skeletonRows = 5,
  emptyMessage = 'No data available',
  emptyDescription,
  emptyAction,
  onRowClick,
  rowClassName,
  className,
  striped = false,
  hoverable = true,
}: DataTableProps<T>) {
  const renderCell = (column: Column<T>, item: T, index: number) => {
    if (column.render) {
      return column.render(item, index);
    }
    if (column.key) {
      const value = item[column.key];
      return value != null ? String(value) : '-';
    }
    return '-';
  };

  const getCellAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const getRowClassName = (item: T, index: number) => {
    let classes = '';

    if (striped && index % 2 === 1) {
      classes += ' bg-muted/20';
    }

    if (onRowClick) {
      classes += ' cursor-pointer';
    }

    if (typeof rowClassName === 'function') {
      classes += ' ' + rowClassName(item, index);
    } else if (rowClassName) {
      classes += ' ' + rowClassName;
    }

    return classes.trim();
  };

  return (
    <Table loading={loading} skeletonRows={skeletonRows} skeletonColumns={columns.length} className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index} className={cn(getCellAlignment(column.align), column.headerClassName)}>
              {column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {!loading && (
        <TableBody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={cn(hoverable && 'hover:bg-muted/50', getRowClassName(item, rowIndex))}
                onClick={onRowClick ? () => onRowClick(item, rowIndex) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={cn(getCellAlignment(column.align), column.className)}>
                    {renderCell(column, item, rowIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">{emptyMessage}</p>
                  {emptyDescription && <p className="text-sm mb-4">{emptyDescription}</p>}
                  {emptyAction}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      )}
    </Table>
  );
}

export { DataTable };
