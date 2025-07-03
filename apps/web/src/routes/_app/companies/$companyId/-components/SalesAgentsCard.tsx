import type { GetCompanyResponse } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { AssignContactDialog } from 'components/contact/AssignContactDialog';
import { UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

interface SalesAgentsCardProps {
  companyId: string | number;
  contacts?: GetCompanyResponse['contact'];
}

export function SalesAgentsCard({ companyId, contacts = [] }: SalesAgentsCardProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  return (
    <>
      <AssignContactDialog
        companyId={Number(companyId)}
        onContactAssigned={() => {
          // Optionally refresh company data or show success message
          console.log('Contact assigned successfully');
          setIsAssignDialogOpen(false);
        }}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sales Agents ({contacts.length})
          </CardTitle>
          <Button variant="outline" onClick={() => setIsAssignDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{contact.jobTitle}</p>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-muted-foreground text-center py-6">No sales agents assigned to this company.</p>}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
