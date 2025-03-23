import { FC } from "react";
import { NavLink } from "react-router";

const Navigation: FC = () => (
  <div className="border-b-1 flex gap-2 p-2">
    <NavLink to="/">register</NavLink>
    <span>|</span>
    <NavLink to="/passkey">login</NavLink>
  </div>
);

export default Navigation;
