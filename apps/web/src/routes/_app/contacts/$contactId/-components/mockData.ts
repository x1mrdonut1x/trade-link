import type { Contact } from './types';

export const mockContacts: Contact[] = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Mitchell',
    title: 'Senior Sales Agent',
    company: 'Grand Hotels Corporation',
    companyId: 1,
    email: 'sarah.mitchell@grandhotels.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    avatar: '/avatars/sarah-mitchell.jpg',
    lastContact: '2025-06-20',
    eventsCount: 3,
    tags: ['Luxury Hotels', 'VIP Clients', 'Top Performer'],
    customFields: [
      { name: 'Specialization', value: 'Corporate Events & Meetings' },
      { name: 'Years Experience', value: '8 years' },
      { name: 'Preferred Contact Method', value: 'Email' },
      { name: 'Commission Rate', value: '12%' },
      { name: 'Territory', value: 'Northeast US' },
      { name: 'Languages', value: 'English, French' },
    ],
    recentActivities: [
      {
        id: 1,
        type: 'meeting',
        description: 'Client presentation for Grand Hotels quarterly review',
        date: '2025-06-20',
        outcome: 'Secured $50K contract extension'
      },
      {
        id: 2,
        type: 'call',
        description: 'Follow-up call with potential corporate client',
        date: '2025-06-18',
        outcome: 'Scheduled site visit'
      },
      {
        id: 3,
        type: 'email',
        description: 'Sent proposal to luxury hotel chain',
        date: '2025-06-15',
        outcome: 'Awaiting response'
      },
    ],
    upcomingEvents: [
      {
        id: 1,
        name: 'International Hotel Investment Summit 2025',
        date: '2025-07-15',
        location: 'Berlin, Germany',
        status: 'upcoming'
      },
      {
        id: 2,
        name: 'Luxury Hospitality Expo',
        date: '2025-08-10',
        location: 'Las Vegas, NV',
        status: 'upcoming'
      },
    ],
    metrics: {
      totalSales: '$450K',
      eventsAttended: 12,
      conversionRate: '85%',
      responseTime: '2.5 hours'
    }
  },
  {
    id: 2,
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    title: 'Regional Sales Manager',
    company: 'Boutique Hospitality Group',
    companyId: 2,
    email: 'marcus.rodriguez@boutiquegroup.com',
    phone: '+1 (555) 456-7890',
    location: 'Los Angeles, CA',
    avatar: '/avatars/marcus-rodriguez.jpg',
    lastContact: '2025-06-18',
    eventsCount: 2,
    tags: ['Design Hotels', 'West Coast', 'Trade Shows'],
    customFields: [
      { name: 'Territory', value: 'Western United States' },
      { name: 'Client Focus', value: 'Boutique & Lifestyle Hotels' },
      { name: 'Meeting Preference', value: 'In-Person' },
      { name: 'Languages', value: 'English, Spanish' },
      { name: 'Years Experience', value: '6 years' },
    ],
    recentActivities: [
      {
        id: 4,
        type: 'event',
        description: 'Attended West Coast Hotel Expo',
        date: '2025-06-16',
        outcome: 'Generated 5 new leads'
      },
      {
        id: 5,
        type: 'meeting',
        description: 'Regional team strategy session',
        date: '2025-06-12',
        outcome: 'Updated Q3 targets'
      },
    ],
    upcomingEvents: [
      {
        id: 3,
        name: 'Resort & Spa Trade Show',
        date: '2025-08-22',
        location: 'San Diego, CA',
        status: 'upcoming'
      },
    ],
    metrics: {
      totalSales: '$320K',
      eventsAttended: 8,
      conversionRate: '78%',
      responseTime: '3.2 hours'
    }
  },
  {
    id: 3,
    firstName: 'Jennifer',
    lastName: 'Park',
    title: 'Sales Agent',
    company: 'Resort & Spa International',
    companyId: 3,
    email: 'jennifer.park@resortandspa.com',
    phone: '+1 (555) 987-6543',
    location: 'Miami, FL',
    avatar: '/avatars/jennifer-park.jpg',
    lastContact: '2025-06-15',
    eventsCount: 1,
    tags: ['Resort Sales', 'Spa Services', 'International'],
    customFields: [
      { name: 'Specialty', value: 'All-Inclusive Resorts' },
      { name: 'Target Markets', value: 'Caribbean, Mexico' },
      { name: 'Contact Hours', value: '8 AM - 6 PM EST' },
      { name: 'Performance Rating', value: 'Excellent' },
      { name: 'Years Experience', value: '4 years' },
    ],
    recentActivities: [
      {
        id: 6,
        type: 'call',
        description: 'Client consultation for resort wedding package',
        date: '2025-06-15',
        outcome: 'Proposal sent'
      },
    ],
    upcomingEvents: [
      {
        id: 4,
        name: 'Caribbean Resort Summit',
        date: '2025-09-05',
        location: 'Barbados',
        status: 'upcoming'
      },
    ],
    metrics: {
      totalSales: '$280K',
      eventsAttended: 6,
      conversionRate: '72%',
      responseTime: '4.1 hours'
    }
  },
  {
    id: 4,
    firstName: 'David',
    lastName: 'Chen',
    title: 'Junior Sales Agent',
    company: 'Grand Hotels Corporation',
    companyId: 1,
    email: 'david.chen@grandhotels.com',
    phone: '+1 (555) 123-4568',
    location: 'Chicago, IL',
    avatar: '/avatars/david-chen.jpg',
    lastContact: '2025-06-22',
    eventsCount: 1,
    tags: ['New Hire', 'Training', 'Business Hotels'],
    customFields: [
      { name: 'Start Date', value: 'January 2025' },
      { name: 'Mentor', value: 'Sarah Mitchell' },
      { name: 'Training Progress', value: '75% Complete' },
      { name: 'Focus Area', value: 'Corporate Bookings' },
      { name: 'Years Experience', value: '0.5 years' },
    ],
    recentActivities: [
      {
        id: 7,
        type: 'meeting',
        description: 'Weekly mentoring session with Sarah Mitchell',
        date: '2025-06-22',
        outcome: 'Reviewed Q2 performance'
      },
      {
        id: 8,
        type: 'call',
        description: 'Cold call to corporate client',
        date: '2025-06-21',
        outcome: 'Follow-up scheduled'
      },
    ],
    upcomingEvents: [
      {
        id: 5,
        name: 'Sales Training Workshop',
        date: '2025-07-08',
        location: 'Chicago, IL',
        status: 'upcoming'
      },
    ],
    metrics: {
      totalSales: '$45K',
      eventsAttended: 3,
      conversionRate: '45%',
      responseTime: '6.8 hours'
    }
  },
];
