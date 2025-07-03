import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Label } from '@tradelink/ui/components/label';
import { FileSpreadsheet, Upload } from '@tradelink/ui/icons';
import React from 'react';

type ImportType = 'companies' | 'contacts' | 'events' | 'all';

interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  importType: ImportType;
  onImportTypeChange: (type: ImportType) => void;
}

export const FileUpload = ({ selectedFile, onFileSelect, importType, onImportTypeChange }: FileUploadProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="importType" className="text-sm font-medium">
            Import Type
          </Label>
          <select
            id="importType"
            value={importType}
            onChange={e => onImportTypeChange(e.target.value as 'companies' | 'contacts' | 'events' | 'all')}
            className="w-full mt-2 px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="all">All Data Types</option>
            <option value="companies">Companies Only</option>
            <option value="contacts">Sales Agents Only</option>
            <option value="events">Events Only</option>
          </select>
        </div>

        <div>
          <Label htmlFor="file" className="text-sm font-medium">
            Choose File
          </Label>
          <div className="mt-2 flex items-center justify-center w-full">
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV or Excel files only</p>
              </div>
              <input id="file" type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={onFileSelect} />
            </label>
          </div>

          {selectedFile && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-green-600">
              <FileSpreadsheet className="h-4 w-4" />
              <span>{selectedFile.name}</span>
            </div>
          )}
        </div>

        {selectedFile && <Button className="w-full">Proceed to Field Mapping</Button>}
      </CardContent>
    </Card>
  );
};
