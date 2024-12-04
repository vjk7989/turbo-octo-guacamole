export interface User {
  id: string;
  username: string;
  role: 'admin' | 'employee';
  name: string;
  email: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface UserWithPassword extends User {
  password: string;
}