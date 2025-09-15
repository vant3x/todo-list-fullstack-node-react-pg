import type { User, ErrorSession } from '../context/auth/AuthReducer'; // Corrected to type-only import

// Define interfaces for login and signup payloads
export interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean; // Optional, if you want to implement "remember me"
}

export interface SignupFormValues {
  name: string; // Assuming backend registration still expects a name
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

// Export as default as well, in case it's needed
export default AuthContextType;