import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Explore from '../Explore/Explore';

const Navbar = () => {

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate()
    const toggleUserMenu = () => {
      setIsUserMenuOpen(!isUserMenuOpen);
    };
    const storedToken = localStorage.getItem("token");
    
    let Links = [
    { name: "EXPLORE", link: "/" },
    ];
    const handleLogout = () => {
      localStorage.removeItem("token");
      setIsUserMenuOpen(false);
      navigate("/");
    };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="w-full flex flex-wrap mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              GalliO
            </span>
          </a>
          <div
            className="items-center justify-end hidden w-full md:flex md:w-auto ml-auto"
            id="navbar-user"
          >
            <a
              href="/"
              className="text-white duration-500 hover:text-orange-400 my-7 font-semibold md:my-0 md:ml-8"
            >
              EXPLORE
            </a>
          </div>
          {storedToken ? (
            <div className="flex items-center ml-20 mr-10 space-x-3 md:space-x-0 flex-col">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded={isUserMenuOpen}
                onClick={toggleUserMenu}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  alt="user photo"
                />
              </button>
              {isUserMenuOpen && (
                <div className="z-50 absolute mt-12 mr-52 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link
                        to="/profile"
                        onClick={toggleUserMenu}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/upload"
                        onClick={toggleUserMenu}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Upload Photo
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              <button
                data-collapse-toggle="navbar-user"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-user"
                aria-expanded={isUserMenuOpen}
                onClick={toggleUserMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn rounded bg-white px-3 py-1 font-semibold text-black duration-500 hover:bg-orange-400 md:static md:ml-20 md:mr-10"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar