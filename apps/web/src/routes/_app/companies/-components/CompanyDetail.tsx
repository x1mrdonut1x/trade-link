import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  Calendar, 
  Plus,
  Edit,
  CheckSquare,
  Clock
} from 'lucide-react';

interface CompanyDetailProps {
  companyId: number;
}

export function CompanyDetail({ companyId }: CompanyDetailProps) {
  // Mock data - would come from API based on companyId
  const company = {
    id: companyId,
    name: 'Acme Corporation',
    industry: 'Technology',
    size: 'Large (1000+ employees)',
    location: 'San Francisco, CA',
    address: '123 Market Street, San Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    email: 'contact@acme.com',
    website: 'www.acme.com',
    description: 'Leading technology company specializing in enterprise software solutions. Founded in 2010, Acme has grown to become a major player in the SaaS industry.',
    tags: ['Enterprise', 'SaaS', 'Key Account'],
    customFields: [
      { name: 'Annual Revenue', value: '$50M+' },
      { name: 'Decision Maker', value: 'John Smith (CEO)' },
      { name: 'Contract Value', value: '$2.5M' },
      { name: 'Next Renewal', value: '2025-12-15' },
    ],
    contacts: [
      { id: 1, name: 'John Smith', title: 'CEO', email: 'john.smith@acme.com', avatar: '/avatars/john-smith.jpg' },
      { id: 4, name: 'Emma Davis', title: 'Product Manager', email: 'emma.davis@acme.com', avatar: '/avatars/emma-davis.jpg' },
      { id: 5, name: 'Mike Wilson', title: 'CTO', email: 'mike.wilson@acme.com', avatar: '/avatars/mike-wilson.jpg' },
    ],
    events: [
      { id: 1, name: 'Tech Trade Show 2025', date: '2025-07-15', status: 'Upcoming' },
      { id: 3, name: 'SaaS Summit 2025', date: '2025-09-10', status: 'Completed' },
    ],
    todos: [
      { id: 1, title: 'Follow up with quarterly business review', dueDate: '2025-06-27', priority: 'high' },
      { id: 4, title: 'Send updated contract terms', dueDate: '2025-06-30', priority: 'medium' },
    ],
    activityHistory: [
      { date: '2025-06-20', type: 'call', description: '30min call with John Smith - discussed Q3 objectives' },
      { date: '2025-06-18', type: 'email', description: 'Sent quarterly report and recommendations' },
      { date: '2025-06-15', type: 'meeting', description: 'In-person meeting at their SF office' },
    ]
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('');
  };

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{company.name}</CardTitle>
                <p className="text-lg text-muted-foreground">{company.industry}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {company.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Company
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{company.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Company Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{company.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{company.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{company.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{company.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{company.website}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Custom Fields</h4>
              <div className="space-y-2 text-sm">
                {company.customFields.map((field, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium">{field.name}:</span>
                    <span>{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contacts ({company.contacts.length})
            </CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {company.contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.title}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {contact.email}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {company.activityHistory.map((activity, index) => (
              <div key={index} className="flex gap-3 p-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.date} • {activity.type}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Associated Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events ({company.events.length})
            </CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add to Event
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {company.events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'} className="text-xs">
                  {event.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tasks & Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tasks & Reminders ({company.todos.length})
            </CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {company.todos.map((todo) => (
              <div key={todo.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{todo.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {todo.dueDate}</p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    todo.priority === 'high' ? 'bg-red-100 text-red-800' : 
                    todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}
                >
                  {todo.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
