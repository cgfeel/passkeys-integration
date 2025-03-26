import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./pages/home";
import Navigation from "./components/Navigation";
import Passkey from "./pages/passkey";
import Records from "./pages/records";

const AppRouter: FC = () => (
    <>
        <Navigation />
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/authentication" element={<Passkey />} />
            <Route path="/records" element={<Records />} />
        </Routes>
    </>
);

export default AppRouter;
