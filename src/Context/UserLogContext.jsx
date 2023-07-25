import { addDoc, getDoc, getDocs, updateDoc, collection, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import * as moment from "moment";
import React, { createContext, useEffect, useState } from "react";
//Context
const UserLogContext = createContext();

export const UserLogProvider = ({ children }) => {
  let userTokenLS = localStorage.getItem("UserToken") ?? "";
  const [userToken, setUserToken] = useState(userTokenLS);

  const logSession = async ({ uname, password }) => {
    try {
      const resGet = await getDocs(query(collection(db, "users"), where("uname", "==", uname), where("password", "==", password)));
      if (!resGet.docs[0]) throw "LogSession/CredentialsNotFound";
      const newUserLogInfo = {
        userid: resGet.docs[0].id,
        creationdate: moment().format("DD-MM-YYYY, HH:mm:ss"),
        expirationdate: moment().add(7, "d").format("DD-MM-YYYY, HH:mm:ss"),
      };
      const resAdded = await addDoc(collection(db, "userlogs"), newUserLogInfo);
      return resAdded.id;
    } catch (error) {
      console.log(error);
    }
  };

  const expSession = async () => {
    await updateDoc(doc(db, "userlogs", userToken), {
      expirationdate: moment().format("DD-MM-YYYY, HH:mm:ss"),
    });
    localStorage.setItem("UserToken", "");
    setUserToken("");
  };

  const actSession = async (callback) => {
    const userId = await refreshSession();
    callback(userId);
  };

  const refreshSession = async () => {
    if (userToken.length > 0) {
      try {
        const res = await getDoc(doc(db, "userlogs", userToken));
        const data = res.data();
        const expDate = moment(data.expirationdate, "DD-MM-YYYY, HH:mm:ss").format();
        if (moment(expDate).isBefore()) return expSession();
        return data.userid;
      } catch (error) {
        console.log(error);
        return "";
      }
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return <UserLogContext.Provider value={{ userToken, setUserToken, logSession, expSession, actSession }}>{children}</UserLogContext.Provider>;
};

export default UserLogContext;
