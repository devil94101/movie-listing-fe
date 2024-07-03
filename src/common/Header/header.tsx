import React, { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { IoLogoIonic } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { rootSlice } from "../../redux/slices/root.slice";

const Nav = ({ routes }: { routes: { name: string; link: string }[] }) => {
  let [open, setOpen] = useState(false);
  const { isLogin } = useAppSelector((state) => state.rootState);
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(rootSlice.actions.logout());
  };
  return (
    <div className="shadow-md w-full fixed top-0 left-0 z-50">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
        <div
          className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] 
      text-gray-800"
        >
          <Link to="/" className="flex">
            <span className="text-3xl text-indigo-600 mr-1 ">
              <IoLogoIonic />
            </span>
            Movies
          </Link>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          {open ? <IoClose /> : <IoMdMenu />}
        </div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-16 " : "top-[-490px]"
          }`}
        >
          {routes.map((link) => (
            <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
              <Link
                to={link.link}
                className="text-gray-800 hover:text-gray-400 duration-500"
              >
                {link.name}
              </Link>
            </li>
          ))}
          {!isLogin ? (
            <li className="md:ml-8 text-xl md:my-0 my-7">
              <Link
                to={"/login"}
                className="text-gray-800 hover:text-gray-400 duration-500"
              >
                LOGIN
              </Link>
            </li>
          ) : (
            <li className="md:ml-8 text-xl md:my-0 my-7">
              <div
                className="text-gray-800 hover:text-gray-400 duration-500 cursor-pointer"
                onClick={logout}
              >
                LOGOUT
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Nav;
