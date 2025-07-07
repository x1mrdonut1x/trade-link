export interface ApiError {
  statusCode: number;
  message: string;
  title: string;
  errors?: { path: string; message: string }[]; // Validation errors
}
