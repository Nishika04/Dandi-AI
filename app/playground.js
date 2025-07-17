import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Playground() {
  const [apiKey, setApiKey] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Redirect to /protected with apiKey as query param
    router.push(`/protected?apiKey=${encodeURIComponent(apiKey)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Playground</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
} 