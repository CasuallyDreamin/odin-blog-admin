'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

function getMimeTypeFromUrl(url: string) {
  const extension = url.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    default:
      return 'application/octet-stream';
  }
}

export default function UploadMediaPage() {
  const [fileUrl, setFileUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpload = async () => {
    if (!fileUrl) {
      setError('Please provide a file URL.');
      return;
    }

    const mimeType = getMimeTypeFromUrl(fileUrl);

    setLoading(true);
    setError('');

    try {
      await api.post('/media', {
        filePath: fileUrl,
        mimeType,
        altText: altText || fileUrl.split('/').pop(),
      });

      router.push('/media');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Failed to upload media.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4">Upload Media</h1>

      <div className="mb-4">
        <label className="block text-sm mb-1">File URL</label>
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="w-full px-3 py-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Alt Text / Display Name</label>
        <input
          type="text"
          placeholder="Optional"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="w-full px-3 py-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
