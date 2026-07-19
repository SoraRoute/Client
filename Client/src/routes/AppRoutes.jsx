import { Routes, Route } from "react-router-dom";
import Login from "../pages/customer/Login";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;