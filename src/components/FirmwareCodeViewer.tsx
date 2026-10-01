import React, { useState } from 'react';
import { FIRMWARE_PIN_DEFINITIONS_CODE } from '../data/wiringData';
import { Copy, Check, Terminal, FileCode, AlertCircle } from 'lucide-react';

export const FirmwareCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(FIRMWARE_PIN_DEFINITIONS_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCode size={16} />
            Firmware Cross-Reference
          </div>
          <h2 className="text-xl font-extrabold text-slate-100">
            ESP32 Arduino Firmware Pin Definitions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Exact C++ preprocessor macros used in the firmware, directly matching the schematic pinout.
          </p>
        </div>

        <button
          onClick={copyToClipboard}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 shrink-0"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied to Clipboard!' : 'Copy Code Snippet'}
        </button>
      </div>

      {/* Code Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Editor Top Bar */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-slate-400 font-semibold">
              LilyGO TTGO T-SIM A7670G / Pin_Config.h
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Arduino / ESP32 C++</span>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
            <code>{FIRMWARE_PIN_DEFINITIONS_CODE}</code>
          </pre>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-400">
        <AlertCircle size={16} className="text-cyan-400 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Firmware Synchronization Note:</strong> If you reassign any sensor to an alternative GPIO pin (e.g., switching ultrasonic trigger from GPIO 14 to GPIO 13), you must update both the physical wiring and the corresponding <code className="text-cyan-400 font-mono">#define</code> in your Arduino IDE sketch.
        </p>
      </div>
    </div>
  );
};
