import React, { useEffect, useState, useRef } from 'react';
import {
  fetchMediaFiles, deleteMediaFile, uploadProductImage, MediaFile,
} from '../../lib/productService';
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon, Search } from 'lucide-react';

export default function AdminMedia() {
  const [files, setFiles]         = useState<MediaFile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch]       = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError]         = useState('');
  const fileInputRef              = useRef<HTMLInputElement>(null);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const list = await fetchMediaFiles();
      setFiles(list);
    } catch (e: any) {
      setError(
        e.code === 'storage/unknown' || e.message?.includes('storage')
          ? 'Firebase Storage is not enabled. Enable it in the Firebase Console (Blaze plan required) to upload images. You can still paste image URLs directly in the product form.'
          : e.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFiles(); }, []);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
    setUploading(true);
    setError('');
    try {
      for (const file of Array.from(fileList)) {
        await uploadProductImage(file);
      }
      await loadFiles();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (path: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteMediaFile(path);
      setFiles(prev => prev.filter(f => f.path !== path));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 1500);
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Media Library</h1>
          <p className="text-slate-400 text-sm">{files.length} files in Firebase Storage</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-500/20"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => handleUpload(e.target.files)} />
      </div>

      {error && (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search files..."
          className="w-full bg-white border border-slate-200 rounded-xl px-10 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-violet-500" />
          <p className="text-sm">Loading media...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 font-semibold">No images found</p>
          <p className="text-sm mt-1">Upload images to use in your products</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map(file => (
            <div
              key={file.id}
              className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-violet-300 hover:shadow-md transition-all"
            >
              <div className="aspect-square">
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 border-t border-slate-100">
                <p className="text-slate-500 text-[10px] truncate font-medium">{file.name}</p>
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(file.url)}
                  className="p-2 bg-white hover:bg-violet-600 hover:text-white rounded-lg transition-colors shadow"
                  title="Copy URL"
                >
                  {copiedUrl === file.url ? (
                    <span className="text-emerald-600 text-xs font-bold">✓</span>
                  ) : (
                    <Copy className="w-4 h-4 text-slate-700" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(file.path, file.name)}
                  className="p-2 bg-white hover:bg-rose-500 hover:text-white rounded-lg transition-colors shadow"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
