import { zodResolver } from '@hookform/resolvers/zod';
import { companySchema, type CreateCompanyRequest, type GetCompanyResponse } from '@tradelink/shared/company';
import { Button } from '@tradelink/ui/components/button';
import { FormInput } from '@tradelink/ui/components/form-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { Save } from '@tradelink/ui/icons';
import { Controller, useForm } from 'react-hook-form';
import { useCreateCompany, useUpdateCompany } from '../../api/company/hooks';
import { CountrySelector } from '../country-selector/CountrySelector';

interface CompanyFormProps {
  company?: GetCompanyResponse;
  onSuccess?: (companyId: number) => void;
  onCancel?: () => void;
}

export function CompanyForm({ company, onSuccess, onCancel }: CompanyFormProps) {
  const isEdit = company?.id != null;

  const createCompany = useCreateCompany({
    onSuccess: data => onSuccess?.(data.id),
  });

  const updateCompany = useUpdateCompany({
    onSuccess: data => onSuccess?.(data.id),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateCompanyRequest>({
    resolver: zodResolver(companySchema.create),
    values: company,
  });

  const onSubmit = (data: CreateCompanyRequest) => {
    if (isEdit) {
      updateCompany.mutate({ id: company.id, data });
    } else {
      createCompany.mutate(data);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <FormInput label="Name" {...register('name')} error={errors.name?.message} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <FormInput label="PhoneNumber" {...register('phoneNumber')} error={errors.phoneNumber?.message} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Website" {...register('website')} error={errors.website?.message} placeholder="https://example.com" />
        <FormInput label="Company Size" error={errors.size?.message}>
          <Select value={watch('size') || ''} onValueChange={value => setValue('size', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 employee</SelectItem>
              <SelectItem value="1-5">1 - 5 employees</SelectItem>
              <SelectItem value="5-10">5 - 10 employees</SelectItem>
              <SelectItem value="10-100">10 - 100 employees</SelectItem>
              <SelectItem value="100+">100+ employees</SelectItem>
            </SelectContent>
          </Select>
        </FormInput>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="City" {...register('city')} error={errors.city?.message} />

        <FormInput label="Country" {...register('country')} error={errors.country?.message}>
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
        </FormInput>
      </div>

      <div>
        <FormInput label="Description" {...register('description')} error={errors.description?.message}>
          <textarea
            className="w-full p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            rows={3}
            placeholder="Brief description of the company..."
            {...register('description')}
          />
        </FormInput>
      </div>

      <div className="flex gap-2">
        <Button type="submit" loading={createCompany.isPending || updateCompany.isPending} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {isEdit ? 'Save Changes' : 'Save Company'}
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
