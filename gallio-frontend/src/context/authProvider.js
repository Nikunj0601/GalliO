import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import axios from 'axios'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token)
        .then((response) => {
            console.log(response);
          setIsLoggedIn(true);
          setUserId(response.data.id);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoggedIn(false);
          setUserId(null);
        });
    }
  }, []);

  const login = (token, userId) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

async function fetchUserData(token) {
  return await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/verifyToken/${token}`);
}
