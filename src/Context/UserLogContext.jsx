import { addDoc, getDoc, getDocs, updateDoc, collection, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";
import * as moment from "moment";
import React, { createContext, useEffect, useState } from "react";
//Context
const UserLogContext = createContext();

export const UserLogProvider = ({ children }) => {
  let userTokenLS = localStorage.getItem("UserToken") ?? "";
  const [userToken, setUserToken] = useState(userTokenLS);

  const logSession = async (credentials) => {
    const { uname, password } = credentials;
    if (uname.length < 4 || password.length < 4) throw "credentials/incomplete";
    const res = await getDocs(query(collection(db, "users"), where("uname", "==", credentials.uname), where("password", "==", credentials.password)));
    if (res.docs[0]) {
      const newUserLogInfo = {
        userid: res.docs[0].id,
        creationdate: moment().format("DD-MM-YYYY, HH:mm:ss"),
        expirationdate: moment().add(7, "d").format("DD-MM-YYYY, HH:mm:ss"),
      };
      const resAdded = await addDoc(collection(db, "userlogs"), newUserLogInfo);
      Swal.fire({
        position: "center",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        localStorage.setItem("UserToken", resAdded.id);
        setUserToken(resAdded.id);
      }, 2000);
    } else {
      console.log("Usuario o contraseña incorrecta");
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
      const res = await getDoc(doc(db, "userlogs", userToken));
      const data = res.data();
      const expDate = moment(data.expirationdate, "DD-MM-YYYY, HH:mm:ss").format();
      if (moment(expDate).isBefore()) return expSession();
      return data.userid;
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return <UserLogContext.Provider value={{ userToken, logSession, expSession, actSession }}>{children}</UserLogContext.Provider>;
};

export default UserLogContext;
