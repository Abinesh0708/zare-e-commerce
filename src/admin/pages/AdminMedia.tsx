import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadProductImage, deleteProductImage } from '../../lib/productService';
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon, Search } from 'lucide-react';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
}

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('product-images').list('products', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;

      const enriched = (data || []).map(f => ({
        name: f.name,
        url: supabase.storage.from('product-images').getPublicUrl(`products/${f.name}`).data.publicUrl,
        size: f.metadata?.size || 0,
        created_at: f.created_at || '',
      }));
      setFiles(enriched);
    } catch (e: any) {
      setError(e.message);
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

  const handleDelete = async (url: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await supabase.storage.from('product-images').remove([`products/${name}`]);
      setFiles(prev => prev.filter(f => f.name !== name));
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
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-white/40 text-sm">{files.length} files in Supabase Storage</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleUpload(e.target.files)}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search files..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
        />
      </div>

      {loading ? (
        <div className="py-16 text-center text-white/30">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-violet-400" />
          Loading media...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-white/30">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No images found</p>
          <p className="text-sm mt-1">Upload images to use in your products</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map(file => (
            <div
              key={file.name}
              className="group relative bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:border-violet-500/30 transition-all"
            >
              <div className="aspect-square">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-white/60 text-[10px] truncate">{file.name}</p>
                {file.size > 0 && (
                  <p className="text-white/30 text-[10px]">{(file.size / 1024).toFixed(0)} KB</p>
                )}
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(file.url)}
                  className="p-2 bg-white/10 hover:bg-violet-600 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  {copiedUrl === file.url ? (
                    <span className="text-emerald-400 text-xs font-medium">✓</span>
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(file.url, file.name)}
                  className="p-2 bg-white/10 hover:bg-red-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
