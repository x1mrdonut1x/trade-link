import type { CsvColumn } from './types';

export function parseCSV(file: File): Promise<CsvColumn[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          reject(new Error('CSV file must have at least a header row and one data row'));
          return;
        }

        const headers = parseCSVLine(lines[0]);
        const columns: CsvColumn[] = headers.map(header => ({
          name: header,
          values: [],
        }));

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          values.forEach((value, index) => {
            if (columns[index]) {
              columns[index].values.push(value);
            }
          });
        }

        resolve(columns);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last field
  result.push(current.trim());

  return result;
}
