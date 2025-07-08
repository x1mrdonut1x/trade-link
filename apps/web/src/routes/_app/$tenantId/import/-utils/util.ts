import type { CsvColumn } from 'context/import-context';
import Papa from 'papaparse';

export const parseCSV = (file: File, rowsAmount: number): Promise<{ columns: CsvColumn[]; slicedFile: Blob }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: rowsAmount,
      complete: results => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          return;
        }

        const data = results.data as Record<string, string>[];
        const columns: CsvColumn[] = [];

        // Get column names from the first row
        if (data.length > 0) {
          const columnNames = Object.keys(data[0]);

          for (const columnName of columnNames) {
            const values = data.map(row => row[columnName] || '').filter(value => value.trim() !== '');

            columns.push({
              name: columnName,
              values: values,
            });
          }
        }

        const slicedFile = new Blob([Papa.unparse(data)], { type: 'text/csv' });

        resolve({ columns, slicedFile });
      },
      error: error => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
};
