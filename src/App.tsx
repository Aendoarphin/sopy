import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Root from "./components/Root";
import { BrowserRouter, Routes, Route } from "react-router";

// React routing occurs here
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );


}

export default App;
