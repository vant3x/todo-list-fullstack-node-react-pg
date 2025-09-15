import { createContext } from "react";
import type { AuthContextType } from "../../interfaces/AuthContextType";

const AuthContext = createContext<AuthContextType>({
    token: null,
    message: null,
    auth: null,
    login: async () => {},
    errorSession: null,
    userAuthenticate: async () => {},
    user: null,
    signup: async () => {},
    logout: () => {},
    signupStatus: null
});

export default AuthContext;
