export interface CustomField {
  name: string;
  value: string;
}

export interface Company {
  id: number;
  name: string;
  agentsCount: number;
}

export interface Agent {
  id: number;
  name: string;
  company: string;
}

export interface Event {
  id: number;
  name: string;
  type: string;
  date: string;
  endDate: string;
  location: string;
  venue: string;
  status: string;
  description: string;
  companiesCount: number;
  agentsCount: number;
  tags: string[];
  customFields: CustomField[];
  companies: Company[];
  agents: Agent[];
  schedule?: ScheduleItem[];
  materials?: Material[];
}

export interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  type: 'presentation' | 'meeting' | 'networking' | 'break';
  location?: string;
  participants?: string[];
}

export interface Material {
  id: number;
  name: string;
  type: 'presentation' | 'brochure' | 'contract' | 'report';
  url: string;
  uploadedDate: string;
}
