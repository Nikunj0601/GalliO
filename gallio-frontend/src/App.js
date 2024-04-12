import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Explore from "./components/Explore/Explore";
import Navbar from "./components/Navbar/Navbar";
import UserExplore from "./components/Explore/UserExplore";
import { AuthProvider } from "./context/authProvider";
import UploadPhoto from "./components/Explore/UploadPhoto";

function App() {
  return (
    <>
      <Router>
        <div>
          <Navbar />
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route exact path="/" element={<Explore />} />
          <Route element={<AuthProvider />}>
            <Route path="/profile" element={<UserExplore />} />
            <Route path="/upload" element={ <UploadPhoto />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
