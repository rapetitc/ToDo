import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
//Context
import UserLogContext from "./Context/UserLogContext";
//Components
import Header from "./Components/Header";
import LogInForm from "./Components/LogInForm";
import CreateUserForm from "./Components/CreateUserForm";
import ToDo from "./Components/ToDo";

const App = () => {
  const { userToken } = useContext(UserLogContext);
  return (
    <>
      <Header />
      <Routes>
        {userToken.length == 0 ? (
          <>
            <Route path='/' element={<LogInForm />} />
            <Route path='/signin' element={<CreateUserForm />} />
          </>
        ) : (
          <>
            <Route path='/' element={<ToDo />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
