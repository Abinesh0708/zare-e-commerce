import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { seedDatabase, clearDatabase } from '../../lib/productService';
import { products as staticProducts } from '../../data/products';
import {
  Database, CheckCircle2, XCircle, Loader2,
  ExternalLink, Zap, Trash2, Copy, ChevronDown, ChevronUp,
} from 'lucide-react';

export default function AdminSetup() {
  const [testing, setTesting]         = useState(false);
  const [testResult, setTestResult]   = useState<'idle' | 'ok' | 'fail'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [seeding, setSeeding]         = useState(false);
  const [seedDone, setSeedDone]       = useState(false);
  const [seedError, setSeedError]     = useState('');
  const [clearing, setClearing]       = useState(false);
  const [clearDone, setClearDone]     = useState(false);
  const [showRules, setShowRules]     = useState(false);
  const [copied, setCopied]           = useState(false);

  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'not-configured';

  const testConnection = async () => {
    setTesting(true);
    setTestResult('idle');
    try {
      await getDocs(collection(db, 'products'));
      setTestResult('ok');
      setTestMessage('Connection successful! Firestore is ready.');
    } catch (e: any) {
      setTestResult('fail');
      setTestMessage(e.message || 'Connection failed. Check your Firebase config in .env');
    } finally {
      setTesting(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true); setSeedError('');
    try {
      await seedDatabase(staticProducts);
      setSeedDone(true);
    } catch (e: any) {
      setSeedError(e.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('This will delete ALL products from Firestore. Are you sure?')) return;
    setClearing(true); setClearDone(false);
    try {
      await clearDatabase();
      setClearDone(true);
      setSeedDone(false);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setClearing(false);
    }
  };

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if true; // 🔒 Tighten after setup!
    }
  }
}`;

  const copyRules = async () => {
    await navigator.clipboard.writeText(firestoreRules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StepBadge = ({ n, color }: { n: number; color: string }) => (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-sm font-black text-white flex-shrink-0`}>
      {n}
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Firebase Setup</h1>
        <p className="text-slate-400 text-sm mt-1">Configure Firebase Firestore to power your CMS</p>
      </div>

      {/* Current project */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl px-5 py-3 flex items-center justify-between">
        <span className="text-slate-500 text-sm">Active Project</span>
        <span className="font-mono text-violet-700 font-bold text-sm">{projectId}</span>
      </div>

      {/* Step 1 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <StepBadge n={1} color="bg-orange-500" />
          <div>
            <h2 className="text-slate-800 font-bold">Create a Firebase Project</h2>
            <p className="text-slate-400 text-xs mt-0.5">Go to the Firebase Console and create a new project</p>
          </div>
        </div>
        <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-semibold transition-colors">
          <ExternalLink className="w-3 h-3" />
          Open Firebase Console
        </a>
      </div>

      {/* Step 2 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <StepBadge n={2} color="bg-emerald-500" />
          <div>
            <h2 className="text-slate-800 font-bold">Add Environment Variables</h2>
            <p className="text-slate-400 text-xs mt-0.5">Project Settings → Your Apps → Web App → copy firebaseConfig into <code className="text-violet-600">.env</code></p>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs space-y-1">
          <p className="text-slate-500"># .env</p>
          <p className="text-emerald-400">VITE_FIREBASE_API_KEY=AIza...</p>
          <p className="text-emerald-400">VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com</p>
          <p className="text-emerald-400">VITE_FIREBASE_PROJECT_ID=your-project-id</p>
          <p className="text-emerald-400">VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com</p>
          <p className="text-emerald-400">VITE_FIREBASE_MESSAGING_SENDER_ID=123456789</p>
          <p className="text-emerald-400">VITE_FIREBASE_APP_ID=1:123:web:abc</p>
          <p className="text-violet-400 mt-2">VITE_ADMIN_PASSWORD=your-secure-password</p>
        </div>
        <p className="text-slate-400 text-xs">After editing .env, restart the dev server.</p>
      </div>

      {/* Step 3 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <StepBadge n={3} color="bg-blue-500" />
          <div>
            <h2 className="text-slate-800 font-bold">Enable Firestore & Storage</h2>
            <p className="text-slate-400 text-xs mt-0.5">Enable these two services in the Firebase Console</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5 font-bold">→</span>
            <span><strong className="text-slate-800">Firestore Database</strong> — Build → Firestore → Create database → Start in test mode</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5 font-bold">→</span>
            <span><strong className="text-slate-800">Storage</strong> (optional for uploads) — Build → Storage → Get started (requires Blaze plan)</span>
          </li>
        </ul>

        <div>
          <button onClick={() => setShowRules(!showRules)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-xs font-medium transition-colors">
            {showRules ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Firestore Security Rules
          </button>
          {showRules && (
            <div className="mt-3 relative">
              <pre className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                {firestoreRules}
              </pre>
              <button onClick={copyRules}
                className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                title="Copy rules">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white" />}
              </button>
            </div>
          )}
        </div>
        <p className="text-orange-600 text-xs bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
          ⚠️ The rules above allow open read/write during development. Tighten them before going to production.
        </p>
      </div>

      {/* Step 4: Test */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <StepBadge n={4} color="bg-teal-500" />
          <div>
            <h2 className="text-slate-800 font-bold">Test Connection</h2>
            <p className="text-slate-400 text-xs">Verify your Firebase config is working</p>
          </div>
        </div>
        <button onClick={testConnection} disabled={testing}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-teal-500/20">
          {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          {testing ? 'Testing...' : 'Test Firestore Connection'}
        </button>
        {testResult !== 'idle' && (
          <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border font-medium ${
            testResult === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            {testResult === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{testMessage}</span>
          </div>
        )}
      </div>

      {/* Step 5: Seed & Clear */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <StepBadge n={5} color="bg-violet-600" />
          <div>
            <h2 className="text-slate-800 font-bold">Seed / Reset Database</h2>
            <p className="text-slate-400 text-xs">Import the {staticProducts.length} default products or clear all data</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={handleSeed} disabled={seeding || seedDone}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-violet-500/20">
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {seeding ? 'Seeding...' : seedDone ? '✓ Seeded!' : 'Seed Database'}
          </button>
          <button onClick={handleClear} disabled={clearing}
            className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 disabled:opacity-50 text-rose-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
            {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {clearing ? 'Clearing...' : clearDone ? '✓ Cleared!' : 'Clear All Products'}
          </button>
        </div>
        {seedError && <p className="text-rose-600 text-sm">{seedError}</p>}
        {seedDone  && <p className="text-emerald-600 text-sm font-semibold">✓ {staticProducts.length} products imported to Firestore!</p>}
        {clearDone && <p className="text-orange-600 text-sm font-semibold">✓ All products cleared from Firestore.</p>}
      </div>
    </div>
  );
}
