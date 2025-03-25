import { FC } from "react";
import { NavLink } from "react-router";
import { useLocation } from "react-router-dom";

const Navigation: FC = () => {
    const { pathname } = useLocation();
    return (
        <div className="border-b-1 flex gap-2 p-2">
            <NavLink to="/" className={pathname === "/" ? "text-gray-950" : "text-blue-500"}>
                add device
            </NavLink>
            <span>|</span>
            <NavLink to="/passkey" className={pathname === "/passkey" ? "text-gray-950" : "text-blue-500"}>
                login
            </NavLink>
            <span>|</span>
            <NavLink to="/records" className={pathname === "/records" ? "text-gray-950" : "text-blue-500"}>
                records
            </NavLink>
        </div>
    );
};

export default Navigation;
