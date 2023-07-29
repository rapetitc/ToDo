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
      if (!resGet.exists()) throw "CheckSession/NotFound"

      const { expirationDate, userId } = resGet.data()
      if (moment(expirationDate, dateFormat).isSameOrAfter(moment().format)) throw "CheckSession/Expired"

      return { isOk: true, msg: "Session is active", userId }
    } catch (error) {
      if (error == "Session/Expired") return { isOk: false, msg: "Session expired", error }
      if (error == "Session/NotFound") return { isOk: false, msg: "Session not found", error }
      return { isOk: false, msg: "Unexpected error when trying to check session status!", error: "CheckSession/Unexpected" }
    }
  }
  async logSession({ uname, password }) {
    try {
      const { docs } = await getDocs(query(collection(db, "users"), where("uname", "==", uname), where("password", "==", password)));
      if (docs.length == 0) throw "LogSession/CredentialsNotFound";

      const sessionInfo = {
        userId: docs[0].id,
        creationDate: moment().format(dateFormat),
        expirationDate: moment().add(1, "d").format(dateFormat),
      };
      const { id } = await addDoc(collection(db, this.dbName), sessionInfo)

      return { isOk: true, msg: "Session logged sucessfully", data: id };
    } catch (error) {
      if (error == "LogSession/CredentialsNotFound") return { isOk: false, msg: "Credentials not found", error }
      return { isOk: false, msg: "Unexpected error when trying to log session!", error: "LogSession/Unexpected" }
    }
  }
  async closeSession(token) {
    try {
      const { isOk, error } = await this.isSessionActive(token)
      if (!isOk) {
        if (error == "CheckSession/Unexpected") throw "CloseSession/NotAbleToCheck"
        if (error == "CheckSession/Expired" || error == "CheckSession/NotFound") return { isOk: true, msg: "Session already expired or was not found" }
      }

      await updateDoc(doc(db, this.dbName, token), {
        expirationDate: moment().format(dateFormat),
      });

      return { isOk: true, msg: "Session was closed successfully" }
    } catch (error) {
      if (error = "CloseSession/NotAbleToCheck") return { isOk: false, msg: "Was not able to close session!", error }
      return { isOk: false, msg: "Unexpected error when trying to close session!", error: "CloseSession/Unexpected" }
    }
  }
  async actSession(token, callback) {
    try {
      const { isOk, userId } = await this.isSessionActive(token)

      if (!isOk) throw "ActSession/ActionAborted"

      callback(userId);

      return { isOk: true, msg: "Action was successfully done!" }
    } catch (error) {
      if (error == "ActSession/ActionAborted") return { isOk: false, msg: "Action was aborted, it seems that the session has expired!", error }
      return { isOk: false, msg: "Unexpected error when trying execute a session action!", error: "ActSession/Unexpected" }
    }
  };
}


const SessionMng = new SessionManager
export default SessionMng