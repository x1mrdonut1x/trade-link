import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactWithCompanyDto, type CreateContactType } from '@tradelink/shared/contact';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Input } from '@tradelink/ui/components/input';
import { Label } from '@tradelink/ui/components/label';
import { useForm } from 'react-hook-form';
import { useCreateContact, useUpdateContact } from '../../api/contact/hooks';

interface ContactFormProps {
  contact?: ContactWithCompanyDto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-600 mt-1">{message}</p>;
}

export function ContactForm({ contact, onSuccess, onCancel }: ContactFormProps) {
  const isEdit = !!contact;
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateContactType>({
    resolver: zodResolver(contactSchema.create),
    defaultValues: contact
      ? {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          contactData: contact.contactData as any,
          companyId: contact.companyId || undefined,
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          contactData: {},
        },
  });

  const onSubmit = async (data: CreateContactType) => {
    try {
      if (isEdit) {
        await updateContact.mutateAsync({ id: contact.id, data });
      } else {
        await createContact.mutateAsync(data);
        reset();
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save contact:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Contact' : 'Create New Contact'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register('firstName')} aria-invalid={!!errors.firstName} />
              <ErrorMessage message={errors.firstName?.message} />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register('lastName')} aria-invalid={!!errors.lastName} />
              <ErrorMessage message={errors.lastName?.message} />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
              <ErrorMessage message={errors.email?.message} />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex gap-2">
                <Input id="phonePrefix" placeholder="+1" className="w-20" {...register('contactData.phonePrefix')} />
                <Input id="phoneNumber" {...register('contactData.phoneNumber')} aria-invalid={!!errors.contactData?.phoneNumber} />
              </div>
              <ErrorMessage message={errors.contactData?.phoneNumber?.message} />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register('contactData.country')} aria-invalid={!!errors.contactData?.country} />
              <ErrorMessage message={errors.contactData?.country?.message} />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register('contactData.city')} aria-invalid={!!errors.contactData?.city} />
              <ErrorMessage message={errors.contactData?.city?.message} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('contactData.address')} aria-invalid={!!errors.contactData?.address} />
              <ErrorMessage message={errors.contactData?.address?.message} />
            </div>

            <div>
              <Label htmlFor="postCode">Post Code</Label>
              <Input id="postCode" {...register('contactData.postCode')} aria-invalid={!!errors.contactData?.postCode} />
              <ErrorMessage message={errors.contactData?.postCode?.message} />
            </div>

            <div>
              <Label htmlFor="companyId">Company ID</Label>
              <Input
                id="companyId"
                type="number"
                {...register('companyId', {
                  setValueAs: value => (value === '' ? undefined : Number(value)),
                })}
                aria-invalid={!!errors.companyId}
              />
              <ErrorMessage message={errors.companyId?.message} />
            </div>
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
      </CardContent>
    </Card>
  );
}
