import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@tanstack/react-router';
import {
  Building2,
  Calendar,
  Edit,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Trash2,
} from 'lucide-react';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  companyId: number;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  lastContact: string;
  eventsCount: number;
  tags: string[];
  customFields: Array<{ name: string; value: string }>;
}

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Link to="/contacts/$contactId" params={{ contactId: contact.id.toString() }}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-3 flex-1">
            <Avatar>
              <AvatarImage src={contact.avatar} alt={`${contact.firstName} ${contact.lastName}`} />
              <AvatarFallback>{getInitials(contact.firstName, contact.lastName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">
                {contact.firstName} {contact.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{contact.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{contact.company}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {contact.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{contact.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>{contact.company}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{contact.eventsCount} events</span>
          </div>
          <div className="text-xs text-muted-foreground">Last contact: {contact.lastContact}</div>
        </div>

        {contact.customFields.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">Additional Info:</p>
            <div className="space-y-1">
              {contact.customFields.slice(0, 2).map((field, index) => (
                <div key={index} className="text-xs">
                  <span className="font-medium">{field.name}:</span> {field.value}
                </div>
              ))}
              {contact.customFields.length > 2 && (
                <div className="text-xs text-muted-foreground">+{contact.customFields.length - 2} more fields</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  );
}
