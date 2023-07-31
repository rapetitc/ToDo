import React, { createContext, useEffect, useState } from "react";
import SessionMng from "../Controllers/SessionManager";

const UserLogContext = createContext();

export const UserLogProvider = ({ children }) => {
  let sessionTokenLS = localStorage.getItem("token") ?? undefined;
  const [sessionToken, setSessionToken] = useState(sessionTokenLS);

  const checkingSessionStatus = async () => {
    if (sessionToken) {
      const { isOk } = await SessionMng.isSessionActive(sessionToken);
      if (!isOk) setSessionToken(undefined);
    }
  };

  useEffect(() => {
    checkingSessionStatus();
  }, []);

  return <UserLogContext.Provider value={{ sessionToken, setSessionToken }}>{children}</UserLogContext.Provider>;
};

export default UserLogContext;
