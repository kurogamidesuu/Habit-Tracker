import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import HomePage from "./components/HomePage"
import ProtectedRoute from "./components/ProtectedRoute"
import SignupPage from "./components/SignupPage"
import MainLayout from "./components/MainLayout"
import HabitsPage from "./components/HabitsPage"
import ProfilePage from "./components/ProfilePage"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App