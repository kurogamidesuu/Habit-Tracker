import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type Dispatch } from "react";
import { changeUsername } from "../api/user";
import { useAuth } from "../hooks/useAuth";
import { USER_KEY } from "../hooks/useUser";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const UsernameModal = ({ setShowUsernameModal }: {
  setShowUsernameModal: Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient();
  const { accessToken, setAccessToken } = useAuth();

  const [newUsernameInput, setNewUsernameInput] = useState("");

  const usernameMutation = useMutation({
    mutationFn: (newUsername: string) => changeUsername(newUsername, accessToken, setAccessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEY });
      toast.success("Username updated successfully!");
      setShowUsernameModal(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update username.");
    }
  });

  return (
    <div className="absolute inset-0 z-50 bg-sky-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-sky-900 border border-sky-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-black/50 flex flex-col">
        <h3 className="text-lg font-bold text-sky-50 mb-4">Change Username</h3>
        <input
          type="text"
          value={newUsernameInput}
          onChange={(e) => setNewUsernameInput(e.target.value)}
          placeholder="Enter new username"
          className="w-full bg-sky-950/50 border border-sky-800/50 text-sky-100 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-sky-500/50 placeholder-sky-600 transition-colors"
        />
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowUsernameModal(false);
              setNewUsernameInput("");
            }}
            className="flex-1 h-11 border border-sky-700/50 text-sky-300 font-medium rounded-xl hover:bg-sky-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => usernameMutation.mutate(newUsernameInput)}
            disabled={usernameMutation.isPending || !newUsernameInput.trim()}
            className="flex-1 h-11 bg-sky-700 hover:bg-sky-600 text-sky-50 font-medium rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {usernameMutation.isPending ? <FaSpinner className="animate-spin" /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UsernameModal