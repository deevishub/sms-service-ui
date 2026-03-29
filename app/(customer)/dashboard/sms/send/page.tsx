"use client";

import { useState } from "react";

export default function SendSMS() {
  const [formData, setFormData] = useState({
    recipient: "",
    message: "",
    senderId: "",
    templateId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending SMS:", formData);
    alert("SMS sent successfully!");
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
        Send SMS
      </h2>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Recipient Phone Number
            </label>
            <input
              type="tel"
              name="recipient"
              placeholder="+91 9876543210"
              value={formData.recipient}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Enter number with country code (e.g., +91)
            </p>
          </div>

          {/* Sender ID */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Sender ID
            </label>
            <select
              name="senderId"
              value={formData.senderId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Sender ID...</option>
              <option value="TD-MYBANK">TD-MYBANK (Transactional)</option>
              <option value="TP-SHOP">TP-SHOP (Promotional)</option>
            </select>
          </div>

          {/* Template */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Template (DLT)
            </label>
            <select
              name="templateId"
              value={formData.templateId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Template...</option>
              <option value="temp_001">OTP Template</option>
              <option value="temp_002">Order Confirmation</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Your OTP is 123456. Valid for 5 minutes."
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              maxLength={160}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {160 - formData.message.length} characters remaining
            </p>
          </div>

          {/* Cost */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-medium">Estimated cost:</span> ₹0.18 (1 SMS
              segment)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Send SMS
            </button>
            <button
              type="button"
              className="px-6 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
