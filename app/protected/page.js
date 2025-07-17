'use client'

import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Protected() {
  const [apiKey, setApiKey] = useState("");
  const [toast, setToast] = useState({ message: "", color: "" });
  const [loading, setLoading] = useState(false);

  const validateKey = async (key) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('value', key)
      .single();
    if (data && !error) {
      setToast({ message: "Valid api key, /protected can be accessed", color: "bg-green-600" });
    } else {
      setToast({ message: "Invalid api key", color: "bg-red-600" });
    }
    setLoading(false);
    setTimeout(() => setToast({ message: "", color: "" }), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey) {
      validateKey(apiKey);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">API Key Validation</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mb-2">
          <input
            type="text"
            placeholder="Enter API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a18cd1] text-gray-900"
            required
          />
          <button type="submit" className="bg-[#7b4397] hover:bg-[#5e3370] text-white rounded px-4 py-2 font-semibold shadow" disabled={loading}>
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>
        <div className="text-gray-700 text-sm mt-2">API Key: <span className="font-mono">{apiKey}</span></div>
      </div>
      {toast.message && (
        <div className={`fixed top-8 right-8 px-6 py-3 rounded shadow-lg text-white font-semibold z-50 ${toast.color}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
} 