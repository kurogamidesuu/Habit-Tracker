import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import HomePage from "./components/HomePage"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import SignupPage from "./components/SignupPage"

const App = () => {
  return (
    <BrowserRouter>
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App