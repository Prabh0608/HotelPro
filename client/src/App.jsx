import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/common/Login";
import SignUp from "./components/common/SignUp";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminHome from "./components/admin/AdminHome";
import UserHome from "./components/user/UserHome"; // NEW IMPORT
import BookRoom from "./components/user/BookRoom"; // ADD THIS LINE AT THE TOP
import MyBookings from "./components/user/MyBookings"; // ADD THIS LINE AT THE TOP
import Home from "./components/common/Home";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/userhome" element={
          <ProtectedRoute allowedRole="Ordinary">
            <UserHome />
          </ProtectedRoute>
        } />
        <Route path="/book/:roomid" element={
          <ProtectedRoute allowedRole="Ordinary">
            <BookRoom />
          </ProtectedRoute>
        } />
        <Route path="/mybookings" element={
          <ProtectedRoute allowedRole="Ordinary">
            <MyBookings />
          </ProtectedRoute>
        } />
        
        <Route path="/adminhome" element={
          <ProtectedRoute allowedRole="Admin">
            <AdminHome />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;