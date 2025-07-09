import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema, type GetEventResponse } from '@tradelink/shared/events';
import { Button } from '@tradelink/ui/components/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@tradelink/ui/components/dialog';
import { FormInput } from '@tradelink/ui/components/form-input';
import { Input } from '@tradelink/ui/components/input';
import { Rating } from '@tradelink/ui/components/rating';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { Textarea } from '@tradelink/ui/components/textarea';
import { useCreateEvent, useUpdateEvent } from 'api/events';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { EventParticipantsSection } from './EventParticipantsSection';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: GetEventResponse;
}

export function EventDialog({ open, onOpenChange, event }: EventDialogProps) {
  const isEditing = !!event?.id;
  const [error, setError] = useState<string>();

  const createEvent = useCreateEvent({
    onError: error => setError(error.message),
    onSuccess: () => handleClose(),
  });

  const updateEvent = useUpdateEvent({
    onError: error => setError(error.message),
    onSuccess: () => handleClose(),
  });

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setError(undefined);
  };

  const form = useForm({
    resolver: zodResolver(eventSchema.create),
    defaultValues: {
      ...event,
      companyIds: event?.companies?.map(company => company.id) || [],
      contactIds: event?.contacts?.map(contact => contact.id) || [],
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        ...event,
        startDate: event.startDate ? dayjs(event.startDate).format('YYYY-MM-DD') : undefined,
        endDate: event.endDate ? dayjs(event.endDate).format('YYYY-MM-DD') : undefined,
        companyIds: event.companies?.map(company => company.id) || [],
        contactIds: event.contacts?.map(contact => contact.id) || [],
      });
    }
  }, [event, form]);

  const onSubmit = form.handleSubmit(async data => {
    const eventData = {
      ...data,
      startDate: data.startDate ? dayjs(data.startDate).format('YYYY-MM-DD') : undefined,
      endDate: data.endDate ? dayjs(data.endDate).format('YYYY-MM-DD') : undefined,
      companyIds: data.companyIds || [],
      contactIds: data.contactIds || [],
    };

    if (isEditing) {
      updateEvent.mutate({
        id: event.id,
        data: eventData,
      });
    } else {
      createEvent.mutate({
        ...eventData,
        startDate: eventData.startDate || dayjs(data.startDate).format('YYYY-MM-DD'),
        endDate: eventData.endDate || dayjs(data.endDate).format('YYYY-MM-DD'),
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Event Name" required error={form.formState.errors.name?.message}>
                <Input
                  {...form.register('name')}
                  placeholder="Enter event name"
                  aria-invalid={!!form.formState.errors.name}
                />
              </FormInput>

              <FormInput label="Event Type" required error={form.formState.errors.type?.message}>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conference">Conference</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Trade Show">Trade Show</SelectItem>
                        <SelectItem value="Networking">Networking</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormInput>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Start Date" required error={form.formState.errors.startDate?.message}>
                <Input type="date" {...form.register('startDate')} aria-invalid={!!form.formState.errors.startDate} />
              </FormInput>

              <FormInput label="End Date" required error={form.formState.errors.endDate?.message}>
                <Input type="date" {...form.register('endDate')} aria-invalid={!!form.formState.errors.endDate} />
              </FormInput>
            </div>

            <FormInput label="Location" required error={form.formState.errors.location?.message}>
              <Input
                {...form.register('location')}
                placeholder="Enter event location"
                aria-invalid={!!form.formState.errors.location}
              />
            </FormInput>

            <FormInput label="Venue" error={form.formState.errors.venue?.message}>
              <Input
                {...form.register('venue')}
                placeholder="Enter venue name (optional)"
                aria-invalid={!!form.formState.errors.venue}
              />
            </FormInput>

            <FormInput label="Description" error={form.formState.errors.description?.message}>
              <Textarea
                {...form.register('description')}
                placeholder="Enter event description (optional)"
                rows={3}
                aria-invalid={!!form.formState.errors.description}
              />
            </FormInput>
          </div>

          {/* Status and Rating */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Status & Rating</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Status" error={form.formState.errors.status?.message}>
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormInput>

              <FormInput label="Rating" error={form.formState.errors.rating?.message}>
                <Controller
                  name="rating"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Rating value={field.value || 0} disabled={false} onChange={field.onChange} />
                      <span className="text-sm text-muted-foreground">({field.value || 0}/5)</span>
                    </div>
                  )}
                />
              </FormInput>
            </div>
          </div>

          {/* Participants Section */}
          <EventParticipantsSection form={form} event={event} />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createEvent.isPending || updateEvent.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createEvent.isPending || updateEvent.isPending}>
              {isEditing ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
