import React, { createContext, useEffect, useState } from "react";
import SessionMng from "../Controllers/SessionManager";

const UserLogContext = createContext();

export const UserLogProvider = ({ children }) => {
  let userTokenLS = localStorage.getItem("UserToken") ?? "";
  const [userToken, setUserToken] = useState(userTokenLS);

  const checkingSessionStatus = async () => {
    const { isOk } = await SessionMng.isSessionActive(userToken);
    if (!isOk) {
      localStorage.setItem("UserToken", "");
      setUserToken("");
    }
  };

  useEffect(() => {
    checkingSessionStatus();
  }, []);

  return <UserLogContext.Provider value={{ userToken, setUserToken }}>{children}</UserLogContext.Provider>;
};

export default UserLogContext;
