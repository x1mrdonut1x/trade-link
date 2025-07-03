import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Label } from '@tradelink/ui/components/label';
import { Upload } from '@tradelink/ui/icons';

import type { ImportType } from './types';

interface FileUploadStepProps {
  selectedFile: File | null;
  importType: ImportType;
  onFileSelect: (file: File) => void;
  onImportTypeChange: (type: ImportType) => void;
  onNext: () => void;
}

export function FileUploadStep({ selectedFile, importType, onFileSelect, onImportTypeChange, onNext }: FileUploadStepProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your File</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="importType">Import Type</Label>
          <select
            id="importType"
            value={importType}
            onChange={e => onImportTypeChange(e.target.value as ImportType)}
            className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="mixed">Auto-detect (Companies and Contacts)</option>
            <option value="companies">Companies Only</option>
            <option value="contacts">Contacts Only</option>
          </select>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {selectedFile ? (
              <div>
                <p className="text-lg font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">Drop your CSV file here or click to browse</p>
                <p className="text-sm text-muted-foreground">Only CSV files are supported</p>
              </div>
            )}
          </label>
        </div>

        {selectedFile && (
          <Button onClick={onNext} className="w-full">
            Next: Map Fields
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
