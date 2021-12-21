import React, {
  createContext,
  ReactNode,
  useContext
} from 'react';

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContexData {
  user: User;
}

const AuthContext = createContext({} as AuthContexData);

function AuthProvider({ children }: AuthProviderProps) {
  const user = {
    id: '1',
    name: 'Anderson',
    email: 'an@teste.com',
    photo: ''
  }
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth }