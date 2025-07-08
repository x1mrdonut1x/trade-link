export const COMPANY_FIELDS = [
  { key: 'name', label: 'Name', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phonePrefix', label: 'Phone Prefix', required: false },
  { key: 'phoneNumber', label: 'Phone Number', required: false },
  { key: 'description', label: 'Description', required: false },
  { key: 'website', label: 'Website', required: false },
  { key: 'size', label: 'Size', required: false },
  { key: 'address', label: 'Address', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'country', label: 'Country', required: false },
  { key: 'postCode', label: 'Post Code', required: false },
  { key: 'createdAt', label: 'Created At', required: false },
] as const;

export const CONTACT_FIELDS = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'jobTitle', label: 'Job Title', required: false },
  { key: 'phonePrefix', label: 'Phone Prefix', required: false },
  { key: 'phoneNumber', label: 'Phone Number', required: false },
  { key: 'address', label: 'Address', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'country', label: 'Country', required: false },
  { key: 'postCode', label: 'Post Code', required: false },
  { key: 'companyName', label: 'Company Name', required: false },
  { key: 'createdAt', label: 'Created At', required: false },
] as const;
