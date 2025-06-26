import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/page-header/PageHeader';
import { createFileRoute } from '@tanstack/react-router';
import { AlertTriangle, Building2, Calendar, CheckCircle, Download, FileSpreadsheet, FileText, Upload, Users } from 'lucide-react';
import React, { useState } from 'react';

export const Route = createFileRoute('/_app/import/')({
  component: ImportDataPage,
});

interface ImportStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface ImportStats {
  totalRecords: number;
  companies: number;
  contacts: number;
  events: number;
  errors: number;
}

function ImportDataPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'companies' | 'contacts' | 'events' | 'all'>('all');
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const [importSteps, setImportSteps] = useState<ImportStep[]>([
    { id: 1, title: 'Upload File', description: 'Select your CSV or Excel file', completed: false, active: true },
    { id: 2, title: 'Map Fields', description: 'Match your columns to our fields', completed: false, active: false },
    { id: 3, title: 'Review Data', description: 'Preview and validate your data', completed: false, active: false },
    { id: 4, title: 'Import', description: 'Import your data into the system', completed: false, active: false },
  ]);

  const [importStats] = useState<ImportStats>({
    totalRecords: 245,
    companies: 67,
    contacts: 156,
    events: 22,
    errors: 3,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Update steps
      const newSteps = [...importSteps];
      newSteps[0].completed = true;
      newSteps[1].active = true;
      setImportSteps(newSteps);
    }
  };

  const handleImport = () => {
    setIsImporting(true);
    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      setImportComplete(true);
      const newSteps = importSteps.map(step => ({ ...step, completed: true, active: false }));
      setImportSteps(newSteps);
    }, 3000);
  };

  const downloadTemplate = (type: string) => {
    // In a real app, this would download the actual template
    console.log(`Downloading ${type} template...`);
  };

  return (
    <>
      <PageHeader
        title="Import Data"
        actions={[
          {
            label: "Download Template",
            icon: Download,
            variant: "outline",
            onClick: () => downloadTemplate('companies')
          }
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Import Process */}
        <div className="lg:col-span-2 space-y-6">
          {!importComplete ? (
            <>
              {/* Progress Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Import Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {importSteps.map(step => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          step.active
                            ? 'bg-blue-50 border border-blue-200'
                            : step.completed
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-green-500 text-white'
                              : step.active
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* File Upload */}
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
                      onChange={e => setImportType(e.target.value as 'companies' | 'contacts' | 'events' | 'all')}
                      className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="all">All Data (Companies, Contacts, Events)</option>
                      <option value="companies">Companies Only</option>
                      <option value="contacts">Contacts Only</option>
                      <option value="events">Events Only</option>
                    </select>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      {selectedFile ? (
                        <div>
                          <p className="text-lg font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium">Drop your file here or click to browse</p>
                          <p className="text-sm text-muted-foreground">Supports CSV, Excel (.xlsx, .xls)</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {selectedFile && (
                    <Button onClick={handleImport} disabled={isImporting} className="w-full">
                      {isImporting ? 'Importing...' : 'Start Import'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            /* Import Complete */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Import Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{importStats.totalRecords}</div>
                    <div className="text-sm text-muted-foreground">Total Records</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Building2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{importStats.companies}</div>
                    <div className="text-sm text-muted-foreground">Companies</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{importStats.contacts}</div>
                    <div className="text-sm text-muted-foreground">Contacts</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{importStats.events}</div>
                    <div className="text-sm text-muted-foreground">Events</div>
                  </div>
                </div>

                {importStats.errors > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">{importStats.errors} records had errors</p>
                      <p className="text-sm text-muted-foreground">These records were skipped. Download the error report to review.</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => window.location.reload()}>Import More Data</Button>
                  {importStats.errors > 0 && (
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Error Report
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help & Templates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadTemplate('companies')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Companies Template
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadTemplate('contacts')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Contacts Template
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadTemplate('events')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Events Template
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => downloadTemplate('all')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Complete Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">File Format</h4>
                <p className="text-muted-foreground">Use CSV or Excel files. First row should contain column headers.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Required Fields</h4>
                <p className="text-muted-foreground">
                  Companies: Name, Industry
                  <br />
                  Contacts: First Name, Last Name, Email
                  <br />
                  Events: Name, Date, Location
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Custom Fields</h4>
                <p className="text-muted-foreground">Additional columns will be imported as custom fields.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Data Validation</h4>
                <p className="text-muted-foreground">Invalid records will be flagged and can be reviewed before import.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
