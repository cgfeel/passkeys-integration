import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Passkey from "./Passkey";

const AppRouter: FC = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/passkey" element={<Passkey />} />
  </Routes>
);

export default AppRouter;
