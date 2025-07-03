import * as React from 'react';

import { cn } from '../lib/utils';
import { Skeleton } from './skeleton';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  loading?: boolean;
  skeletonRows?: number;
  skeletonColumns?: number;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, loading = false, skeletonRows = 5, skeletonColumns = 6, children, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props}>
        {loading ? (
          <>
            {/* Clone header if it exists */}
            {React.Children.toArray(children).find(child => React.isValidElement(child) && child.type === TableHeader)}
            <TableBody>
              {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: skeletonColumns }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton
                        className={cn(
                          'h-4',
                          // Add some variety to skeleton widths
                          colIndex % 3 === 0 ? 'w-3/4' : colIndex % 3 === 1 ? 'w-full' : 'w-1/2'
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        ) : (
          children
        )}
      </table>
    </div>
  )
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
  )
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
  )
);
TableCaption.displayName = 'TableCaption';

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
