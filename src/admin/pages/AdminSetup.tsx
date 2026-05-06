import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { seedDatabase } from '../../lib/productService';
import { products as staticProducts } from '../../data/products';
import {
  Database, CheckCircle2, XCircle, Loader2,
  Copy, ExternalLink, ChevronDown, ChevronUp, Zap
} from 'lucide-react';

const SQL_SETUP = `-- Run this in your Supabase SQL Editor
-- Go to: Project Dashboard → SQL Editor → New Query

-- 1. Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  category TEXT NOT NULL DEFAULT 'Shirts',
  image TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  rating NUMERIC NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'In Stock',
  specs JSONB NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access (for the storefront)
CREATE POLICY "Allow public read" ON products
  FOR SELECT USING (true);

-- 4. Allow all operations for authenticated users (for CMS)
CREATE POLICY "Allow all for authenticated" ON products
  FOR ALL TO authenticated USING (true);

-- 5. Also allow anon to insert/update/delete
--    (only needed if you're using anon key for admin - simpler for now)
CREATE POLICY "Allow anon write" ON products
  FOR ALL TO anon USING (true) WITH CHECK (true);
`;

const STORAGE_SETUP = `-- Run this in Supabase SQL Editor to create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to storage bucket
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE TO anon USING (bucket_id = 'product-images');
`;

export default function AdminSetup() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [seedError, setSeedError] = useState('');
  const [copiedSql, setCopiedSql] = useState<string | null>(null);
  const [sqlOpen, setSqlOpen] = useState(true);
  const [storageOpen, setStorageOpen] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setTestResult('idle');
    try {
      const { data, error } = await supabase.from('products').select('count').limit(1);
      if (error) throw error;
      setTestResult('ok');
      setTestMessage('Connection successful! Database is ready.');
    } catch (e: any) {
      setTestResult('fail');
      setTestMessage(e.message || 'Connection failed. Check your Supabase credentials.');
    } finally {
      setTesting(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedError('');
    try {
      await seedDatabase(staticProducts);
      setSeedDone(true);
    } catch (e: any) {
      setSeedError(e.message);
    } finally {
      setSeeding(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSql(label);
    setTimeout(() => setCopiedSql(null), 2000);
  };

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'Not configured';
  const hasCredentials = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Database Setup</h1>
        <p className="text-white/40 text-sm mt-1">Configure Supabase to power your CMS</p>
      </div>

      {/* Step 1: Credentials */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${hasCredentials ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>1</div>
          <div>
            <h2 className="text-white font-semibold">Configure Environment Variables</h2>
            <p className="text-white/40 text-xs mt-0.5">Add your Supabase credentials to <code className="text-violet-400">.env</code></p>
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-4 font-mono text-sm space-y-1">
          <p className="text-white/40"># Add to your .env file:</p>
          <p className="text-emerald-400">VITE_SUPABASE_URL=https://your-project.supabase.co</p>
          <p className="text-emerald-400">VITE_SUPABASE_ANON_KEY=your-anon-key</p>
          <p className="text-violet-400">VITE_ADMIN_PASSWORD=your-secure-password</p>
        </div>

        <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${hasCredentials ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
          {hasCredentials ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span>
            {hasCredentials
              ? `Credentials loaded. URL: ${supabaseUrl}`
              : 'No Supabase credentials found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
            }
          </span>
        </div>

        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Open Supabase Dashboard to get credentials
        </a>
      </div>

      {/* Step 2: SQL Setup */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <button
          onClick={() => setSqlOpen(!sqlOpen)}
          className="w-full flex items-center gap-3 p-6 hover:bg-white/3 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm font-bold">2</div>
          <div className="text-left flex-1">
            <h2 className="text-white font-semibold">Create Database Tables</h2>
            <p className="text-white/40 text-xs mt-0.5">Run this SQL in Supabase SQL Editor</p>
          </div>
          {sqlOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </button>

        {sqlOpen && (
          <div className="px-6 pb-6 space-y-3">
            <div className="relative">
              <pre className="bg-black/40 rounded-xl p-4 text-[11px] text-green-300/80 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {SQL_SETUP}
              </pre>
              <button
                onClick={() => copyToClipboard(SQL_SETUP, 'sql')}
                className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/60 text-xs px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Copy className="w-3 h-3" />
                {copiedSql === 'sql' ? 'Copied!' : 'Copy SQL'}
              </button>
            </div>
            <a
              href={`${supabaseUrl}/project/_/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-2 rounded-xl transition-all"
            >
              <ExternalLink className="w-3 h-3" />
              Open SQL Editor
            </a>
          </div>
        )}
      </div>

      {/* Step 3: Storage */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <button
          onClick={() => setStorageOpen(!storageOpen)}
          className="w-full flex items-center gap-3 p-6 hover:bg-white/3 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">3</div>
          <div className="text-left flex-1">
            <h2 className="text-white font-semibold">Create Storage Bucket for Images</h2>
            <p className="text-white/40 text-xs mt-0.5">Required for direct image uploads from CMS</p>
          </div>
          {storageOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </button>

        {storageOpen && (
          <div className="px-6 pb-6 space-y-3">
            <p className="text-white/50 text-sm">Or manually: Supabase Dashboard → Storage → New bucket → Name: <code className="text-violet-400">product-images</code> → Make public ✓</p>
            <div className="relative">
              <pre className="bg-black/40 rounded-xl p-4 text-[11px] text-green-300/80 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {STORAGE_SETUP}
              </pre>
              <button
                onClick={() => copyToClipboard(STORAGE_SETUP, 'storage')}
                className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/60 text-xs px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Copy className="w-3 h-3" />
                {copiedSql === 'storage' ? 'Copied!' : 'Copy SQL'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 4: Test Connection */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold">4</div>
          <div>
            <h2 className="text-white font-semibold">Test Connection</h2>
            <p className="text-white/40 text-xs">Verify everything is working</p>
          </div>
        </div>

        <button
          onClick={testConnection}
          disabled={testing}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
        >
          {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          {testing ? 'Testing...' : 'Test Connection'}
        </button>

        {testResult !== 'idle' && (
          <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${
            testResult === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {testResult === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{testMessage}</span>
          </div>
        )}
      </div>

      {/* Step 5: Seed */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-bold">5</div>
          <div>
            <h2 className="text-white font-semibold">Seed Sample Products</h2>
            <p className="text-white/40 text-xs">Import the {staticProducts.length} existing products into Supabase</p>
          </div>
        </div>

        <button
          onClick={handleSeed}
          disabled={seeding || seedDone}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
        >
          {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {seeding ? 'Seeding...' : seedDone ? '✓ Seeded!' : 'Seed Database'}
        </button>

        {seedError && <p className="text-red-400 text-sm">{seedError}</p>}
        {seedDone && <p className="text-emerald-400 text-sm">✓ {staticProducts.length} products imported to Supabase!</p>}
      </div>
    </div>
  );
}
