import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import HomePage from "./components/HomePage"
import ProtectedRoute from "./components/ProtectedRoute"
import SignupPage from "./components/SignupPage"
import MainLayout from "./components/MainLayout"
import HabitsPage from "./components/HabitsPage"
import ProfilePage from "./components/ProfilePage"
import { Bounce, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useInstallPrompt } from "./hooks/useInstallPrompt"
import InstallBanner from "./components/InstallBanner"

const App = () => {
  const { isInstallable, promptInstall } = useInstallPrompt()
  
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

      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        theme="dark"
        transition={Bounce}
        toastClassName="!bg-sky-900/90 !backdrop-blur-md !border !border-sky-700/50 !rounded-xl !shadow-xl !text-sky-50 !font-sans !text-sm"
      />

      <InstallBanner isInstallable={isInstallable} promptInstall={promptInstall} />
    </BrowserRouter>
  )
}

export default App