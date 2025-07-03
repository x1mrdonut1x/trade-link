import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateContactRequest } from '@tradelink/shared';
import { contactSchema, type ContactWithCompanyDto } from '@tradelink/shared/contact';
import { Button } from '@tradelink/ui/components/button';
import { FormInput } from '@tradelink/ui/components/form-input';
import { Input } from '@tradelink/ui/components/input';
import { Label } from '@tradelink/ui/components/label';
import { Controller, useForm } from 'react-hook-form';
import { useCreateContact, useUpdateContact } from '../../api/contact/hooks';
import { CompanySelector } from '../company-selector/CompanySelector';
import { CountrySelector } from '../country-selector/CountrySelector';

interface ContactFormProps {
  contact?: ContactWithCompanyDto;
  defaultCompanyId?: number;
  onSuccess?: (contactId: number) => void;
  onCancel?: () => void;
}

export function ContactForm({ contact, defaultCompanyId, onSuccess, onCancel }: ContactFormProps) {
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
    control,
    formState: { errors },
  } = useForm<CreateContactRequest>({
    resolver: zodResolver(contactSchema.create),
    defaultValues: {
      ...contact,
      companyId: contact?.companyId || defaultCompanyId || null,
    },
  });

  const onSubmit = (data: CreateContactRequest) => {
    if (isEdit) {
      updateContact.mutate({ id: contact.id, data });
    } else {
      createContact.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="First Name" required {...register('firstName')} error={errors.firstName?.message} />
          <FormInput label="Last Name" required {...register('lastName')} error={errors.lastName?.message} />
        </div>
        <FormInput label="Email" type="email" required {...register('email')} error={errors.email?.message} />
        <FormInput label="Job Title" {...register('jobTitle')} error={errors.jobTitle?.message} />
      </div>

      {/* Company */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Company</h3>
        <div className="space-y-2">
          <Label>Company</Label>
          <Controller
            name="companyId"
            control={control}
            render={({ field }) => (
              <CompanySelector
                value={field.value?.toString() || ''}
                onValueChange={value => field.onChange(value ? Number(value) : null)}
                placeholder="Select a company..."
                searchPlaceholder="Search companies..."
                emptyText="No companies found."
              />
            )}
          />
          {errors.companyId && <p className="text-sm text-destructive">{errors.companyId.message}</p>}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <FormInput label="Phone Number" error={errors.phoneNumber?.message}>
          <div className="flex gap-2">
            <Input placeholder="+1" className="w-20" {...register('phonePrefix')} />
            <Input {...register('phoneNumber')} aria-invalid={!!errors.phoneNumber} />
          </div>
        </FormInput>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CountrySelector
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  placeholder="Select country..."
                  searchPlaceholder="Search countries..."
                  emptyText="No countries found."
                />
              )}
            />
            {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
          </div>
          <FormInput label="City" {...register('city')} error={errors.city?.message} />
        </div>
        <FormInput label="Address" {...register('address')} error={errors.address?.message} />
        <FormInput label="Post Code" {...register('postCode')} error={errors.postCode?.message} />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" loading={createContact.isPending || updateContact.isPending} className="flex-1">
          {isEdit ? 'Update Contact' : 'Create Contact'}
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
