import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Calendar, Edit, FileText, Mail, Phone } from '@tradelink/ui/icons';
import { NoteIcon } from 'components/icons/NoteIcon';

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full justify-start" variant="outline">
          <NoteIcon className="h-4 w-4 mr-2" />
          Send Message
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Phone className="h-4 w-4 mr-2" />
          Schedule Call
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Send Email
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          View Performance
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Contact
        </Button>
      </CardContent>
    </Card>
  );
}
