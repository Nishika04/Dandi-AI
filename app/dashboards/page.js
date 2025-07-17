"use client";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";

// Placeholder icons as SVG components
const EyeIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/></svg>
);
const CopyIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/></svg>
);
const EditIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"/></svg>
);
const DeleteIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
const EyeClosedIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-10-7 0-1.61.62-3.16 1.76-4.47M6.1 6.1A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 10 7-.27 1.36-.98 2.63-2.03 3.76M1 1l22 22"/><circle cx="12" cy="12" r="3"/></svg>
);

function maskKey(key) {
  if (!key) return "";
  return key.slice(0, 4) + "-" + "*".repeat(16);
}

export default function Dashboards() {
  const [apiKeys, setApiKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showKey, setShowKey] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [editName, setEditName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("bg-green-600");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch API keys from Supabase on mount
  useEffect(() => {
    async function fetchKeys() {
      setLoading(true);
      setError("");
      let { data, error } = await supabase.from('api_keys').select('*').order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setApiKeys(data);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  // Create API key in Supabase
  async function handleCreate() {
    if (!newKeyName) return;
    setLoading(true);
    setError("");
    const generatedKey = "dandi-" + Math.random().toString(36).slice(2, 18);
    const { data, error } = await supabase
      .from('api_keys')
      .insert([{ name: newKeyName, value: generatedKey, usage: 0 }])
      .select();
    if (error) {
      setError(error.message);
    } else {
      setApiKeys([...(data || []), ...apiKeys]);
      setShowModal(false);
      setNewKeyName("");
      setToastMessage("API key created!");
      setToastColor("bg-blue-600");
      setTimeout(() => setToastMessage(""), 1500);
    }
    setLoading(false);
  }

  // Delete API key in Supabase
  async function handleDelete(id) {
    setLoading(true);
    setError("");
    const { error } = await supabase.from('api_keys').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setApiKeys(apiKeys.filter((key) => key.id !== id));
      setToastMessage("API key deleted!");
      setToastColor("bg-red-600");
      setTimeout(() => setToastMessage(""), 1500);
    }
    setLoading(false);
  }

  // Edit handler
  async function handleEdit() {
    if (!editKey || !editName) return;
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from('api_keys')
      .update({ name: editName })
      .eq('id', editKey.id)
      .select();
    if (error) {
      setError(error.message);
    } else {
      setApiKeys(apiKeys.map(k => k.id === editKey.id ? { ...k, name: editName } : k));
      setEditModal(false);
      setEditKey(null);
      setEditName("");
      setToastMessage("API key updated!");
      setToastColor("bg-yellow-500");
      setTimeout(() => setToastMessage(""), 1500);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      {sidebarOpen && <Sidebar active="Overview" />}
      <main className="flex-1 p-0 sm:p-8 relative">
        <button
          className={`fixed top-6 transition-all z-50
    ${sidebarOpen ? 'left-64' : 'left-4'}
    bg-purple-600 text-white border-2 border-white shadow-lg w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-700 focus:outline-none`}
          style={{ boxShadow: '0 4px 16px rgba(80,0,120,0.10)' }}
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {sidebarOpen ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
        {/* Plan Card */}
        <div className="rounded-2xl bg-gradient-to-r from-[#a18cd1] to-[#fbc2eb] p-6 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-md">
          <div>
            <div className="uppercase text-xs font-semibold text-white/80 mb-1">Current Plan</div>
            <div className="text-2xl font-bold text-white mb-2">Researcher</div>
            <div className="text-white/90 text-sm mb-1">API Limit</div>
            <div className="w-48 h-2 bg-white/30 rounded-full overflow-hidden mb-1">
              <div className="bg-white h-2 rounded-full" style={{ width: '2.4%' }}></div>
            </div>
            <div className="text-white/80 text-xs">24 / 1,000 Requests</div>
          </div>
          <button className="mt-4 sm:mt-0 px-4 py-2 bg-white/80 text-[#7b4397] font-semibold rounded-lg shadow hover:bg-white">Manage Plan</button>
        </div>

        {/* API Keys Card */}
        <div className="bg-white rounded-2xl shadow p-6 text-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-lg font-bold text-gray-900">API Keys</div>
              <div className="text-gray-700 text-sm">The key is used to authenticate your requests to the Research API. To learn more, see the <a href="#" className="underline">documentation</a> page.</div>
            </div>
            <button
              className="bg-[#7b4397] hover:bg-[#5e3370] text-white rounded-full w-9 h-9 flex items-center justify-center text-2xl shadow"
              onClick={() => setShowModal(true)}
              title="Create API Key"
            >
              +
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-900">
              <thead>
                <tr className="text-left text-gray-700 border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Usage</th>
                  <th className="py-2">Key</th>
                  <th className="py-2">Options</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 font-medium">{key.name}</td>
                    <td className="py-2">{key.usage}</td>
                    <td className="py-2 font-mono">{showKey[key.id] ? key.value : maskKey(key.value)}</td>
                    <td className="py-2">
                      <div className="flex gap-3 items-center">
                        <button
                          className="hover:text-[#7b4397]"
                          title={showKey[key.id] ? "Hide" : "Show"}
                          onClick={() => setShowKey((prev) => ({ ...prev, [key.id]: !prev[key.id] }))}
                        >
                          {showKey[key.id] ? <EyeClosedIcon /> : <EyeIcon />}
                        </button>
                        <button
                          className={`hover:text-[#7b4397] ${copiedKeyId === key.id ? 'text-green-600' : ''}`}
                          title={copiedKeyId === key.id ? 'Copied!' : 'Copy'}
                          onClick={async () => {
                            await navigator.clipboard.writeText(key.value);
                            setCopiedKeyId(key.id);
                            setToastMessage("API key copied to clipboard!");
                            setToastColor("bg-green-600");
                            setTimeout(() => {
                              setCopiedKeyId(null);
                              setToastMessage("");
                            }, 1500);
                          }}
                        >
                          <CopyIcon />
                        </button>
                        <button
                          className="hover:text-[#7b4397]"
                          title="Edit"
                          onClick={() => {
                            setEditKey(key);
                            setEditName(key.name);
                            setEditModal(true);
                          }}
                        >
                          <EditIcon />
                        </button>
                        <button className="hover:text-red-500" title="Delete" onClick={() => handleDelete(key.id)}><DeleteIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for creating new API key */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative flex flex-col items-stretch text-gray-900">
              <button className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-2 text-center">Create a new API key</h2>
              <div className="text-gray-700 text-center mb-6">Enter a name and limit for the new API key.</div>
              <label className="block text-sm font-medium mb-1 text-gray-900" htmlFor="keyName">Key Name <span className="text-gray-500 font-normal">— A unique name to identify this key</span></label>
              <input
                id="keyName"
                className="border px-3 py-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#7b4397] text-gray-900 placeholder-gray-400"
                placeholder="Key Name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <div className="flex items-center mb-2">
                <input
                  id="limitUsage"
                  type="checkbox"
                  checked={false} // Removed usage limit logic
                  onChange={() => {}} // Removed usage limit logic
                  className="mr-2 accent-[#7b4397]"
                />
                <label htmlFor="limitUsage" className="text-sm text-gray-900">Limit monthly usage*</label>
              </div>
              <input
                type="number"
                className="border px-3 py-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-[#7b4397] text-gray-900 placeholder-gray-400"
                placeholder="1000"
                value={""} // Removed usage limit input
                onChange={() => {}} // Removed usage limit input
                disabled={true} // Removed usage limit input
              />
              <div className="text-xs text-gray-500 mb-6">* If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.</div>
              <div className="flex gap-3">
                <button
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2 rounded font-semibold w-full"
                  onClick={handleCreate}
                >
                  Create
                </button>
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded font-semibold w-full"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {editModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative flex flex-col items-stretch text-gray-900">
              <button className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setEditModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-2 text-center">Edit API Key</h2>
              <label className="block text-sm font-medium mb-1 text-gray-900" htmlFor="editKeyName">
                Key Name
              </label>
              <input
                id="editKeyName"
                className="border px-3 py-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#7b4397] text-gray-900 placeholder-gray-400"
                placeholder="Key Name"
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2 rounded font-semibold w-full"
                  onClick={handleEdit}
                >
                  Save
                </button>
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded font-semibold w-full"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {toastMessage && (
          <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 ${toastColor} text-white px-4 py-2 rounded shadow z-50 transition-opacity`}>
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  );
} 