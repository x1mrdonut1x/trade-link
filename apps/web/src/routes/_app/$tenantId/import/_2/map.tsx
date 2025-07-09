import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { CompanyImportData, ContactImportData } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Label } from '@tradelink/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { Loader2 } from '@tradelink/ui/icons';
import { importAPI } from 'api/import/api';
import { Alert } from 'components/ui/alert';
import { useImportContext } from 'context';
import * as Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { FieldMappingSummary } from './-components/FieldMappingSummary';
import { COMPANY_FIELDS, CONTACT_FIELDS } from './-components/fields';

export const Route = createFileRoute('/_app/$tenantId/import/_2/map')({
  component: ImportDataPage,
});

function ImportDataPage() {
  const navigate = useNavigate();

  const { tenantId } = Route.useParams();

  const importContext = useImportContext();
  const { csvColumns, importType, fieldMappings, setFieldMappings } = importContext;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(' csvColumns:', csvColumns);
    if (!csvColumns?.length) {
      navigate({ to: '/$tenantId/import/upload', params: { tenantId } });
    }
  }, [navigate, csvColumns, tenantId]);

  // Helper function to generate filtered CSV with only mapped columns
  const generateFilteredCsv = async (originalCsvFile: Blob, fieldMappings: typeof importContext.fieldMappings) => {
    // Parse the original CSV to get the raw data
    const originalCsvText = await originalCsvFile.text();
    const originalCsvData = Papa.parse(originalCsvText, {
      header: false,
      skipEmptyLines: true,
    });

    if (originalCsvData.errors.length > 0) {
      throw new Error('Failed to parse CSV file');
    }

    const originalRows = originalCsvData.data as string[][];

    // Get all mapped column indices
    const mappedColumnIndices = new Set<number>();
    for (const mapping of fieldMappings.companyMappings) {
      mappedColumnIndices.add(mapping.csvColumnIndex);
    }
    for (const mapping of fieldMappings.contactMappings) {
      mappedColumnIndices.add(mapping.csvColumnIndex);
    }

    // Filter columns to only include mapped ones
    const sortedMappedIndices = [...mappedColumnIndices].sort((a, b) => a - b);
    const filteredRows = originalRows.map(row => {
      return sortedMappedIndices.map(index => row[index] || '');
    });

    // Generate new CSV with only mapped columns
    const filteredCsvText = Papa.unparse(filteredRows);
    const filteredCsvFile = new Blob([filteredCsvText], { type: 'text/csv' });

    // Update field mappings to use new column indices (0-based after filtering)
    const updatedFieldMappings = {
      companyMappings: fieldMappings.companyMappings.map(mapping => ({
        ...mapping,
        csvColumnIndex: sortedMappedIndices.indexOf(mapping.csvColumnIndex),
      })),
      contactMappings: fieldMappings.contactMappings.map(mapping => ({
        ...mapping,
        csvColumnIndex: sortedMappedIndices.indexOf(mapping.csvColumnIndex),
      })),
    };

    return { filteredCsvFile, updatedFieldMappings };
  };

  const handleProcessData = async () => {
    if (
      csvColumns.length === 0 ||
      (fieldMappings.companyMappings.length === 0 && fieldMappings.contactMappings.length === 0) ||
      !importContext.selectedRawFile
    )
      return;

    setIsLoading(true);
    setError(null);

    try {
      // Generate filtered CSV with only mapped columns
      const { filteredCsvFile, updatedFieldMappings } = await generateFilteredCsv(
        importContext.selectedRawFile,
        fieldMappings
      );

      const processResponse = await importAPI(tenantId).processImport({
        csvFile: filteredCsvFile,
        fieldMappings: updatedFieldMappings,
        importType,
      });

      importContext.setPreviewData(processResponse);
      navigate({ to: '/$tenantId/import/review', params: { tenantId } });
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Failed to process data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingChange = (csvColumnIndex: number, targetField: string, fieldType: 'company' | 'contact') => {
    const newMappings = { ...fieldMappings };

    if (fieldType === 'company') {
      // Remove any existing mapping for this column
      newMappings.companyMappings = newMappings.companyMappings.filter(m => m.csvColumnIndex !== csvColumnIndex);

      if (targetField !== 'none') {
        // Remove any existing mapping for this target field from other columns
        newMappings.companyMappings = newMappings.companyMappings.filter(m => m.targetField !== targetField);

        // Add the new mapping
        newMappings.companyMappings.push({ csvColumnIndex, targetField: targetField as keyof CompanyImportData });
      }
    } else {
      // Remove any existing mapping for this column
      newMappings.contactMappings = newMappings.contactMappings.filter(m => m.csvColumnIndex !== csvColumnIndex);

      if (targetField !== 'none') {
        // Remove any existing mapping for this target field from other columns
        newMappings.contactMappings = newMappings.contactMappings.filter(m => m.targetField !== targetField);

        // Add the new mapping
        newMappings.contactMappings.push({ csvColumnIndex, targetField: targetField as keyof ContactImportData });
      }
    }

    setFieldMappings(newMappings);
  };

  const getMappingForColumn = (csvColumnIndex: number, fieldType: 'company' | 'contact'): string => {
    if (fieldType === 'company') {
      return fieldMappings.companyMappings.find(m => m.csvColumnIndex === csvColumnIndex)?.targetField || 'none';
    } else {
      return fieldMappings.contactMappings.find(m => m.csvColumnIndex === csvColumnIndex)?.targetField || 'none';
    }
  };

  const getRequiredFieldsNotMapped = () => {
    const mappedContactFields = new Set(fieldMappings.contactMappings.map(m => m.targetField));
    const mappedCompanyFields = new Set(fieldMappings.companyMappings.map(m => m.targetField));

    const missingContactFields = CONTACT_FIELDS.filter(field => {
      return !mappedContactFields.has(field.key) && field.required;
    });
    const missingCompanyFields = COMPANY_FIELDS.filter(field => {
      return !mappedCompanyFields.has(field.key) && field.required;
    });

    if (importType === 'contacts') {
      return { contacts: missingContactFields, companies: [] };
    }

    if (importType === 'companies') {
      return { contacts: [], companies: missingCompanyFields };
    }

    return { contacts: missingContactFields, companies: missingCompanyFields };
  };

  const requiredFieldsNotMapped = getRequiredFieldsNotMapped();

  if (isLoading) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-lg font-medium">Processing your data...</p>
        <p className="text-sm text-muted-foreground">This may take a moment</p>
      </div>
    );
  }

  return (
    <>
      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-blue-900 mb-2">Map Your CSV Columns</h2>
        <p className="text-sm text-blue-800 mb-3">
          For each column in your CSV file, choose which field it should map to. You can map the same column to both
          company and contact fields if needed.
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-blue-900">Company fields (for organization data)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-900">Contact fields (for person data)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-500">*</span>
            <span className="text-gray-700">Required fields</span>
          </div>
        </div>
      </div>

      {requiredFieldsNotMapped.contacts.length > 0 && (
        <Alert
          variant="warning"
          title="Required fields missing in Contacts"
          description={`Please map the following required fields: ${requiredFieldsNotMapped.contacts.map(f => f.label).join(', ')}`}
        />
      )}
      {requiredFieldsNotMapped.companies.length > 0 && (
        <Alert
          variant="warning"
          title="Required fields missing in Companies"
          description={`Please map the following required fields: ${requiredFieldsNotMapped.companies.map(f => f.label).join(', ')}`}
        />
      )}
      {error && <Alert variant="error" title="Error" description={error} />}

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {csvColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="border rounded-lg p-4 bg-white shadow-sm">
            {/* Column Header */}
            <div className="mb-4 pb-3 border-b border-gray-100 lex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-900">
                Column {columnIndex + 1}: "{column.name}"
              </h3>
              <div className="text-sm text-gray-600 mt-1">
                Sample values:{' '}
                <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
                  {column.values.slice(0, 3).join(', ')}
                </span>
                {column.values.length > 3 && <span className="text-gray-500"> + more</span>}
              </div>
            </div>

            {/* Mapping Options */}
            <div className="space-y-4">
              {/* Company field mapping */}
              {(importType === 'companies' || importType === 'mixed') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <Label className="text-sm font-medium text-blue-900">Map to Company Field</Label>
                  </div>
                  <Select
                    value={getMappingForColumn(columnIndex, 'company')}
                    onValueChange={value => handleMappingChange(columnIndex, value, 'company')}
                  >
                    <SelectTrigger className="w-full bg-white border-blue-200">
                      <SelectValue placeholder="-- Don't import as company field --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Don't import as company field --</SelectItem>
                      {COMPANY_FIELDS.map(field => (
                        <SelectItem key={field.key} value={field.key}>
                          <span>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Contact field mapping */}
              {(importType === 'contacts' || importType === 'mixed') && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <Label className="text-sm font-medium text-green-900">Map to Contact Field</Label>
                  </div>
                  <Select
                    value={getMappingForColumn(columnIndex, 'contact')}
                    onValueChange={value => handleMappingChange(columnIndex, value, 'contact')}
                  >
                    <SelectTrigger className="w-full bg-white border-green-200">
                      <SelectValue placeholder="-- Don't import as contact field --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Don't import as contact field --</SelectItem>
                      {CONTACT_FIELDS.map(field => (
                        <SelectItem key={field.key} value={field.key}>
                          <span>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Show current mappings summary */}
              <div className="flex flex-wrap gap-2 pt-2">
                {getMappingForColumn(columnIndex, 'company') &&
                  getMappingForColumn(columnIndex, 'company') !== 'none' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Company: {COMPANY_FIELDS.find(f => f.key === getMappingForColumn(columnIndex, 'company'))?.label}
                    </span>
                  )}
                {getMappingForColumn(columnIndex, 'contact') &&
                  getMappingForColumn(columnIndex, 'contact') !== 'none' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Contact: {CONTACT_FIELDS.find(f => f.key === getMappingForColumn(columnIndex, 'contact'))?.label}
                    </span>
                  )}
                {(!getMappingForColumn(columnIndex, 'company') ||
                  getMappingForColumn(columnIndex, 'company') === 'none') &&
                  (!getMappingForColumn(columnIndex, 'contact') ||
                    getMappingForColumn(columnIndex, 'contact') === 'none') && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Not mapped
                    </span>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mapping Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-gray-900 mb-3">Mapping Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {(importType === 'companies' || importType === 'mixed') && (
            <FieldMappingSummary
              title="Company Fields"
              fields={COMPANY_FIELDS}
              mappings={fieldMappings.companyMappings}
              colorClass="blue"
            />
          )}

          {(importType === 'contacts' || importType === 'mixed') && (
            <FieldMappingSummary
              title="Contact Fields"
              fields={CONTACT_FIELDS}
              mappings={fieldMappings.contactMappings}
              colorClass="green"
            />
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4 flex-shrink-0 border-t justify-center">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/$tenantId/import/upload', params: { tenantId } })}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            handleProcessData();
          }}
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </>
  );
}
