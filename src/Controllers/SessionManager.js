import { getDoc, getDocs, addDoc, updateDoc, doc, collection, query, where } from "firebase/firestore";
import * as moment from "moment";
import { db } from "../firebase";
import { dateFormat } from "../utils/utils";

class SessionManager {
  constructor() {
    this.dbName = "sessions"
  }
  async isSessionActive(token) {
    try {
      const resGet = await getDoc(doc(db, this.dbName, token))
      if (!resGet.exists()) throw "IsSessionActive/SessionNotFound"

      const { expirationDate, userID } = resGet.data()
      if (moment(expirationDate, dateFormat).isSameOrAfter(moment().format)) throw "IsSessionActive/SessionExpired"

      return { isOk: true, userID }
    } catch (error) {
      console.error("IsSessionActive", error);

      if (error == "IsSessionActive/SessionExpired" || error == "IsSessionActive/SessionNotFound") return { isOk: false, error }
      return { isOk: false, error: "IsSessionActive/UnexpectedError" }
    }
  }
  async logSession({ uname, password }) {
    try {
      const { docs } = await getDocs(query(collection(db, "users"), where("uname", "==", uname), where("password", "==", password)));
      if (docs.length == 0) throw "LogSession/CredentialsNotFound";

      const userData = { id: docs[0].id, ...docs[0].data() }
      if (!userData.status) throw "LogSession/UserDisabled"

      const sessionInfo = {
        userID: userData.id,
        creationDate: moment().format(dateFormat),
        expirationDate: moment().add(1, "d").format(dateFormat),
      };
      const { id } = await addDoc(collection(db, this.dbName), sessionInfo)
      localStorage.setItem("token", id);

      const { fullname, type, creationdate } = userData
      localStorage.setItem("user", JSON.stringify({ fullname, type, creationdate }));

      return { isOk: true, token: id };
    } catch (error) {
      console.error("LogSession", error);

      if (error == "LogSession/CredentialsNotFound" || error == "LogSession/CredentialsNotFound") return { isOk: false, error }
      return { isOk: false, error: "LogSession/UnexpectedError" }
    }
  }
  async closeSession(token) {
    try {
      const { isOk, error } = await this.isSessionActive(token)
      if (isOk) {
        await updateDoc(doc(db, this.dbName, token), {
          expirationDate: moment().format(dateFormat),
        });
      }

      if (error == "IsSessionActive/UnexpectedError") throw "CloseSession/NotAbleToCheck"
      // if (error == "IsSessionActive/SessionExpired" || error == "IsSessionActive/SessionNotFound") return { isOk: true }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return { isOk: true }
    } catch (error) {
      console.error("CloseSession", error);

      if (error = "CloseSession/NotAbleToCheck") return { isOk: false, error }
      return { isOk: false, error: "CloseSession/UnexpectedError" }
    }
  }
  async actSession(token, callback) {
    try {
      const { isOk, userID } = await this.isSessionActive(token)
      if (!isOk) throw "ActSession/ActionAborted"

      callback(userID);

      return { isOk: true }
    } catch (error) {
      console.error("ActSession", error);

      if (error == "ActSession/ActionAborted") return { isOk: false, error }
      return { isOk: false, error: "ActSession/UnexpectedError" }
    }
  };
}


const SessionMng = new SessionManager
export default SessionMng