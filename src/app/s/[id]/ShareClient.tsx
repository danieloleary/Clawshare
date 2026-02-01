"use client";

import { useState, useEffect } from "react";

interface ShareClientProps {
  shareId: string;
}

export default function ShareClient({ shareId }: ShareClientProps) {
  const [meta, setMeta] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShareInfo();
  }, [shareId]);

  const fetchShareInfo = async () => {
    try {
      const res = await fetch(`/api/download?id=${shareId}${password ? `&password=${password}` : ""}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load share");
        return;
      }

      setMeta(data.meta);
      setDownloadUrl(data.downloadUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error && error.includes("password")) {
    // Password required
    return (
      <div className="min-h-screen p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔒 Password Required</h1>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        <button
          onClick={fetchShareInfo}
          className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
        >
          Unlock
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">❌ Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🦞 ClawShare</h1>
      </header>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">📄 {meta?.name}</h2>
        
        <div className="space-y-2 text-sm text-gray-600 mb-6">
          <p>Size: {meta ? (meta.size / 1024).toFixed(1) : "..."} KB</p>
          <p>Expires: {meta ? new Date(meta.expiresAt).toLocaleString() : "..."}</p>
        </div>

        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 font-semibold"
        >
          ⬇️ Download File
        </button>

        <a
          href="/"
          className="block mt-4 text-center text-blue-600 hover:underline"
        >
          Share your own file →
        </a>
      </div>
    </div>
  );
}
