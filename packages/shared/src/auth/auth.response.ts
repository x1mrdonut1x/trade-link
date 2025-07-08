export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export type JWTToken = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  membership?: Array<{
    id: number;
    name: string;
  }>;
};
