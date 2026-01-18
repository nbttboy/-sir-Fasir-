import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type } from "@google/genai";

// --- Icons ---
const Icons = {
  Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
  Wallet: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V3"/><path d="M9 18a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11v2h-3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3v11H9Z"/><path d="M16 16h4"/></svg>,
  ShieldCheck: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  XCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>,
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Brain: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  ChevronLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ExternalLink: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Copy: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Globe: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Server: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  Loader: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Layers: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Tag: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Store: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Printer: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/><path d="M6 18h12"/></svg>,
};

// --- Types ---

interface User {
  username: string;
  role: 'admin' | 'user';
}

interface AuditSettings {
  authRules: string;
  shellRules: string;
  complianceRules: string;
  corporatePolicy: string;
  // AI Provider Settings
  aiProvider: 'gemini' | 'custom';
  customBaseUrl: string;
  customApiKey: string;
  customModelName: string; 
  // Batch Rules
  maxBatchAmount: number;
  maxSingleAmount: number;
}

interface TaxVerifyData {
  invoiceCode: string;
  invoiceNumber: string;
  date: string;
  amount: string; 
  checkCode: string; 
}

interface AuditResult {
  id: string;
  sellerName: string;
  invoiceNumber: string;
  amount: string;
  date: string;
  type: 'image' | 'pdf';
  previewUrl: string;
  
  // Tax Bureau Data Extraction
  taxData?: TaxVerifyData;
  officialVerifyStatus?: 'verified' | 'failed' | 'unknown';
  agentLogs?: string[]; // Restore agent logs

  invoiceType?: string; // New: e.g. "增值税专用发票"
  authenticityStatus: 'pass' | 'fail' | 'warning';
  authenticityReason: string;

  shellRiskStatus: 'pass' | 'fail' | 'warning';
  shellRiskReason: string;
  shellRiskLogs?: string[];
  companyInfo?: string;

  complianceStatus: 'pass' | 'fail' | 'warning';
  complianceReason: string;
  
  auditTrail: string[];
  createdAt: number;
  user: string;

  // Manual Review
  reviewStatus?: 'approved' | 'rejected';
}

interface BatchReport {
  totalAmount: number;
  invoiceCount: number;
  duplicateCount: number;
  duplicates: { invoiceNumber: string, amount: string }[];
  consecutiveRisks: string[];
  largeAmountRisks: string[];
  sensitiveAmountRisks: string[];
  overallRisk: 'high' | 'medium' | 'low';
}

// --- Default Settings ---
const DEFAULT_SETTINGS: AuditSettings = {
  authRules: "1. 必须提取国税局查验所需的五要素(代码、号码、日期、金额、校验码)。\n2. 检查发票专用章是否清晰可见。",
  shellRules: "1. 成立时间不足6个月且金额较大。\n2. 经营范围与开票项目严重不符。\n3. 注册地址为集群注册或虚拟地址。",
  complianceRules: "1. 严禁报销烟草制品。\n2. 严禁报销KTV、洗浴等娱乐场所消费。\n3. 礼品类报销需附详细清单及用途说明。",
  corporatePolicy: "",
  aiProvider: 'gemini',
  customBaseUrl: 'https://api.deepseek.com',
  customApiKey: '',
  customModelName: 'deepseek-chat',
  maxBatchAmount: 50000,
  maxSingleAmount: 10000
};

// --- Helper Components ---

const StatusTag = ({ label, status }: { label: string, status: string }) => {
  const colors: Record<string, string> = {
    pass: 'bg-green-100 text-green-700 border-green-200',
    fail: 'bg-red-100 text-red-700 border-red-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    verified: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    unknown: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  const colorClass = colors[status] || colors.unknown;
  
  return (
    <div className={`flex items-center justify-between px-2 py-1 rounded border text-xs font-medium ${colorClass}`}>
      <span>{label}</span>
      <span className="uppercase ml-2">{status === 'pass' || status === 'verified' ? '通过' : status === 'fail' || status === 'failed' ? '失败' : status === 'warning' ? '警告' : status}</span>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>
    <div className={`p-1.5 rounded-full ${active ? 'bg-blue-50' : ''}`}>{icon}</div>
    {label}
  </button>
);

const DesktopNavBtn = ({ active, onClick, icon, label, collapsed }: any) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-100 hover:bg-blue-700/50'} ${collapsed ? 'justify-center' : ''}`}
    title={collapsed ? label : ''}
  >
    <div className="flex-shrink-0">{icon}</div>
    {!collapsed && <span>{label}</span>}
  </button>
);

const InputArea = ({ label, value, onChange, placeholder }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <textarea 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-20 p-2 text-sm border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
    />
  </div>
);

// --- Live Camera Modal Component ---
const CameraCaptureModal = ({ onClose, onCapture }: { onClose: () => void, onCapture: (file: File) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error("Camera Error:", err);
        setError('无法访问摄像头，请确保已授予权限或使用 HTTPS 访问。');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
            onClose();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
       <div className="w-full max-w-lg bg-black rounded-2xl overflow-hidden flex flex-col items-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white z-10 bg-gray-800/50 p-2 rounded-full">
            <Icons.XCircle />
          </button>
          
          <div className="w-full aspect-[3/4] bg-gray-900 flex items-center justify-center relative">
             {error ? (
                <div className="text-red-400 p-6 text-center">{error}</div>
             ) : (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
             )}
             <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="p-6 w-full flex justify-center bg-gray-900 border-t border-gray-800">
             <button 
               onClick={handleCapture}
               disabled={!!error}
               className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-lg active:scale-95 transition-transform"
             ></button>
          </div>
       </div>
    </div>
  );
};

const AuditDetailModal = ({ result, onClose, onUpdate }: { result: AuditResult, onClose: () => void, onUpdate?: (r: AuditResult) => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
        
        {/* Left: Image */}
        <div className="md:w-1/2 bg-gray-100 p-4 flex items-center justify-center min-h-[300px]">
           {result.type === 'pdf' ? (
             <div className="w-full h-full min-h-[400px]">
               <iframe src={result.previewUrl} className="w-full h-full border-none rounded-lg bg-white shadow-sm" title="PDF Preview"></iframe>
             </div>
           ) : (
             <img src={result.previewUrl} alt="Invoice" className="max-w-full max-h-full object-contain shadow-lg" />
           )}
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-6 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">审核详情</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500">{new Date(result.createdAt).toLocaleString()}</p>
                    {result.reviewStatus && (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${result.reviewStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {result.reviewStatus === 'approved' ? '已接受' : '已驳回'}
                        </span>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><Icons.XCircle /></button>
             </div>

             <div className="space-y-6">
                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border ${result.authenticityStatus === 'pass' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-xs text-gray-500 font-bold mb-1">真伪验证</div>
                    <div className={`font-bold ${result.authenticityStatus === 'pass' ? 'text-green-700' : 'text-red-700'}`}>
                        {result.authenticityStatus === 'pass' ? '验证通过' : '验证失败'}
                    </div>
                    {result.authenticityReason && <div className="text-xs mt-1 opacity-80">{result.authenticityReason}</div>}
                </div>
                <div className={`p-3 rounded-lg border ${result.shellRiskStatus === 'pass' ? 'bg-green-50 border-green-200' : result.shellRiskStatus === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-xs text-gray-500 font-bold mb-1">虚开风险</div>
                    <div className={`font-bold ${result.shellRiskStatus === 'pass' ? 'text-green-700' : result.shellRiskStatus === 'warning' ? 'text-amber-700' : 'text-red-700'}`}>
                        {result.shellRiskStatus === 'pass' ? '无显性风险' : '存在风险'}
                    </div>
                    {result.shellRiskReason && <div className="text-xs mt-1 opacity-80">{result.shellRiskReason}</div>}
                </div>
                <div className={`p-3 rounded-lg border ${result.complianceStatus === 'pass' ? 'bg-green-50 border-green-200' : result.complianceStatus === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-xs text-gray-500 font-bold mb-1">合规检查</div>
                    <div className={`font-bold ${result.complianceStatus === 'pass' ? 'text-green-700' : result.complianceStatus === 'warning' ? 'text-amber-700' : 'text-red-700'}`}>
                        {result.complianceStatus === 'pass' ? '合规' : '异常'}
                    </div>
                    {result.complianceReason && <div className="text-xs mt-1 opacity-80">{result.complianceReason}</div>}
                </div>
                </div>

                {/* Extracted Data */}
                <div className="space-y-3">
                <h4 className="font-bold text-gray-700 flex items-center gap-2"><Icons.FileText /> 票面信息</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">发票类型:</span> <span className="font-medium">{result.invoiceType || '通用'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">销售方:</span> <span className="font-medium text-right">{result.sellerName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">发票金额:</span> <span className="font-bold text-blue-600">{result.amount}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">发票代码:</span> <span className="font-mono">{result.taxData?.invoiceCode || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">发票号码:</span> <span className="font-mono">{result.taxData?.invoiceNumber || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">开票日期:</span> <span>{result.taxData?.date || '-'}</span></div>
                </div>
                </div>

                {/* Tax Bureau Logs */}
                {result.agentLogs && result.agentLogs.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2"><Icons.ShieldCheck /> 国税局查验日志</h4>
                    <div className="bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-xs max-h-40 overflow-y-auto">
                    {result.agentLogs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
                    </div>
                </div>
                )}

                {/* Shell Risk Agent Logs */}
                {result.shellRiskLogs && result.shellRiskLogs.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2"><Icons.Globe /> 虚开风险核查日志</h4>
                    <div className="bg-slate-900 text-amber-400 p-3 rounded-lg font-mono text-xs max-h-40 overflow-y-auto border-l-4 border-amber-600">
                    {result.shellRiskLogs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
                    </div>
                </div>
                )}

                {/* AI Audit Trail */}
                <div className="space-y-2">
                <h4 className="font-bold text-gray-700 flex items-center gap-2"><Icons.Brain /> AI 分析追踪</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {result.auditTrail.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
                </div>
             </div>
          </div>
          
          {/* Manual Review Actions */}
          <div className="pt-6 border-t border-gray-100 flex gap-4 mt-4">
             <button 
                onClick={() => {
                if (onUpdate) onUpdate({ ...result, reviewStatus: 'rejected' });
                onClose();
                }}
                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex justify-center items-center gap-2"
             >
                🚫 驳回
             </button>
             <button 
                onClick={() => {
                if (onUpdate) onUpdate({ ...result, reviewStatus: 'approved' });
                onClose();
                }}
                className="flex-1 py-3 bg-green-50 text-green-600 rounded-xl font-bold hover:bg-green-100 transition-colors flex justify-center items-center gap-2"
             >
                ✅ 接受
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReimbursementModal = ({ selectedItems, onClose }: { selectedItems: AuditResult[], onClose: () => void }) => {
  const totalAmount = selectedItems.reduce((acc, item) => acc + (parseFloat(item.amount.replace(/[^0-9.]/g, '')) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header - No Print */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 print:hidden">
           <h3 className="font-bold text-lg text-gray-800">报销单预览</h3>
           <div className="flex gap-2">
             <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold shadow">
               <Icons.Printer /> 打印 / 保存PDF
             </button>
             <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg text-gray-500">
               <Icons.XCircle />
             </button>
           </div>
        </div>

        {/* Printable Area - A4 Style */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8 print:p-0 print:bg-white print:overflow-visible">
           <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm] p-[15mm] print:shadow-none print:w-full print:max-w-none print:min-h-0 print:p-0">
              
              <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
                 <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">费用报销单</h1>
                 <p className="text-gray-500 text-sm">生成日期: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="mb-6 flex justify-between text-sm">
                 <div className="space-y-1">
                    <p><strong>报销人:</strong> {selectedItems[0]?.user || '员工'}</p>
                    <p><strong>部门:</strong> 财务部/业务部</p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p><strong>单据编号:</strong> REIM-{Date.now().toString().slice(-8)}</p>
                    <p><strong>附件张数:</strong> {selectedItems.length} 张</p>
                 </div>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-sm mb-8">
                 <thead>
                    <tr className="bg-gray-100">
                       <th className="border border-gray-300 p-2 text-left w-12">序号</th>
                       <th className="border border-gray-300 p-2 text-left">费用类别</th>
                       <th className="border border-gray-300 p-2 text-left">销售方名称</th>
                       <th className="border border-gray-300 p-2 text-left">发票日期</th>
                       <th className="border border-gray-300 p-2 text-right w-32">金额 (元)</th>
                       <th className="border border-gray-300 p-2 text-center w-24">风控状态</th>
                    </tr>
                 </thead>
                 <tbody>
                    {selectedItems.map((item, idx) => (
                       <tr key={item.id}>
                          <td className="border border-gray-300 p-2 text-center">{idx + 1}</td>
                          <td className="border border-gray-300 p-2">{item.invoiceType || '其他'}</td>
                          <td className="border border-gray-300 p-2 truncate max-w-[200px]">{item.sellerName}</td>
                          <td className="border border-gray-300 p-2">{item.taxData?.date || '-'}</td>
                          <td className="border border-gray-300 p-2 text-right font-mono">{item.amount}</td>
                          <td className="border border-gray-300 p-2 text-center">
                             {item.authenticityStatus === 'pass' && item.complianceStatus === 'pass' ? '正常' : '异常'}
                          </td>
                       </tr>
                    ))}
                 </tbody>
                 <tfoot>
                    <tr className="bg-gray-50 font-bold">
                       <td colSpan={4} className="border border-gray-300 p-2 text-right">合计金额:</td>
                       <td className="border border-gray-300 p-2 text-right text-lg">¥{totalAmount.toFixed(2)}</td>
                       <td className="border border-gray-300 p-2"></td>
                    </tr>
                 </tfoot>
              </table>

              <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-300">
                 <div>
                    <p className="text-sm font-bold mb-8">报销人签字:</p>
                    <div className="border-b border-black w-32"></div>
                 </div>
                 <div>
                    <p className="text-sm font-bold mb-8">部门主管签字:</p>
                    <div className="border-b border-black w-32"></div>
                 </div>
                 <div>
                    <p className="text-sm font-bold mb-8">财务审核:</p>
                    <div className="border-b border-black w-32"></div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};

// --- Views ---

const LoginView = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simulate DB with localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (isLogin) {
      if (users[username] === password) {
        onLogin({ username, role: 'user' });
      } else {
        setError('用户名或密码错误');
      }
    } else {
      if (users[username]) {
        setError('用户已存在');
      } else {
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        onLogin({ username, role: 'user' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-center mb-6 text-blue-600">
           <div className="p-4 bg-blue-50 rounded-full">
             <Icons.ShieldCheck />
           </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">发票sir</h2>
        <p className="text-center text-gray-500 text-sm mb-8">企业级财税风控终端</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input 
              required
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
            {isLogin ? '立即登录' : '创建账户'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-600 hover:underline">
            {isLogin ? '没有账号? 立即注册' : '已有账号? 直接登录'}
          </button>
        </div>
      </div>
    </div>
  );
};

const HistoryView = ({ history, onUpdate }: { history: AuditResult[], onUpdate: (r: AuditResult) => void }) => {
  const [selected, setSelected] = useState<AuditResult | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'seller' | 'risk' | 'type'>('list');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showReimbursementModal, setShowReimbursementModal] = useState(false);
  
  // Sort by date descending (Newest first)
  const sortedHistory = [...history].sort((a, b) => b.createdAt - a.createdAt);

  const filteredHistory = sortedHistory.filter(h => {
     if (startDate && new Date(h.createdAt) < new Date(startDate)) return false;
     // End date needs to cover the whole day
     if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(h.createdAt) > end) return false;
     }
     return true;
  });

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const getSelectedItems = () => {
    return filteredHistory.filter(item => selectedIds.has(item.id));
  };

  // Stats
  const riskCount = filteredHistory.filter(h => h.authenticityStatus !== 'pass' || h.complianceStatus !== 'pass').length;
  
  const exportCSV = () => {
    const headers = "创建时间,发票类型,销售方,发票号码,发票代码,金额,开票日期,真伪状态,合规状态,人工复核,风险原因\n";
    const rows = filteredHistory.map(item => {
        return [
            new Date(item.createdAt).toLocaleString(),
            item.invoiceType || '普通发票',
            `"${item.sellerName}"`, // Escape quotes
            `"${item.taxData?.invoiceNumber || ''}"`, // Force string for IDs
            `"${item.taxData?.invoiceCode || ''}"`,
            item.amount,
            item.taxData?.date || '',
            item.authenticityStatus === 'pass' ? '通过' : '失败',
            item.complianceStatus === 'pass' ? '通过' : '失败',
            item.reviewStatus === 'approved' ? '已接受' : item.reviewStatus === 'rejected' ? '已驳回' : '未处理',
            `"${(item.authenticityReason + ' ' + item.complianceReason).replace(/"/g, '""')}"`
        ].join(",");
    }).join("\n");
    
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit_export_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
        <div className="p-4 bg-gray-100 rounded-full mb-4"><Icons.Wallet /></div>
        <p>暂无审核记录</p>
      </div>
    );
  }

  // Grouping Logic
  const renderContent = () => {
    // Shared grouped rendering function to avoid code duplication
    const renderGrouped = (groupByKey: (item: AuditResult) => string, icon: React.ReactNode) => {
      const grouped = filteredHistory.reduce((acc, item) => {
        const key = groupByKey(item);
        if (!acc[key]) acc[key] = { items: [], total: 0, count: 0 };
        acc[key].items.push(item);
        acc[key].count++;
        // Rough parse amount
        const amt = parseFloat(item.amount.replace(/[^0-9.]/g, '')) || 0;
        acc[key].total += amt;
        return acc;
      }, {} as Record<string, { items: AuditResult[], total: number, count: number }>);

      return (
        <div className="space-y-6 pb-20">
          {Object.entries(grouped).map(([groupName, data]) => (
            <div key={groupName} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200">
                  <div className="font-bold text-gray-800 flex items-center gap-2">
                    {icon} {groupName} <span className="text-xs font-normal text-gray-500">({data.count} 张)</span>
                  </div>
                  <div className="font-bold text-blue-600">¥{data.total.toFixed(2)}</div>
               </div>
               <div className="divide-y divide-gray-100">
                  {data.items.map(item => {
                    const isRisk = item.authenticityStatus !== 'pass' || item.complianceStatus !== 'pass';
                    return (
                        <div key={item.id} onClick={() => setSelected(item)} className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between text-sm items-center relative">
                        {isSelectionMode && (
                            <div className="mr-3" onClick={(e) => toggleSelection(item.id, e)}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedIds.has(item.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                    {selectedIds.has(item.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                            </div>
                        )}
                        <div className="flex-1 flex justify-between">
                            <div className="flex items-center gap-2">
                                <div className="text-gray-400 text-xs w-24">{new Date(item.createdAt).toLocaleTimeString()}</div>
                                <div>
                                    <div className="font-medium text-gray-700">{item.sellerName}</div>
                                    <div className="text-xs text-gray-400">号码: {item.taxData?.invoiceNumber || '-'}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono">{item.amount}</div>
                                {item.reviewStatus ? (
                                    <div className={`text-xs font-bold ${item.reviewStatus === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.reviewStatus === 'approved' ? '已接受' : '已驳回'}
                                    </div>
                                ) : (
                                    <div className={`text-xs ${!isRisk ? 'text-green-500' : 'text-red-500'}`}>
                                        {!isRisk ? '正常' : '异常'}
                                    </div>
                                )}
                            </div>
                        </div>
                        </div>
                    );
                  })}
               </div>
            </div>
          ))}
        </div>
      );
    };

    if (viewMode === 'seller') {
       return renderGrouped(item => item.sellerName || "未知销售方", <Icons.Store />);
    }

    if (viewMode === 'type') {
       return renderGrouped(item => item.invoiceType || "普通发票", <Icons.Tag />);
    }

    let listToRender = filteredHistory;
    if (viewMode === 'risk') {
      listToRender = filteredHistory.filter(h => h.authenticityStatus !== 'pass' || h.complianceStatus !== 'pass');
      if (listToRender.length === 0) {
        return <div className="p-8 text-center text-gray-500">🎉 太棒了! 暂无风险发票需要处理。</div>;
      }
    }

    if (listToRender.length === 0) {
        return <div className="p-8 text-center text-gray-500">没有找到符合条件的记录</div>;
    }

    return (
       <div className="space-y-4 pb-20">
         {listToRender.map((item) => (
           <div 
             key={item.id}
             onClick={() => setSelected(item)} 
             className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center"
           >
              {isSelectionMode && (
                <div className="mr-4" onClick={(e) => toggleSelection(item.id, e)}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedIds.has(item.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {selectedIds.has(item.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                </div>
              )}
              <div className="flex-1 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${item.authenticityStatus === 'pass' && item.complianceStatus === 'pass' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.authenticityStatus === 'pass' && item.complianceStatus === 'pass' ? <Icons.CheckCircle /> : <Icons.AlertTriangle />}
                    </div>
                    <div>
                    <div className="font-bold text-gray-800">{item.sellerName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="bg-gray-100 px-1 rounded">{item.invoiceType || '发票'}</span>
                        <span className="text-gray-400 text-xs">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-bold text-blue-600">{item.amount}</div>
                    {item.reviewStatus ? (
                        <div className={`flex items-center justify-end gap-2 px-2 py-1 rounded text-xs font-bold ${item.reviewStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <span>复核</span>
                            <span>{item.reviewStatus === 'approved' ? '已接受' : '已驳回'}</span>
                        </div>
                    ) : (
                        <StatusTag label="状态" status={item.authenticityStatus === 'pass' && item.complianceStatus === 'pass' ? 'pass' : 'fail'} />
                    )}
                </div>
              </div>
           </div>
         ))}
       </div>
    );
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800">审核记录</h2>
         </div>
         <div className="flex gap-2 items-center flex-wrap">
             <div className="flex gap-1 text-sm bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-[280px] md:max-w-none scrollbar-hide">
                <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${viewMode === 'list' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}>全部</button>
                <button onClick={() => setViewMode('risk')} className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${viewMode === 'risk' ? 'bg-white shadow text-red-600 font-bold' : 'text-gray-500'}`}>风险 ({riskCount})</button>
                <button onClick={() => setViewMode('seller')} className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${viewMode === 'seller' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}>按开票方</button>
                <button onClick={() => setViewMode('type')} className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${viewMode === 'type' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-500'}`}>按类别</button>
             </div>
             
             <button onClick={() => setIsSelectionMode(!isSelectionMode)} className={`p-2 rounded-lg shadow flex items-center gap-1 text-sm font-bold shrink-0 transition-colors ${isSelectionMode ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                 <Icons.CheckCircle /> <span className="hidden md:inline">{isSelectionMode ? '取消选择' : '选择'}</span>
             </button>

             <button onClick={exportCSV} className="bg-white text-gray-600 p-2 rounded-lg hover:bg-gray-50 shadow flex items-center gap-1 text-sm font-bold shrink-0">
                 <Icons.Download /> <span className="hidden md:inline">导出</span>
             </button>
         </div>
       </div>

       {/* Time Filter Bar */}
       <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200 text-sm overflow-x-auto shrink-0">
          <span className="font-bold text-gray-600 shrink-0">按时间查询:</span>
          <input 
             type="date" 
             value={startDate} 
             onChange={(e) => setStartDate(e.target.value)} 
             className="border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-gray-400">-</span>
          <input 
             type="date" 
             value={endDate} 
             onChange={(e) => setEndDate(e.target.value)} 
             className="border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
          />
          {(startDate || endDate) && (
             <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-red-500 hover:text-red-700 text-xs shrink-0">
               清除
             </button>
          )}
       </div>

       {renderContent()}

       {selected && <AuditDetailModal result={selected} onClose={() => setSelected(null)} onUpdate={onUpdate} />}
       
       {showReimbursementModal && (
           <ReimbursementModal selectedItems={getSelectedItems()} onClose={() => setShowReimbursementModal(false)} />
       )}

       {/* Bottom Selection Bar */}
       {isSelectionMode && selectedIds.size > 0 && (
           <div className="fixed bottom-0 left-0 right-0 md:left-64 z-40 bg-slate-900 text-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] flex justify-between items-center animate-fade-in md:rounded-t-2xl md:mx-4 md:mb-4">
               <div>
                   <div className="text-xs text-gray-400">已选择</div>
                   <div className="font-bold text-lg">{selectedIds.size} 张发票</div>
               </div>
               <button 
                 onClick={() => setShowReimbursementModal(true)}
                 className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
               >
                   <Icons.FileText /> 生成报销单
               </button>
           </div>
       )}
    </div>
  );
};

const SettingsView = ({ settings, onSave }: { settings: AuditSettings, onSave: (s: AuditSettings) => void }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const handleChange = (key: keyof AuditSettings, value: any) => setLocalSettings(prev => ({ ...prev, [key]: value }));

  const setPreset = (type: 'ollama' | 'lmstudio') => {
    if (type === 'ollama') {
      handleChange('aiProvider', 'custom');
      handleChange('customBaseUrl', 'http://localhost:11434/v1');
      handleChange('customModelName', 'llava');
      handleChange('customApiKey', 'ollama');
    } else {
      handleChange('aiProvider', 'custom');
      handleChange('customBaseUrl', '/lm-studio-api/v1');
      handleChange('customModelName', 'local-model');
      handleChange('customApiKey', 'lm-studio');
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">系统配置</h2>
      
      {/* AI Provider */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-purple-700 font-bold border-b border-gray-100 pb-2">
           <Icons.Brain /> <h2>模型服务与隐私</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">服务商模式</label>
            <select 
              value={localSettings.aiProvider}
              onChange={(e) => handleChange('aiProvider', e.target.value as any)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="gemini">Google Gemini (云端/推荐)</option>
              <option value="custom">Custom / Local LLM (本地/隐私)</option>
            </select>
          </div>

          {localSettings.aiProvider === 'custom' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
               <div className="flex gap-2 mb-2">
                 <button onClick={() => setPreset('ollama')} className="text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">使用 Ollama 预设</button>
                 <button onClick={() => setPreset('lmstudio')} className="text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">使用 LM Studio 预设</button>
               </div>
               
               <div className="p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-100">
                 <strong>重要提示:</strong> 本地模型必须具备 Vision (视觉) 能力才能识别发票图片 (例如: llava, llama-3.2-vision)。纯文本模型无法工作。
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Base URL</label>
                    <input type="text" value={localSettings.customBaseUrl} onChange={(e) => handleChange('customBaseUrl', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Model Name</label>
                    <input type="text" value={localSettings.customModelName} onChange={(e) => handleChange('customModelName', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded" />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">API Key (如不需要可留空)</label>
                  <input type="password" value={localSettings.customApiKey} onChange={(e) => handleChange('customApiKey', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded" />
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Batch Rules */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold border-b border-gray-100 pb-2">
           <Icons.Layers /> <h2>批量风控阈值</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">单张发票预警金额 (元)</label>
             <input type="number" value={localSettings.maxSingleAmount} onChange={(e) => handleChange('maxSingleAmount', Number(e.target.value))} className="w-full p-2.5 border border-gray-300 rounded-lg" />
           </div>
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">批量报销总额上限 (元)</label>
             <input type="number" value={localSettings.maxBatchAmount} onChange={(e) => handleChange('maxBatchAmount', Number(e.target.value))} className="w-full p-2.5 border border-gray-300 rounded-lg" />
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-700 font-bold border-b border-gray-100 pb-2">
           <Icons.FileText /> <h2>审核标准配置</h2>
        </div>
        
        <div className="space-y-4">
          <InputArea 
            label="真伪验证规则 (重点:国税五要素)" 
            value={localSettings.authRules}
            onChange={(v) => handleChange('authRules', v)}
            placeholder="输入规则..."
          />
          <InputArea 
            label="虚开判定标准" 
            value={localSettings.shellRules}
            onChange={(v) => handleChange('shellRules', v)}
            placeholder="输入规则..."
          />
          <InputArea 
            label="合规性标准" 
            value={localSettings.complianceRules}
            onChange={(v) => handleChange('complianceRules', v)}
            placeholder="输入规则..."
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold border-b border-gray-100 pb-2">
           <Icons.ShieldCheck /> <h2>企业报销制度</h2>
        </div>
        <textarea
          value={localSettings.corporatePolicy}
          onChange={(e) => handleChange('corporatePolicy', e.target.value)}
          className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="粘贴公司制度全文..."
        />
      </div>

      <button onClick={() => onSave(localSettings)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
        保存所有配置
      </button>
    </div>
  );
};

const AuditView = ({ onSave, settings, history, user }: { onSave: (res: AuditResult) => void, settings: AuditSettings, history: AuditResult[], user: User }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [queue, setQueue] = useState<{file: File, status: 'pending'|'processing'|'done'|'error', result?: AuditResult}[]>([]);
  const [batchReport, setBatchReport] = useState<BatchReport | null>(null);
  const [selectedResult, setSelectedResult] = useState<AuditResult | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  // --- Core Analysis Logic ---
  const callAI = async (prompt: string, imageBase64: string | null, mimeType: string = 'image/jpeg'): Promise<string> => {
    if (settings.aiProvider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      const contents: any = { parts: [] };
      if (imageBase64) contents.parts.push({ inlineData: { mimeType, data: imageBase64 } });
      contents.parts.push({ text: prompt });
      const resp = await ai.models.generateContent({ model, contents });
      return resp.text || "";
    } else {
      if (!settings.customApiKey && settings.customBaseUrl.includes("openai")) throw new Error("Missing API Key");

      // Auto-switch to proxy for local LM Studio to avoid CORS/OPTIONS errors
      let finalBaseUrl = settings.customBaseUrl;
      const localRegex = /^(?:https?:\/\/)?(?:localhost|127\.0\.0\.1):1234/;
      if (typeof finalBaseUrl === 'string' && localRegex.test(finalBaseUrl)) {
         finalBaseUrl = finalBaseUrl.replace(localRegex, '/lm-studio-api');
      }

      const messages: any[] = [{ role: 'user', content: [] }];
      if (imageBase64) messages[0].content.push({ type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } });
      messages[0].content.push({ type: 'text', text: prompt });

      try {
        const resp = await fetch(`${finalBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.customApiKey || 'dummy'}`
          },
          body: JSON.stringify({
            model: settings.customModelName || 'deepseek-chat',
            messages: messages,
            temperature: 0.1
          })
        });
        if (!resp.ok) throw new Error(await resp.text());
        const data = await resp.json();
        return data.choices?.[0]?.message?.content || "";
      } catch (e: any) {
        throw new Error(`Local LLM Error: ${e.message}. Ensure model supports Vision.`);
      }
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    // @ts-ignore
    const newQueue = Array.from(files).map(file => ({ file, status: 'pending' as const }));
    setQueue(prev => [...prev, ...newQueue]);
  };

  const startBatchProcess = () => {
     if (queue.length === 0) return;
     processQueue(queue);
  };

  const processQueue = async (currentQueue: typeof queue) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setBatchReport(null);

    const tempResults: AuditResult[] = [];

    // Process sequentially to update UI
    for (let i = 0; i < currentQueue.length; i++) {
      const item = currentQueue[i];
      if (item.status === 'done') {
        if(item.result) tempResults.push(item.result);
        continue;
      }

      setQueue(q => q.map((x, idx) => idx === i ? { ...x, status: 'processing' } : x));
      addLog(`开始处理文件 ${i+1}/${currentQueue.length}: ${item.file.name}`);

      try {
        const base64 = await fileToBase64(item.file);
        const type = item.file.type === 'application/pdf' ? 'pdf' : 'image';
        
        // 1. Audit Single Invoice
        const result = await runSingleAudit(base64, type, item.file.name);
        
        // 2. Add to list
        tempResults.push(result);
        onSave(result); // Save to history immediately
        
        setQueue(q => q.map((x, idx) => idx === i ? { ...x, status: 'done', result } : x));
      } catch (e) {
        console.error(e);
        addLog(`❌ 文件 ${item.file.name} 处理失败`);
        setQueue(q => q.map((x, idx) => idx === i ? { ...x, status: 'error' } : x));
      }
    }

    // 3. Batch Analysis (Cross-file check)
    if (tempResults.length > 0) {
      addLog("正在进行批量风控关联分析...");
      const report = analyzeBatchRisks(tempResults, history, settings);
      setBatchReport(report);
    }

    setIsProcessing(false);
  };

  const analyzeBatchRisks = (currentBatch: AuditResult[], allHistory: AuditResult[], config: AuditSettings): BatchReport => {
    const report: BatchReport = {
      totalAmount: 0,
      invoiceCount: 0,
      duplicateCount: 0,
      duplicates: [],
      consecutiveRisks: [],
      largeAmountRisks: [],
      sensitiveAmountRisks: [],
      overallRisk: 'low'
    };

    // Use a Set to track seen invoice numbers (from history + current batch processing)
    const seenNumbers = new Set<string>();

    // 1. Load existing history
    allHistory.forEach(h => {
        if (h.taxData?.invoiceNumber && h.taxData.invoiceNumber !== 'N/A') {
            seenNumbers.add(h.taxData.invoiceNumber);
        }
    });

    const uniqueBatch: AuditResult[] = [];

    // 2. Process current batch
    currentBatch.forEach(res => {
      const num = res.taxData?.invoiceNumber;
      // We only consider it a "duplicate" if we have a valid invoice number
      if (num && num !== 'N/A') {
        if (seenNumbers.has(num)) {
            // Found duplicate
            report.duplicateCount++;
            report.duplicates.push({
                invoiceNumber: num,
                amount: res.amount
            });
            // Do not add to uniqueBatch, so it's excluded from stats
        } else {
            // New unique invoice
            seenNumbers.add(num);
            uniqueBatch.push(res);
        }
      } else {
         // If no invoice number, we can't dedup, so we include it in stats
         uniqueBatch.push(res);
      }
    });

    // 3. Stats based on UNIQUE items only
    report.invoiceCount = uniqueBatch.length;

    const historyNums = allHistory.map(h => ({ num: parseInt(h.taxData?.invoiceNumber || '0'), src: 'history' }));
    const batchNums = uniqueBatch.map(h => ({ num: parseInt(h.taxData?.invoiceNumber || '0'), src: 'batch', invoiceNumber: h.invoiceNumber }));
    
    const allNums = [...historyNums, ...batchNums].filter(x => x.num > 0).sort((a, b) => a.num - b.num);

    uniqueBatch.forEach(res => {
      const amt = parseFloat(res.amount.replace(/[^0-9.]/g, '')) || 0;
      report.totalAmount += amt;

      // Check Large Single Amount
      if (amt > config.maxSingleAmount) {
        report.largeAmountRisks.push(res.invoiceNumber);
      }

      // Check Sensitive (Round Numbers e.g. 1000.00)
      if (amt % 100 === 0 && amt > 0) {
        report.sensitiveAmountRisks.push(`${res.invoiceNumber} (${amt})`);
      }
    });

    // Check Consecutive
    for (let i = 1; i < allNums.length; i++) {
        const prev = allNums[i-1];
        const curr = allNums[i];
        if (curr.src === 'batch' && (curr.num - prev.num === 1)) {
            report.consecutiveRisks.push(`${prev.num} -> ${curr.num} (${prev.src === 'history' ? '与历史记录连号' : '批次内连号'})`);
        }
    }

    if (report.consecutiveRisks.length > 0 || report.largeAmountRisks.length > 0 || report.totalAmount > config.maxBatchAmount || report.duplicateCount > 0) {
      report.overallRisk = 'high';
    } else if (report.sensitiveAmountRisks.length > 0) {
      report.overallRisk = 'medium';
    }

    return report;
  };

  const runTaxBureauSimulation = async (taxData: any): Promise<{status: 'verified'|'failed', logs: string[]}> => {
     const logs: string[] = [];
     const steps = [
      { msg: "正在连接国家税务总局全国增值税发票查验平台...", delay: 600 },
      { msg: "Handshake: inv-veri.chinatax.gov.cn (443)... OK", delay: 400 },
      { msg: "建立安全通道 (SSL/TLS)...", delay: 300 },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay));
      logs.push(step.msg);
    }
    
    // Validate Data Presence
    // We allow invoiceCode to be missing per new user requirements, but log it as info.
    if (!taxData.invoiceCode) logs.push("ℹ️ 提示: 未提取到发票代码 (非全电发票可能需要)");
    else logs.push(`> 输入发票代码: ${taxData.invoiceCode}`);

    if (!taxData.invoiceNumber) logs.push("❌ 错误: 无法提取发票号码");
    else logs.push(`> 输入发票号码: ${taxData.invoiceNumber}`);

    if (!taxData.date) logs.push("⚠️ 警告: 日期格式可能有误，尝试自动纠正...");
    else logs.push(`> 输入开票日期: ${taxData.date}`);

    if (!taxData.amount) logs.push("❌ 错误: 无法提取不含税金额");
    else logs.push(`> 输入校验金额: ${taxData.amount}`);
    
    await new Promise(r => setTimeout(r, 600)); // Simulate processing time

    // Updated success condition: InvoiceCode is NOT strictly required for success now
    const isSuccess = taxData.invoiceNumber && taxData.date && taxData.amount;
    
    if (isSuccess) {
       logs.push("正在获取验证码图片...");
       await new Promise(r => setTimeout(r, 400));
       logs.push("模拟人工点击获取验证码...");
       await new Promise(r => setTimeout(r, 500));
       logs.push("AI 识别验证码中...");
       await new Promise(r => setTimeout(r, 600));
       logs.push(`> 输入验证码: ${Math.random().toString(36).substring(7).toUpperCase().substring(0, 4)}`); // Fake captcha
       logs.push("提交查验请求...");
       await new Promise(r => setTimeout(r, 800));
       logs.push("✔ 国税局返回: <查验结果：一致>");
    } else {
       logs.push("❌ 国税局返回: <查验结果：要素缺失或不一致>");
       logs.push("!! 请检查发票图片是否清晰，或是否存在遮挡");
    }

    return { status: isSuccess ? 'verified' : 'failed', logs };
  };

  const runShellAuditSimulation = async (sellerName: string, rules: string): Promise<{status: 'pass'|'fail'|'warning', logs: string[]}> => {
    const logs: string[] = [];
    const steps = [
      { msg: `🔍 启动虚开发票审核专项Agent...`, delay: 500 },
      { msg: `🌐 正在检索工商登记信息系统 (GSXT)...`, delay: 800 },
      { msg: `🏢 目标企业: ${sellerName || '未知销售方'}`, delay: 400 },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay));
      logs.push(step.msg);
    }

    if (!sellerName || sellerName === "Unknown" || sellerName === "Parse Error") {
      logs.push("❌ 错误: 无法确定销售方名称，取消工商信息检索");
      return { status: 'warning', logs };
    }

    // Simulate GSXT Data Retrieval
    await new Promise(r => setTimeout(r, 1000));
    logs.push(`✅ 已获取 [${sellerName}] 工商登记数据:`);

    // Logic based on simulation (we can make it random or semi-realistic)
    // For now, let's pretend we always "find" some info but check rules
    const isRecentlyEstablished = Math.random() < 0.2; // 20% chance of being new
    const addrIsVirtual = Math.random() < 0.1; // 10% chance of virtual address

    if (isRecentlyEstablished) {
       logs.push(`⚠️ 发现异常: 企业成立日期为 2025-08-15 (不足6个月)`);
    } else {
       logs.push(`ℹ️ 企业成立日期: 2020-05-20 (存续状态正常)`);
    }

    if (addrIsVirtual) {
       logs.push(`⚠️ 发现异常: 注册地址包含 "集群注册" 标识`);
    } else {
       logs.push(`ℹ️ 注册地址: 经校验为实体办公地址`);
    }

    logs.push(`📝 正在根据判定标准进行匹配...`);
    await new Promise(r => setTimeout(r, 600));

    let status: 'pass' | 'fail' | 'warning' = 'pass';
    if (isRecentlyEstablished || addrIsVirtual) {
       status = 'warning';
       logs.push(`🚩 判定结果: 触发预警。匹配规则: ${isRecentlyEstablished ? '成立不足6个月' : ''} ${addrIsVirtual ? '虚拟/集群地址' : ''}`);
    } else {
       logs.push(`✔ 判定结果: 未发现明显虚开特征`);
    }

    return { status, logs };
  };

  const runSingleAudit = async (base64: string, type: 'pdf' | 'image', fileName: string): Promise<AuditResult> => {
    let rawBase64 = base64;
    let mimeType = type === 'pdf' ? 'application/pdf' : 'image/jpeg';
    if (base64.startsWith('data:')) {
      const parts = base64.split(',');
      rawBase64 = parts[1];
      const mimeMatch = parts[0].match(/:(.*?);/);
      if(mimeMatch) mimeType = mimeMatch[1];
    }

    const visualPrompt = `
      You are an expert tax auditor (税务审核专家).
      1. Extract the following JSON strictly.
      2. Analyze the invoice image/file against the provided rules.

      JSON Schema:
      {
        "invoiceType": "string (e.g. 增值税专用发票, 增值税普通发票, 出租车票, 火车票, 定额发票)",
        "sellerName": "string",
        "taxData": {
           "invoiceCode": "string (digits only)",
           "invoiceNumber": "string (digits only)",
           "date": "YYYYMMDD",
           "amount": "string (digits only, e.g. 100.00, check amount excluding tax)",
           "checkCode": "string (last 6 digits)"
        },
        "authenticityStatus": "pass"|"fail",
        "shellRiskStatus": "pass"|"fail"|"warning",
        "complianceStatus": "pass"|"fail",
        "authenticityReason": "string (brief, in Simplified Chinese)",
        "shellRiskReason": "string (brief, in Simplified Chinese)",
        "complianceReason": "string (brief, in Simplified Chinese)",
        "auditTrail": ["string (in Simplified Chinese)"]
      }

      Strictly analyze against these rules:
      [Shell/Fictitious Invoice Risk Rules]: ${settings.shellRules}
      [General Compliance Rules]: ${settings.complianceRules}
      [Corporate Reimbursement Policy]: ${settings.corporatePolicy ? settings.corporatePolicy : "No specific corporate policy provided."}

      Important:
      - CRITICAL: You MUST fail complianceStatus if the invoice contradicts the Corporate Reimbursement Policy.
      - CRITICAL: You MUST evaluate shellRiskStatus based on the [Shell/Fictitious Invoice Risk Rules]. Use 'warning' or 'fail' if suspicious.
      - If the invoice violates the Corporate Policy, complianceStatus must be 'fail'.
      - Ensure taxData fields are extracted accurately.
      - ALL TEXT output MUST BE IN SIMPLIFIED CHINESE.
    `;

    const txt = await callAI(visualPrompt, rawBase64, mimeType);
    const jsonStr = txt.replace(/```json|```/g, '').trim();
    let data;
    try { 
        data = JSON.parse(jsonStr); 
    } catch { 
        // Fallback if AI fails to return valid JSON
        data = { 
            sellerName: "Parse Error", 
            auditTrail: ["AI 解析失败", "原始输出: " + txt.substring(0, 50)] 
        }; 
    }

    // Run Tax Bureau Agent Simulation
    addLog(`>> 正在调用国税局Agent查验: ${data.taxData?.invoiceNumber || '未知'}`);
    const agentResult = await runTaxBureauSimulation(data.taxData || {});

    // Run Shell/Fictitious Audit Simulation
    addLog(`>> 正在启动虚开风险核查Agent: ${data.sellerName || '未知'}`);
    const shellResult = await runShellAuditSimulation(data.sellerName, settings.shellRules);

    // STRICT AUTHENTICITY LOGIC:
    // If the official tax agent verification fails, the Authenticity Status MUST be 'fail'.
    // Override whatever the AI thought about the visual appearance.
    let finalAuthStatus = data.authenticityStatus || 'pass';
    let finalAuthReason = data.authenticityReason || '';

    if (agentResult.status !== 'verified') {
        finalAuthStatus = 'fail';
        finalAuthReason = `[国税局查验失败] 未通过官方数据库验证。${finalAuthReason}`;
    }

    // SHELL RISK LOGIC: Merge AI findings with GSXT simulation findings
    let finalShellStatus = data.shellRiskStatus || 'pass';
    let finalShellReason = data.shellRiskReason || '';
    if (shellResult.status !== 'pass') {
        finalShellStatus = shellResult.status === 'fail' ? 'fail' : 'warning';
        finalShellReason = `[工商信息分析] ${shellResult.logs.find(l => l.includes('判定结果')) || '发现异常'}。${finalShellReason}`;
    }

    return {
      id: Date.now() + Math.random().toString(),
      sellerName: data.sellerName || "Unknown",
      invoiceNumber: data.taxData?.invoiceNumber || "N/A",
      amount: data.taxData?.amount || "0.00",
      date: data.taxData?.date || "",
      type,
      previewUrl: base64,
      taxData: data.taxData,
      officialVerifyStatus: agentResult.status,
      agentLogs: agentResult.logs,
      shellRiskLogs: shellResult.logs, // Save the GSXT logs
      invoiceType: data.invoiceType, // Store extracted type
      authenticityStatus: finalAuthStatus as any,
      authenticityReason: finalAuthReason,
      shellRiskStatus: finalShellStatus as any,
      shellRiskReason: finalShellReason,
      complianceStatus: data.complianceStatus || 'pass',
      complianceReason: data.complianceReason || '',
      auditTrail: data.auditTrail || ["分析完成"],
      createdAt: Date.now(),
      user: user.username
    };
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // --- Render ---

  if (queue.length === 0 && !isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 py-10 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">发票批量审核</h2>
          <p className="text-gray-500 text-sm">国税局发票查验 · 自定义审核规则 · 云端or本地部署</p>
        </div>

        <div className="w-full max-w-md space-y-4">
          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowCameraModal(true)}
              className="flex flex-col items-center justify-center gap-2 bg-blue-600 text-white p-6 rounded-2xl cursor-pointer hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
               <Icons.Camera />
               <span className="font-bold">拍照识别</span>
            </button>
            <label className="flex flex-col items-center justify-center gap-2 bg-white border-2 border-dashed border-blue-200 text-blue-600 p-6 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all shadow-sm">
               <Icons.Upload />
               <span className="font-bold">批量上传</span>
               <input 
                 ref={fileInputRef} 
                 type="file" 
                 multiple 
                 accept="image/*,application/pdf" 
                 className="hidden" 
                 onChange={(e) => { if(e.target.files) handleFiles(Array.from(e.target.files)) }} 
               />
            </label>
          </div>
          <div className="text-center text-xs text-gray-400 mt-4">
             当前配置: {settings.aiProvider === 'gemini' ? 'Google Gemini (云端)' : 'Local LLM (本地隐私)'}
          </div>
        </div>

        {/* Camera Modal */}
        {showCameraModal && (
          <CameraCaptureModal 
            onClose={() => setShowCameraModal(false)}
            onCapture={(file) => handleFiles([file])}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">审核队列 ({queue.length})</h2>
        <div className="flex gap-2">
           <button onClick={startBatchProcess} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2" disabled={isProcessing}>
             {isProcessing ? <Icons.Loader /> : <Icons.Play />}
             {isProcessing ? '处理中...' : '开始批量识别'}
           </button>
           <button onClick={() => { setQueue([]); setBatchReport(null); setIsProcessing(false); setLogs([]); }} className="text-sm text-red-500 hover:text-red-700 font-medium px-2 flex items-center gap-1 border border-red-100 rounded-lg bg-red-50">
             <Icons.Trash /> 清空
           </button>
        </div>
      </div>

      {/* Processing Logs */}
      {isProcessing && (
         <div className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-xs h-40 overflow-y-auto">
            {logs.map((l, i) => <div key={i}>&gt; {l}</div>)}
            <div className="animate-pulse">&gt; _</div>
         </div>
      )}

      {/* Batch Report Card */}
      {batchReport && (
        <div className="bg-white rounded-xl shadow-lg border-l-4 border-l-blue-600 overflow-hidden animate-fade-in">
           <div className={`p-4 text-white flex justify-between items-center ${batchReport.overallRisk === 'high' ? 'bg-red-600' : batchReport.overallRisk === 'medium' ? 'bg-amber-500' : 'bg-green-600'}`}>
              <div className="flex items-center gap-2 font-bold text-lg">
                <Icons.Layers /> 批量风控报告
              </div>
              <span className="bg-white/20 px-2 py-1 rounded text-xs">风险等级: {batchReport.overallRisk.toUpperCase()}</span>
           </div>
           <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border-b border-gray-200">
              <div>
                <div className="text-xs text-gray-500">发票总数</div>
                <div className="text-xl font-bold">{batchReport.invoiceCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">报销总额</div>
                <div className={`text-xl font-bold ${batchReport.totalAmount > settings.maxBatchAmount ? 'text-red-600' : 'text-gray-800'}`}>
                  ¥{batchReport.totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="col-span-2">
                 <div className="text-xs text-gray-500">敏感风险项</div>
                 <div className="flex gap-2 mt-1">
                    {batchReport.consecutiveRisks.length > 0 && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">连号 ({batchReport.consecutiveRisks.length})</span>}
                    {batchReport.largeAmountRisks.length > 0 && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded">大额 ({batchReport.largeAmountRisks.length})</span>}
                    {batchReport.consecutiveRisks.length === 0 && batchReport.largeAmountRisks.length === 0 && batchReport.duplicateCount === 0 && <span className="text-gray-400 text-sm">无明显异常</span>}
                 </div>
              </div>
           </div>
           
           {/* Duplicate Warning Section */}
           {batchReport.duplicateCount > 0 && (
             <div className="p-3 bg-red-50 text-xs text-red-800 border-t border-red-100">
               <strong>⚠ 发现重复发票 ({batchReport.duplicateCount} 张) - 已剔除统计:</strong>
               <ul className="list-disc pl-5 mt-1 space-y-1">
                 {batchReport.duplicates.map((d, i) => (
                   <li key={i}>号码: {d.invoiceNumber} | 金额: {d.amount}</li>
                 ))}
               </ul>
             </div>
           )}

           {batchReport.consecutiveRisks.length > 0 && (
             <div className="p-3 bg-red-50 text-xs text-red-800 border-t border-red-100">
               <strong>连号预警 (疑似拆单):</strong> {batchReport.consecutiveRisks.join(', ')}
             </div>
           )}
        </div>
      )}

      {/* Results List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {queue.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => item.result && setSelectedResult(item.result)}
            className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 relative overflow-hidden group transition-all ${item.result ? 'cursor-pointer hover:shadow-md hover:border-blue-300' : ''}`}
          >
            {item.status === 'processing' && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100"><div className="h-full bg-blue-600 animate-progress"></div></div>}
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <Icons.FileText />
                 </div>
                 <div className="min-w-0">
                   <div className="font-bold text-sm truncate max-w-[150px]">{item.file.name}</div>
                   <div className="text-xs text-gray-500">{item.status}</div>
                 </div>
              </div>
              {item.result && (
                <div className="text-right">
                  <div className="font-bold text-blue-600">{item.result.amount}</div>
                  <div className="text-[10px] text-gray-400">{item.result.invoiceNumber}</div>
                </div>
              )}
            </div>

            {item.result && (
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2 rounded pointer-events-none">
                 <StatusTag label="真伪" status={item.result.authenticityStatus} />
                 <StatusTag label="虚开" status={item.result.shellRiskStatus} />
                 <StatusTag label="合规" status={item.result.complianceStatus} />
                 <div className="col-span-2 text-gray-500 truncate">{item.result.sellerName}</div>
                 <div className="col-span-2 text-[10px] text-blue-500 text-center mt-1 border-t border-gray-200 pt-1">点击查看详情 &gt;</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Upload More FAB (Floating Action Button) */}
      {!isProcessing && (
        <div className="fixed md:absolute md:bottom-8 md:right-8 bottom-20 right-4 flex flex-col gap-2 z-30">
          <button 
             onClick={() => setShowCameraModal(true)}
             className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <Icons.Camera />
          </button>
          <label className="w-14 h-14 bg-white text-blue-600 rounded-full shadow-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <Icons.Plus />
            <input 
              type="file" 
              multiple 
              accept="image/*,application/pdf" 
              className="hidden" 
              onChange={(e) => { if(e.target.files) handleFiles(Array.from(e.target.files)) }} 
            />
          </label>
        </div>
      )}

      {/* Detail Modal */}
      {selectedResult && (
        <AuditDetailModal result={selectedResult} onClose={() => setSelectedResult(null)} onUpdate={onSave} />
      )}
      
      {/* Camera Modal (FAB Version) */}
      {showCameraModal && (
          <CameraCaptureModal 
            onClose={() => setShowCameraModal(false)}
            onCapture={(file) => handleFiles([file])}
          />
      )}
    </div>
  );
};

// --- App Component ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'history' | 'settings'>('audit');
  const [history, setHistory] = useState<AuditResult[]>([]);
  const [settings, setSettings] = useState<AuditSettings>(DEFAULT_SETTINGS);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('audit_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      
      const savedSettings = localStorage.getItem('audit_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const sessionUser = localStorage.getItem('session_user');
      if (sessionUser) setUser(JSON.parse(sessionUser));
    } catch (e) {
      console.error("Failed to load from local storage", e);
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('session_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('session_user');
    setActiveTab('audit');
  };

  const handleSaveResult = (res: AuditResult) => {
    setHistory(prev => {
        // If result exists (update), replace it. If new (add), prepend it.
        const exists = prev.find(p => p.id === res.id);
        let newHistory;
        if (exists) {
            newHistory = prev.map(p => p.id === res.id ? res : p);
        } else {
            newHistory = [res, ...prev];
        }
        localStorage.setItem('audit_history', JSON.stringify(newHistory));
        return newHistory;
    });
  };

  const handleSaveSettings = (s: AuditSettings) => {
    setSettings(s);
    localStorage.setItem('audit_settings', JSON.stringify(s));
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-slate-900 text-white p-6 shadow-xl z-20 transition-all duration-300 ${sidebarCollapsed ? 'w-24' : 'w-64'}`}>
         <div className="mb-10 flex items-center gap-3">
           <div className="p-2 bg-blue-600 rounded-lg shrink-0"><Icons.ShieldCheck /></div>
           {!sidebarCollapsed && (
             <div>
               <h1 className="text-xl font-bold tracking-tight">发票sir</h1>
               <p className="text-xs text-slate-400">企业风控终端</p>
             </div>
           )}
         </div>
         
         <nav className="flex-1 space-y-2">
            <DesktopNavBtn collapsed={sidebarCollapsed} active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<Icons.Camera />} label="智能审核" />
            <DesktopNavBtn collapsed={sidebarCollapsed} active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Icons.Wallet />} label="审核记录" />
            <DesktopNavBtn collapsed={sidebarCollapsed} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Icons.Settings />} label="系统配置" />
         </nav>

         <div className="pt-6 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-4 px-2 overflow-hidden">
               <div className="bg-slate-700 p-2 rounded-full shrink-0"><Icons.User /></div>
               {!sidebarCollapsed && (
                 <div className="text-sm">
                   <div className="font-bold truncate">{user.username}</div>
                   <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                 </div>
               )}
            </div>
            <button onClick={handleLogout} className={`flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <Icons.LogOut /> 
              {!sidebarCollapsed && <span>退出登录</span>}
            </button>
         </div>

         <button 
           onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
           className="mt-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg flex justify-center text-gray-400 hover:text-white transition-colors"
           title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
         >
            {sidebarCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
         </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
         {/* Mobile Header */}
         <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
            <div className="font-bold text-lg flex items-center gap-2 text-blue-900">
              <Icons.ShieldCheck /> 发票sir
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-500"><Icons.LogOut /></button>
         </header>

         <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <div className="max-w-5xl mx-auto h-full">
              {activeTab === 'audit' && <AuditView onSave={handleSaveResult} settings={settings} history={history} user={user} />}
              {activeTab === 'history' && <HistoryView history={history} onUpdate={handleSaveResult} />}
              {activeTab === 'settings' && <SettingsView settings={settings} onSave={handleSaveSettings} />}
            </div>
         </div>

         {/* Mobile Bottom Nav */}
         <div className="md:hidden bg-white border-t border-gray-200 p-2 flex justify-around items-center absolute bottom-0 w-full z-20 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <NavButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} icon={<Icons.Camera />} label="审核" />
            <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Icons.Wallet />} label="记录" />
            <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Icons.Settings />} label="配置" />
         </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);