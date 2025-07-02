import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateContactRequest } from '@tradelink/shared';
import { contactSchema, type ContactWithCompanyDto } from '@tradelink/shared/contact';
import { Button } from '@tradelink/ui/components/button';
import { FormInput } from '@tradelink/ui/components/form-input';
import { Input } from '@tradelink/ui/components/input';
import { useForm } from 'react-hook-form';
import { useCreateContact, useUpdateContact } from '../../api/contact/hooks';

interface ContactFormProps {
  contact?: ContactWithCompanyDto;
  onSuccess?: (contactId: number) => void;
  onCancel?: () => void;
}

export function ContactForm({ contact, onSuccess, onCancel }: ContactFormProps) {
  const isEdit = !!contact;
  const createContact = useCreateContact({
    onSuccess: data => {
      onSuccess?.(data.id);
    },
  });
  const updateContact = useUpdateContact({
    onSuccess: data => {
      onSuccess?.(data.id);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateContactRequest>({
    resolver: zodResolver(contactSchema.create),
    values: contact,
  });

  const onSubmit = (data: CreateContactRequest) => {
    if (isEdit) {
      updateContact.mutate({ id: contact.id, data });
    } else {
      createContact.mutate(data);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="First Name" required {...register('firstName')} error={errors.firstName?.message} />

        <FormInput label="Last Name" {...register('lastName')} error={errors.lastName?.message} />

        <FormInput label="Email" type="email" {...register('email')} error={errors.email?.message} />

        <FormInput label="Phone Number" error={errors.phoneNumber?.message}>
          <div className="flex gap-2">
            <Input placeholder="+1" className="w-20" {...register('phonePrefix')} />
            <Input {...register('phoneNumber')} aria-invalid={!!errors.phoneNumber} />
          </div>
        </FormInput>

        <FormInput label="Country" {...register('country')} error={errors.country?.message} />

        <FormInput label="City" {...register('city')} error={errors.city?.message} />

        <FormInput label="Address" containerClassName="md:col-span-2" {...register('address')} error={errors.address?.message} />

        <FormInput label="Post Code" {...register('postCode')} error={errors.postCode?.message} />

        <FormInput
          label="Company ID"
          type="number"
          {...register('companyId', {
            setValueAs: value => (value === '' ? undefined : Number(value)),
          })}
          error={errors.companyId?.message}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Contact' : 'Create Contact'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
