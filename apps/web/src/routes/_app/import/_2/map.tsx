import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Label } from '@tradelink/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { AlertTriangle } from '@tradelink/ui/icons';
import { importAPI } from 'api/import/import.service';
import { useImportContext } from 'context';
import { useState } from 'react';
import { COMPANY_FIELDS, CONTACT_FIELDS } from './-components/fields';

export const Route = createFileRoute('/_app/import/_2/map')({
  component: ImportDataPage,
});

function ImportDataPage() {
  const navigate = useNavigate();

  const importContext = useImportContext();
  const { csvColumns, importType, fieldMappings, setFieldMappings } = importContext;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessData = async () => {
    if (
      csvColumns.length === 0 ||
      (fieldMappings.companyMappings.length === 0 && fieldMappings.contactMappings.length === 0)
    )
      return;
    setIsProcessing(true);
    setError(null);

    try {
      // Create headers row from column names
      const headers = csvColumns.map(col => col.name);

      // Find the maximum number of rows across all columns
      const maxRows = Math.max(...csvColumns.map(col => col.values.length));

      // Create data rows by mapping through each row index
      const dataRows = Array.from({ length: maxRows }, (_, rowIndex) =>
        csvColumns.map(col => col.values[rowIndex] || '')
      );

      // Combine headers and data rows
      const csvData = [headers, ...dataRows];

      const processResponse = await importAPI.processImport({
        csvData,
        fieldMappings,
        importType,
      });

      importContext.setPreviewData(processResponse);
      navigate({ to: '/import/review' });
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Failed to process data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingChange = (csvColumnIndex: number, targetField: string, fieldType: 'company' | 'contact') => {
    const newMappings = { ...fieldMappings };

    if (fieldType === 'company') {
      newMappings.companyMappings = newMappings.companyMappings.filter(m => m.csvColumnIndex !== csvColumnIndex);
      if (targetField && targetField !== 'none') {
        newMappings.companyMappings.push({ csvColumnIndex, targetField });
      }
    } else {
      newMappings.contactMappings = newMappings.contactMappings.filter(m => m.csvColumnIndex !== csvColumnIndex);
      if (targetField && targetField !== 'none') {
        newMappings.contactMappings.push({ csvColumnIndex, targetField });
      }
    }

    setFieldMappings(newMappings);
  };

  const getMappingForColumn = (csvColumnIndex: number, fieldType: 'company' | 'contact') => {
    if (fieldType === 'company') {
      return fieldMappings.companyMappings.find(m => m.csvColumnIndex === csvColumnIndex)?.targetField || '';
    } else {
      return fieldMappings.contactMappings.find(m => m.csvColumnIndex === csvColumnIndex)?.targetField || '';
    }
  };

  const getRequiredFieldsNotMapped = () => {
    const mappedCompanyFields = new Set(fieldMappings.companyMappings.map(m => m.targetField));
    const mappedContactFields = new Set(fieldMappings.contactMappings.map(m => m.targetField));

    const availableFields =
      importType === 'companies'
        ? COMPANY_FIELDS
        : importType === 'contacts'
          ? CONTACT_FIELDS
          : [...COMPANY_FIELDS, ...CONTACT_FIELDS];

    return availableFields.filter(field => {
      if (!field.required) return false;

      // Check if field is mapped in the appropriate category
      if (COMPANY_FIELDS.some(f => f.key === field.key)) {
        return !mappedCompanyFields.has(field.key);
      } else {
        return !mappedContactFields.has(field.key);
      }
    });
  };

  const requiredFieldsNotMapped = getRequiredFieldsNotMapped();
  const canProceed = requiredFieldsNotMapped.length === 0;

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

      {!canProceed && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Required fields missing</p>
            <p className="text-sm text-muted-foreground">
              Please map the following required fields: {requiredFieldsNotMapped.map(f => f.label).join(', ')}
            </p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {csvColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="border rounded-lg p-4 bg-white shadow-sm">
            {/* Column Header */}
            <div className="mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Column {columnIndex + 1}: "{column.name}"
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    Sample values:{' '}
                    <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
                      {column.values.slice(0, 3).join(', ')}
                    </span>
                    {column.values.length > 3 && (
                      <span className="text-gray-500"> + {column.values.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Index: {columnIndex}</div>
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
            <div>
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Company Fields
              </h4>
              <div className="space-y-1">
                {COMPANY_FIELDS.filter(field => field.required).map(field => {
                  const isMapped = fieldMappings.companyMappings.some(m => m.targetField === field.key);
                  return (
                    <div
                      key={field.key}
                      className={`flex items-center justify-between px-2 py-1 rounded ${
                        isMapped ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span>{field.label}</span>
                      <span className="text-xs">{isMapped ? '✓ Mapped' : '✗ Missing'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(importType === 'contacts' || importType === 'mixed') && (
            <div>
              <h4 className="font-medium text-green-900 mb-2 flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Contact Fields
              </h4>
              <div className="space-y-1">
                {CONTACT_FIELDS.filter(field => field.required).map(field => {
                  const isMapped = fieldMappings.contactMappings.some(m => m.targetField === field.key);
                  return (
                    <div
                      key={field.key}
                      className={`flex items-center justify-between px-2 py-1 rounded ${
                        isMapped ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span>{field.label}</span>
                      <span className="text-xs">{isMapped ? '✓ Mapped' : '✗ Missing'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4 flex-shrink-0 border-t justify-center">
        <Button variant="outline" onClick={() => navigate({ to: '/import/upload' })} disabled={isProcessing}>
          Back
        </Button>
        <Button
          onClick={() => {
            handleProcessData();
          }}
          loading={isProcessing}
        >
          Next
        </Button>
      </div>
    </>
  );
}
