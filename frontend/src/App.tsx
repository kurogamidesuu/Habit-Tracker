import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import HomePage from "./components/HomePage"
import ProtectedRoute from "./components/ProtectedRoute"
import SignupPage from "./components/SignupPage"
import Navbar from "./components/Navbar"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
            <Navbar />
          </ProtectedRoute>
        } />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App