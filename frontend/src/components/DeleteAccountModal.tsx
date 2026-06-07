import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type Dispatch } from "react";
import { toast } from "react-toastify";
import { deleteAccount } from "../api/user";
import { useAuth } from "../hooks/useAuth";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeleteAccountModal = ({ setShowDeleteAccountModal }: {
  setShowDeleteAccountModal: Dispatch<React.SetStateAction<boolean>>
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [confirmInput, setConfirmInput] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  
  const { accessToken, setAccessToken } = useAuth();
  
  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteAccount(confirmInput, accessToken, setAccessToken),
    onSuccess: () => {
      toast.success("Account Deleted successfully!");
      setShowDeleteAccountModal(false);
      queryClient.clear();
      localStorage.removeItem('tanstack-query-["user"]');
      localStorage.removeItem('tanstack-query-["habits"]');
      setAccessToken(null);
      navigate('/login');
    },
    onError: () => {
      setShowErrorMessage(true);
    }
  });

  return (
    <div className="absolute inset-0 z-50 bg-sky-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-sky-900 border border-sky-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-black/50 flex flex-col">
        <h3 className="text-lg font-bold text-red-500 mb-4">DELETE ACCOUNT</h3>
        <div className="space-y-3 mb-6">
          <label htmlFor="confirm-delete">Are you sure you want to delete? <br /> Type <span className="font-mono bg-sky-100/30 px-1 rounded-sm">CONFIRM</span> to proceed:</label>
          <input
            id="confirm-delete"
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="CONFIRM"
            className="w-full bg-sky-950/50 border border-sky-800/50 text-sky-100 rounded-xl px-4 py-3 mt-5 focus:outline-none focus:border-sky-500/50 placeholder-sky-600/50 transition-colors"
          />
          {showErrorMessage && (
            <h3 className="text-red-500 text-xs font-bold ">Please type CONFIRM to delete your account</h3>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowDeleteAccountModal(false);
            }}
            className="flex-1 h-11 border border-sky-700/50 text-sky-300 font-medium rounded-xl hover:bg-sky-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteAccountMutation.mutate()}
            disabled={deleteAccountMutation.isPending || !confirmInput}
            className="flex-1 h-11 bg-red-700/80 hover:bg-red-600/80 text-sky-50 font-medium rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {deleteAccountMutation.isPending ? <FaSpinner className="animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountModal