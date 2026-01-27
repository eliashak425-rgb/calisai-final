"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  hasPassword: boolean;
}

export function SettingsClient({ user, hasPassword }: SettingsClientProps) {
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update name");
      }

      setSuccess("Name updated successfully");
      setEditingName(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setSuccess("Password updated successfully");
      setEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-interactive p-6">
      <h2 className="text-lg font-display font-medium text-white mb-4">Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* Name Field */}
        <div className="py-3 border-b border-white/5">
          {editingName ? (
            <form onSubmit={handleUpdateName} className="space-y-3">
              <label className="block text-sm text-slate-500">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-dark"
                placeholder="Your name"
                required
                minLength={2}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingName(false);
                    setName(user.name || "");
                    setError("");
                  }}
                  className="px-4 py-2 border border-white/10 text-white text-sm rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Name</div>
                <div className="text-white">{user.name || "Not set"}</div>
              </div>
              <button 
                onClick={() => setEditingName(true)}
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div>
            <div className="text-sm text-slate-500">Email</div>
            <div className="text-white">{user.email}</div>
          </div>
          <span className="text-xs text-slate-600">Cannot change</span>
        </div>

        {/* Password Field */}
        <div className="py-3">
          {editingPassword ? (
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <label className="block text-sm text-slate-500">Change Password</label>
              {hasPassword ? (
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-dark"
                  placeholder="Current password"
                  required
                />
              ) : (
                <p className="text-sm text-slate-500">
                  You signed in with Google. Set a password to enable email login.
                </p>
              )}
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-dark"
                placeholder="New password"
                required
                minLength={8}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-dark"
                placeholder="Confirm new password"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className="px-4 py-2 border border-white/10 text-white text-sm rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Password</div>
                <div className="text-white">••••••••</div>
              </div>
              <button 
                onClick={() => setEditingPassword(true)}
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

