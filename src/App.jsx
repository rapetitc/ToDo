import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
//Context
import UserLogContext from "./Context/UserLogContext";
//Components
import LoadingUI from "./Components/LoadingUI";
import Header from "./Components/Header";
import LogInForm from "./Components/LogInForm";
import CreateUserForm from "./Components/CreateUserForm";
import ToDo from "./Components/ToDo";
import Menu from "./Components/Menu";

const App = () => {
  const { sessionToken } = useContext(UserLogContext);
  return (
    <>
      <Menu />
      <LoadingUI />
      <Header />
      <Routes>
        {!sessionToken ? (
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
