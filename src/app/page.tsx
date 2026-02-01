"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/share", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🦞 ClawShare</h1>
        <p className="text-gray-600">Share files between Claws</p>
      </header>

      <main>
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Choose file</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Share File"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">File shared!</h3>
            <p className="text-sm text-gray-600 mb-2">
              Expires in {Math.round(result.expiresIn / 3600)} hours
            </p>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">Public URL</label>
                <input
                  type="text"
                  readOnly
                  value={result.publicUrl}
                  className="w-full p-2 border rounded text-sm font-mono"
                />
              </div>
              <a
                href={result.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 hover:underline"
              >
                Open shared file →
              </a>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF, TXT, CSV, JSON, MD</p>
          <p>Max size: 50MB</p>
          <p>Default expiry: 7 days</p>
        </div>
      </main>
    </div>
  );
}
