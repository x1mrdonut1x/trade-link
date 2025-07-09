import { initClient } from '../../helpers/auth/auth.helper';
import { createCompany } from '../../helpers/company/company.helper';
import { createContact } from '../../helpers/contact/contact.helper';
import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from '../../helpers/events/events.helper';
import { createTag } from '../../helpers/tags/tags.helper';

describe('Events', () => {
  let companyId: number;
  let contactId: number;
  let tagId: number;

  beforeAll(async () => {
    // Setup test user and tenant
    await initClient();

    // Create supporting entities
    const company = await createCompany({
      name: 'Test Company',
      email: 'company@test.com',
    });
    companyId = company.id;

    const contact = await createContact({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      companyId,
    });
    contactId = contact.id;

    const tag = await createTag({
      name: 'Conference',
      color: '#ff0000',
    });
    tagId = tag.id;
  });

  describe('POST /events', () => {
    it('should create a new event', async () => {
      const eventData = {
        name: 'Test Conference 2025',
        type: 'Conference',
        startDate: '2025-08-15',
        endDate: '2025-08-17',
        location: 'New York, NY',
        venue: 'Convention Center',
        description: 'A test conference',
        status: 'Planning',
        rating: 4,
        companyIds: [companyId],
        contactIds: [contactId],
        tagIds: [tagId],
      };

      const event = await createEvent(eventData);

      expect(event).toBeDefined();
      expect(event.name).toBe(eventData.name);
      expect(event.type).toBe(eventData.type);
      expect(event.location).toBe(eventData.location);
      expect(event.status).toBe(eventData.status);
      expect(event.rating).toBe(eventData.rating);
      expect(event.tags).toHaveLength(1);
      expect(event.tags?.[0].name).toBe('Conference');
    });

    it('should create event with minimal required fields', async () => {
      const eventData = {
        name: 'Minimal Event',
        type: 'Meeting',
        startDate: '2025-09-01',
        endDate: '2025-09-01',
        location: 'Office',
      };

      const event = await createEvent(eventData);

      expect(event).toBeDefined();
      expect(event.name).toBe(eventData.name);
      expect(event.status).toBe('Planning'); // Default status
    });
  });

  describe('GET /events', () => {
    let eventId: number;

    beforeEach(async () => {
      const event = await createEvent({
        name: 'List Test Event',
        type: 'Workshop',
        startDate: '2025-07-20',
        endDate: '2025-07-20',
        location: 'Remote',
      });
      eventId = event.id;
    });

    it('should get all events', async () => {
      const events = await getAllEvents();

      expect(events).toBeDefined();
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it('should filter events by search term', async () => {
      const events = await getAllEvents({ search: 'List Test' });

      expect(events).toBeDefined();
      expect(events.length).toBeGreaterThan(0);
      expect(events[0].name).toContain('List Test');
    });

    it('should filter events by status', async () => {
      const events = await getAllEvents({ status: 'Planning' });

      expect(events).toBeDefined();
      expect(events.length).toBeGreaterThan(0);
      expect(events.every(event => event.status === 'Planning')).toBe(true);
    });
  });

  describe('GET /events/:id', () => {
    let eventId: number;

    beforeEach(async () => {
      const event = await createEvent({
        name: 'Detail Test Event',
        type: 'Seminar',
        startDate: '2025-08-01',
        endDate: '2025-08-01',
        location: 'Conference Room',
        companyIds: [companyId],
        contactIds: [contactId],
      });
      eventId = event.id;
    });

    it('should get event by id', async () => {
      const event = await getEvent(eventId);

      expect(event).toBeDefined();
      expect(event.id).toBe(eventId);
      expect(event.name).toBe('Detail Test Event');
      expect(event.companies).toHaveLength(1);
      expect(event.contacts).toHaveLength(1);
      expect(event.schedule).toBeDefined();
    });
  });

  describe('PUT /events/:id', () => {
    let eventId: number;

    beforeEach(async () => {
      const event = await createEvent({
        name: 'Update Test Event',
        type: 'Conference',
        startDate: '2025-09-15',
        endDate: '2025-09-17',
        location: 'Original Location',
      });
      eventId = event.id;
    });

    it('should update event', async () => {
      const updateData = {
        name: 'Updated Event Name',
        location: 'Updated Location',
        rating: 5,
      };

      const updatedEvent = await updateEvent(eventId, updateData);

      expect(updatedEvent).toBeDefined();
      expect(updatedEvent.name).toBe(updateData.name);
      expect(updatedEvent.location).toBe(updateData.location);
      expect(updatedEvent.rating).toBe(updateData.rating);
    });
  });

  describe('DELETE /events/:id', () => {
    let eventId: number;

    beforeEach(async () => {
      const event = await createEvent({
        name: 'Delete Test Event',
        type: 'Workshop',
        startDate: '2025-10-01',
        endDate: '2025-10-01',
        location: 'Test Location',
      });
      eventId = event.id;
    });

    it('should delete event', async () => {
      const result = await deleteEvent(eventId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Event deleted successfully');
    });
  });
});
