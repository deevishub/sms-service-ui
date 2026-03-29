"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    companyName: "My Business",
    email: "contact@mybusiness.com",
    phone: "+91 9876543210",
    entityId: "PE1234567890",
    website: "https://mybusiness.com",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile:", profile);
    alert("Profile saved successfully!");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Account Settings
      </h2>

      {/* Profile Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
          Company Information
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              DLT Entity ID (PE ID)
            </label>
            <input
              type="text"
              name="entityId"
              value={profile.entityId}
              onChange={handleChange}
              placeholder="PE1234567890"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Obtained from DLT platform (Jio TrueConnect, Airtel IQ, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={profile.website}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-red-900 dark:text-red-100 mb-4">
          Deleting your account will permanently remove all data. This action
          cannot be undone.
        </p>
        <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">
          Delete Account
        </button>
      </div>
    </div>
  );
}
