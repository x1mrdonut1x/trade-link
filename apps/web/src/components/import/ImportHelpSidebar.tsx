import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { FileSpreadsheet } from '@tradelink/ui/icons';

interface ImportHelpSidebarProps {
  onDownloadTemplate: (type: string) => void;
}

export function ImportHelpSidebar({ onDownloadTemplate }: ImportHelpSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Templates</CardTitle>
        <p className="text-sm text-muted-foreground">Download CSV templates to get started</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start" onClick={() => onDownloadTemplate('companies')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Companies
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => onDownloadTemplate('contacts')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Contacts
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => onDownloadTemplate('mixed')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Combined
        </Button>
      </CardContent>
    </Card>
  );
}
