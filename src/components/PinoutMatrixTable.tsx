import React, { useState } from 'react';
import { LEFT_HEADER_PINS, RIGHT_HEADER_PINS } from '../data/wiringData';
import { BoardPin } from '../types/wiring';
import { Search, Filter, AlertTriangle, ShieldCheck, Zap, Info } from 'lucide-react';

interface PinoutMatrixTableProps {
  onSelectPin: (pin: BoardPin) => void;
}

export const PinoutMatrixTable: React.FC<PinoutMatrixTableProps> = ({ onSelectPin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [headerFilter, setHeaderFilter] = useState<'all' | 'left' | 'right'>('all');
  const [usedOnly, setUsedOnly] = useState(false);

  const allPins: BoardPin[] = [
    ...LEFT_HEADER_PINS.map((p) => ({ ...p, header: 'left' as const })),
    ...RIGHT_HEADER_PINS.map((p) => ({ ...p, header: 'right' as const })),
  ];

  const filteredPins = allPins.filter((pin) => {
    if (headerFilter !== 'all' && pin.header !== headerFilter) return false;
    if (usedOnly && !pin.isUsedInProject) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchLabel = pin.label.toLowerCase().includes(q);
      const matchGpio = pin.gpio !== undefined && pin.gpio.toString().includes(q);
      const matchDesc = pin.description.toLowerCase().includes(q);
      const matchConn = pin.connectedTo?.toLowerCase().includes(q) || false;
      const matchDefine = pin.codeDefine?.toLowerCase().includes(q) || false;
      return matchLabel || matchGpio || matchDesc || matchConn || matchDefine;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap size={15} />
              Hardware Pin Mapping Table
            </div>
            <h2 className="text-xl font-extrabold text-slate-100">
              LilyGO TTGO T-SIM A7670G Pinout Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Complete header reference showing physical pin position, GPIO mappings, voltage ratings, and firmware definitions.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search pin, GPIO, sensor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Header:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setHeaderFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  headerFilter === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Headers (31)
              </button>
              <button
                onClick={() => setHeaderFilter('left')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  headerFilter === 'left' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Left Header (15)
              </button>
              <button
                onClick={() => setHeaderFilter('right')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  headerFilter === 'right' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Right Header (16)
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={usedOnly}
              onChange={(e) => setUsedOnly(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500/20"
            />
            Show project-used pins only
          </label>
        </div>
      </div>

      {/* Pinout Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="p-3.5">Header & Pin #</th>
                <th className="p-3.5">Pin Label</th>
                <th className="p-3.5">GPIO</th>
                <th className="p-3.5">Voltage</th>
                <th className="p-3.5">Signal Role</th>
                <th className="p-3.5">Target Module / Wire</th>
                <th className="p-3.5">Firmware Define</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredPins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No pins matched your search query or filter.
                  </td>
                </tr>
              ) : (
                filteredPins.map((pin) => (
                  <tr
                    key={pin.id}
                    onClick={() => onSelectPin(pin)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="p-3.5 text-slate-300 font-bold">
                      <span className="capitalize text-slate-400 font-sans">{pin.header}</span> #{pin.pinNumber}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-bold text-cyan-300 group-hover:border-cyan-500/50">
                        {pin.label}
                      </span>
                    </td>
                    <td className="p-3.5 text-amber-400 font-semibold">
                      {pin.gpio !== undefined ? `GPIO ${pin.gpio}` : '—'}
                    </td>
                    <td className="p-3.5 text-slate-300">{pin.voltage}</td>
                    <td className="p-3.5 text-slate-300 font-sans max-w-xs">{pin.description}</td>
                    <td className="p-3.5 font-sans">
                      {pin.connectedTo ? (
                        <span className="text-emerald-400 font-medium">{pin.connectedTo}</span>
                      ) : (
                        <span className="text-slate-600">None / Unused</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {pin.codeDefine ? (
                        <span className="text-purple-300 text-[11px] bg-purple-950/40 border border-purple-800/60 px-2 py-0.5 rounded">
                          {pin.codeDefine}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-3.5 font-sans">
                      {pin.warning ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px] bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded">
                          <AlertTriangle size={12} /> Notice
                        </span>
                      ) : pin.isUsedInProject ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px] bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded">
                          <ShieldCheck size={12} /> Active
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">Free</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
