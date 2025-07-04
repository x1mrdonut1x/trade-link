export type LoginResponse = {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export type AuthenticatedUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};
