import { useMutation } from "@tanstack/react-query";
import { useState, type Dispatch } from "react";
import { changePassword } from "../api/user";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const PasswordModal = ({ setShowPasswordModal, hasPassword }: {
  setShowPasswordModal: Dispatch<React.SetStateAction<boolean>>
  hasPassword: boolean,
}) => {
  const { accessToken, setAccessToken } = useAuth();

  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const passwordMutation = useMutation({
    mutationFn: () => changePassword(currentPasswordInput, newPasswordInput, accessToken, setAccessToken),
    onSuccess: () => {
      toast.success(hasPassword ? "Password updated successfully!" : "Password created successfully!");
      setShowPasswordModal(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update password.");
    }
  });

  return (
    <div className="absolute inset-0 z-50 bg-sky-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-sky-900 border border-sky-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-black/50 flex flex-col">
        
        <h3 className="text-lg font-bold text-sky-50 mb-2">
          {hasPassword ? "Change Password" : "Create Password"}
        </h3>
        
        {!hasPassword && (
          <p className="text-sm text-sky-300 mb-4">
            You are currently signed in with Google. Set a password below to also enable email login.
          </p>
        )}

        <div className="space-y-3 mb-6 mt-2">
          {hasPassword && (
            <input
              type="password"
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
              placeholder="Current password"
              className="w-full bg-sky-950/50 border border-sky-800/50 text-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500/50 placeholder-sky-600 transition-colors"
            />
          )}
          
          <input
            type="password"
            value={newPasswordInput}
            onChange={(e) => setNewPasswordInput(e.target.value)}
            placeholder="New password"
            className="w-full bg-sky-950/50 border border-sky-800/50 text-sky-100 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500/50 placeholder-sky-600 transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPasswordModal(false)}
            className="flex-1 h-11 border border-sky-700/50 text-sky-300 font-medium rounded-xl hover:bg-sky-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => passwordMutation.mutate()}
            disabled={
              passwordMutation.isPending || 
              (hasPassword && !currentPasswordInput) || 
              !newPasswordInput
            }
            className="flex-1 h-11 bg-sky-700 hover:bg-sky-600 text-sky-50 font-medium rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {passwordMutation.isPending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              hasPassword ? "Update" : "Create"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PasswordModal