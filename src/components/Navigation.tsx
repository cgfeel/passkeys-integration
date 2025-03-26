import { FC } from "react";
import { NavLink } from "react-router";
import { useLocation } from "react-router-dom";

const Navigation: FC = () => {
    const { pathname } = useLocation();
    return (
        <div className="border-b-1 flex gap-2 p-2">
            <NavLink
                to="/"
                className={
                    pathname === "/" ? "text-gray-950" : "text-blue-500"
                }>
                add device
            </NavLink>
            <span>|</span>
            <NavLink
                to="/authentication"
                className={
                    pathname === "/authentication"
                        ? "text-gray-950"
                        : "text-blue-500"
                }>
                authentication
            </NavLink>
            <span>|</span>
            <NavLink
                to="/records"
                className={
                    pathname === "/records" ? "text-gray-950" : "text-blue-500"
                }>
                records
            </NavLink>
        </div>
    );
};

export default Navigation;
