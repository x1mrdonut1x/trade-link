export interface Agent {
  id: number;
  name: string;
  title: string;
  lastContact: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  status: string;
}

export interface CustomField {
  name: string;
  value: string;
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  agentsCount: number;
  eventsCount: number;
  lastContact: string;
  tags: string[];
  description: string;
  customFields: CustomField[];
  agents: Agent[];
  recentEvents: Event[];
}
