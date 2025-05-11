// UserContext.tsx
import React, { createContext, useState, useContext } from "react";
import { LoginReponseTypes } from "../../types/account";

type UserContextType = {
  userData: LoginReponseTypes["user"] | null;
  setUserData: (data: LoginReponseTypes["user"] | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
};

const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
  token: null,
  setToken: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<LoginReponseTypes["user"] | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("Context must not be null");
  return context;
};
