import type { User, ErrorSession } from '../context/auth/AuthReducer'; 

export interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean; 
}

export interface SignupFormValues {
  nombre: string; 
  email: string;
  password: string;
}

export interface AuthContextType {
  token: string | null;
  message: string | null;
  auth: boolean | null;
  login: (values: LoginFormValues) => Promise<void>;
  errorSession: ErrorSession | null;
  userAuthenticate: (token: string | null) => Promise<void>;
  user: User | null;
  signup: (values: SignupFormValues) => Promise<void>;
  logout: () => void;
  signupStatus: number | null;
}