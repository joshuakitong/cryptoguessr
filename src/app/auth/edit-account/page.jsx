"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { doc, getDoc, getDocs, query, collection, where, updateDoc } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebaseClient";
import {
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { Eye, EyeOff, Loader, Edit } from "lucide-react";

export default function EditAccountPage() {
  const { user } = useUser();
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirestoreUser(data);
          setDisplayName(data.displayName);
        }
      }
    };
    fetchUser();
  }, [user]);

  const checkDisplayNameUnique = async (name) => {
    const q = query(collection(db, "users"), where("displayName", "==", name));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  };

  const handleDisplayNameUpdate = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    if (!displayName.trim()) return setError("Display name cannot be empty.");
    if (displayName === firestoreUser.displayName) {
      setEditingName(false);
      return;
    }

    const isUnique = await checkDisplayNameUnique(displayName);
    if (!isUnique) {
      setLoading(false);
      setError("Display name already taken.");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      await updateProfile(currentUser, { displayName });
      await updateDoc(doc(db, "users", currentUser.uid), { displayName });
      setFirestoreUser((prev) => ({ ...prev, displayName }));
      currentUser.displayName = displayName;
      setMessage("Display name updated.");
      setEditingName(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update display name.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      setMessage("Password updated successfully.");
      setEditingPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Incorrect old password or password update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !firestoreUser) {
    return (
      <div className="flex justify-center items-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)]">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center pb-[5.75rem] min-h-[calc(100vh-5.75rem)] px-4">
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <div>
          <label className="font-semibold">Email</label>
          <div>{user.email}</div>
        </div>

        <div>
          <label className="font-semibold">Display Name</label>
          {editingName ? (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                className="p-2 border rounded w-full"
                value={displayName}
                onChange={(e) => {setDisplayName(e.target.value); setError("");}}
              />
              <button
                className={`px-4 py-2 rounded text-white transition ${
                  displayName !== firestoreUser.displayName && !loading
                    ? "bg-[#f7931a] hover:bg-[#e98209] cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={handleDisplayNameUpdate}
                disabled={loading || displayName === firestoreUser.displayName}
              >
                {loading ? <Loader size={16} className="animate-spin" /> : "Save"}
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center p-2 border rounded rounded mt-1">
              <span>{firestoreUser.displayName}</span>
              <button
                className="text-gray-600 font-semibold hover:underline"
                onClick={() => setEditingName(true)}
              >
                <Edit size={16} className="text-[#f7931a] hover:text-[#e98209] cursor-pointer" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="font-semibold">Password</label>
          {editingPassword ? (
            <div className="space-y-2 mt-1">
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Old password"
                  className="p-2 pr-10 border rounded w-full"
                  value={oldPassword}
                  onChange={(e) => {setOldPassword(e.target.value); setError("");}}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 cursor-pointer"
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New password"
                  className="p-2 pr-10 border rounded w-full"
                  value={newPassword}
                  onChange={(e) => {setNewPassword(e.target.value); setError("");}}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="p-2 pr-10 border rounded w-full"
                  value={confirmPassword}
                  onChange={(e) => {setConfirmPassword(e.target.value); setError("");}}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                onClick={handlePasswordUpdate}
                disabled={loading}
                className={`w-full bg-[#f7931a] text-white py-2 rounded flex items-center justify-center transition cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e98209]"
                }`}
              >
                {loading ? <Loader className="animate-spin" size={20} /> : "Save Password"}
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center p-2 border rounded rounded mt-1">
              <span>********</span>
              <button
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => setEditingPassword(true)}
              >
                <Edit size={16} className="text-[#f7931a] hover:text-[#e98209] cursor-pointer" />
              </button>
            </div>
          )}
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {message && <div className="text-green-600 text-sm text-center">{message}</div>}
      </div>
    </div>
  );
}
