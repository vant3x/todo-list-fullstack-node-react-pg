'use client';

import React, { useReducer, useEffect, useCallback, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from "./AuthContext";
import authReducer from "./AuthReducer";
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../snackbar/SnackbarContext';

import {
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  REMOVE_ALERTS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SESSION_ERROR,
  USER_AUTHENTICATE,
  LOGOUT,
} from "./types";

import api from "../../services/api"; 
import authToken from "../../config/authToken";
import type { Props } from "../../interfaces/Props.interface";
import type { LoginFormValues, SignupFormValues } from "../../interfaces/AuthContextType";

import type { AuthState as ReducerAuthState, User } from "./AuthReducer";
interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const loginUser = async (values: LoginFormValues): Promise<{ token: string }> => {
  const response = await api.post("/auth/login", values); 
  return response.data;
};

const registerUser = async (values: SignupFormValues): Promise<{ message: string; status: number }> => {
  const response = await api.post("/auth/registro", values); 
  return { message: "Usuario creado correctamente", status: response.status };
};


const AuthState = ({ children }: Props) => {
  const initialState: ReducerAuthState = {
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    auth: null,
    user: null,
    message: null,
    errorSession: null,
    signupStatus: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const location = useLocation();


  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    authToken(null);
    dispatch({
      type: LOGOUT,
    });
    navigate('/login');
  }, [navigate]);


  const userAuthenticate = useCallback(async (token: string | null) => {
    authToken(token);

    if (!token) {
        logout();
        return;
    }

    try {
      const response = await api.get<User>("/auth/perfil");
      if (response.data) {
        dispatch({
          type: USER_AUTHENTICATE,
          payload: response.data,
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      dispatch({
        type: SESSION_ERROR,
        payload: axiosError?.response?.data?.message || null,
      });
      logout();
    }
  }, [logout]);

  const loginMutation = useMutation<
    { token: string },
    AxiosErrorResponse,
    LoginFormValues
  >({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      const { token } = data;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { token: token },
      });
      await userAuthenticate(token);
      showSnackbar("Inicio de sesión exitoso", "success");
      navigate('/dashboard'); 
    },
    onError: (error) => {
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response?.data?.message || null,
      });
      showSnackbar(error.response?.data?.message || "Credenciales incorrectas", "error");
    },
  });

  const signupMutation = useMutation<
    { message: string; status: number },
    AxiosErrorResponse,
    SignupFormValues
  >({
    mutationFn: registerUser,
    onSuccess: (data) => {
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: {
          message: data.message,
          status: data.status
        }
      });
      showSnackbar(data.message, "success");
    },
    onError: (error) => {
      dispatch({
        type: SIGNUP_ERROR,
        payload: error.response?.data?.message || null,
      });
      showSnackbar(error.response?.data?.message || "Error al crear usuario", "error");
    },
    onSettled: () => {
      setTimeout(() => {
        dispatch({ type: REMOVE_ALERTS });
      }, 4000);
    }
  });


  const login = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (values: SignupFormValues) => {
    try {
      await signupMutation.mutateAsync(values);
    } catch (error) {
      throw error;
    }
  };


  useEffect(() => {
    const checkAuthStatus = async () => {
      if (typeof window === "undefined") return;

      const storedToken = localStorage.getItem("token");
      const publicPaths = ['/login', '/registrar'];

      if (storedToken) {
        await userAuthenticate(storedToken);
      } else if (!publicPaths.includes(location.pathname)) {
        logout();
      }
    };

    checkAuthStatus();
  }, [userAuthenticate, logout, location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        auth: state.auth,
        user: state.user,
        message: state.message,
        errorSession: state.errorSession,
        signupStatus: state.signupStatus,
        signup,
        login,
        userAuthenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;