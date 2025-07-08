import type { Event } from './types';

export const mockEvents: Event[] = [
  {
    id: 1,
    name: 'International Hotel Investment Summit 2025',
    type: 'Investment Conference',
    date: '2025-07-15',
    endDate: '2025-07-17',
    location: 'Berlin, Germany',
    venue: 'InterContinental Berlin',
    status: 'Upcoming',
    description: 'Premier global conference for hotel investment, development, and finance professionals. This three-day event brings together industry leaders, investors, and stakeholders to discuss the latest trends and opportunities in the hospitality sector.',
    companiesCount: 45,
    agentsCount: 28,
    tags: ['Investment', 'Finance', 'International', 'Luxury'],
    customFields: [
      { name: 'Booth Number', value: 'Hall A, Booth 15' },
      { name: 'Budget Allocated', value: '€35,000' },
      { name: 'Team Lead', value: 'Sarah Mitchell' },
      { name: 'Expected Leads', value: '80-120' },
      { name: 'Registration Fee', value: '€2,500 per person' },
      { name: 'Conference Theme', value: 'Sustainable Growth in Hospitality' },
      { name: 'Networking Events', value: '5 scheduled sessions' },
    ],
    companies: [
      { id: 1, name: 'Grand Hotels Corporation', agentsCount: 8 },
      { id: 2, name: 'Boutique Hospitality Group', agentsCount: 6 },
    ],
    agents: [
      { id: 1, name: 'Sarah Mitchell', company: 'Grand Hotels Corporation' },
      { id: 2, name: 'Marcus Rodriguez', company: 'Boutique Hospitality Group' },
      { id: 4, name: 'David Chen', company: 'Grand Hotels Corporation' },
    ],
    schedule: [
      {
        id: 1,
        time: '09:00',
        title: 'Opening Keynote: The Future of Hotel Investment',
        type: 'presentation',
        location: 'Main Auditorium',
        participants: ['Industry Leaders', 'All Attendees']
      },
      {
        id: 2,
        time: '11:00',
        title: 'Client Meeting - Grand Hotels Corp',
        type: 'meeting',
        location: 'Meeting Room B',
        participants: ['Sarah Mitchell', 'Client Representatives']
      },
      {
        id: 3,
        time: '14:00',
        title: 'Sustainability Panel Discussion',
        type: 'presentation',
        location: 'Conference Hall 2',
      },
      {
        id: 4,
        time: '18:00',
        title: 'Welcome Reception',
        type: 'networking',
        location: 'Hotel Lobby',
      }
    ],
    materials: [
      {
        id: 1,
        name: 'Investment Summit Presentation 2025',
        type: 'presentation',
        url: '/materials/investment-summit-2025.pdf',
        uploadedDate: '2025-06-20'
      },
      {
        id: 2,
        name: 'Company Brochure - Updated',
        type: 'brochure',
        url: '/materials/company-brochure-updated.pdf',
        uploadedDate: '2025-06-18'
      }
    ]
  },
  {
    id: 2,
    name: 'Resort & Spa Trade Show',
    type: 'Trade Show',
    date: '2025-08-22',
    endDate: '2025-08-24',
    location: 'Las Vegas, NV',
    venue: 'Las Vegas Convention Center',
    status: 'Planning',
    description: 'Leading trade show for resort and spa industry professionals, featuring the latest trends and services in luxury hospitality and wellness.',
    companiesCount: 32,
    agentsCount: 18,
    tags: ['Resort', 'Spa', 'Wellness', 'Networking'],
    customFields: [
      { name: 'Focus Area', value: 'Luxury Resorts & Spa Services' },
      { name: 'Target Attendees', value: '500+' },
      { name: 'Registration Deadline', value: '2025-07-01' },
      { name: 'Sponsorship Level', value: 'Gold Sponsor' },
      { name: 'Exhibition Space', value: '200 sqm' },
    ],
    companies: [{ id: 3, name: 'Resort & Spa International', agentsCount: 12 }],
    agents: [{ id: 3, name: 'Jennifer Park', company: 'Resort & Spa International' }],
    schedule: [
      {
        id: 5,
        time: '10:00',
        title: 'Trade Show Setup',
        type: 'meeting',
        location: 'Exhibition Hall',
      },
      {
        id: 6,
        time: '13:00',
        title: 'Spa Services Showcase',
        type: 'presentation',
        location: 'Demonstration Area',
      }
    ],
    materials: [
      {
        id: 3,
        name: 'Resort Services Catalog',
        type: 'brochure',
        url: '/materials/resort-catalog.pdf',
        uploadedDate: '2025-06-15'
      }
    ]
  },
  {
    id: 3,
    name: 'Boutique Hotel Summit 2025',
    type: 'Conference',
    date: '2025-09-10',
    endDate: '2025-09-11',
    location: 'San Francisco, CA',
    venue: 'The St. Regis San Francisco',
    status: 'Completed',
    description: 'Exclusive summit for boutique hotel owners, operators, and industry innovators focusing on design, guest experience, and operational excellence.',
    companiesCount: 28,
    agentsCount: 22,
    tags: ['Boutique', 'Design', 'Innovation', 'Luxury'],
    customFields: [
      { name: 'Speaking Slot', value: 'Yes - Panel Discussion' },
      { name: 'Sponsor Level', value: 'Platinum Sponsor' },
      { name: 'Leads Generated', value: '67' },
      { name: 'Follow-up Meetings', value: '24 scheduled' },
      { name: 'ROI Assessment', value: 'Positive - 340% return' },
    ],
    companies: [
      { id: 1, name: 'Grand Hotels Corporation', agentsCount: 5 },
      { id: 2, name: 'Boutique Hospitality Group', agentsCount: 8 },
    ],
    agents: [
      { id: 1, name: 'Sarah Mitchell', company: 'Grand Hotels Corporation' },
      { id: 2, name: 'Marcus Rodriguez', company: 'Boutique Hospitality Group' },
    ],
    schedule: [
      {
        id: 7,
        time: '09:30',
        title: 'Design Innovation Panel',
        type: 'presentation',
        location: 'Summit Room',
        participants: ['Marcus Rodriguez', 'Industry Experts']
      }
    ],
    materials: [
      {
        id: 4,
        name: 'Summit Results Report',
        type: 'report',
        url: '/materials/summit-results-2025.pdf',
        uploadedDate: '2025-09-15'
      }
    ]
  },
];
