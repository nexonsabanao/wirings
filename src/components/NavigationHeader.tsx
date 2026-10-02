import React from 'react';
import { Layers, CheckSquare, Table, FileCode, Printer, Activity, Zap, ZoomIn, ZoomOut, RotateCcw, Eye } from 'lucide-react';

export type ViewMode = 'canvas' | 'checklist' | 'pinout' | 'firmware' | 'blueprint';

interface NavigationHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  showAnimations: boolean;
  onToggleAnimations: () => void;
  showVoltages: boolean;
  onToggleVoltages: () => void;
  showInternalModem: boolean;
  onToggleInternalModem: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  viewMode,
  onViewModeChange,
  selectedFilter,
  onSelectFilter,
  showAnimations,
  onToggleAnimations,
  showVoltages,
  onToggleVoltages,
  showInternalModem,
  onToggleInternalModem,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl print:hidden">
      {/* Primary Brand & Navigation Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title & Board Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
              <Zap size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-100 tracking-tight">
                  LilyGO T-SIM A7670G
                </h1>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  PY1 PINOUT
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Single 3.3V/GND &bull; Built-in GPS & 18650 &bull; Dimming Focus
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Tabs (Responsive horizontal scroll on mobile) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onViewModeChange('canvas')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              viewMode === 'canvas'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={13} />
            <span>Schematic</span>
          </button>
          <button
            onClick={() => onViewModeChange('checklist')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              viewMode === 'checklist'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare size={13} />
            <span>Checklist</span>
          </button>
          <button
            onClick={() => onViewModeChange('pinout')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              viewMode === 'pinout'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table size={13} />
            <span>Pinout</span>
          </button>
          <button
            onClick={() => onViewModeChange('firmware')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              viewMode === 'firmware'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode size={13} />
            <span>Firmware</span>
          </button>
          <button
            onClick={() => onViewModeChange('blueprint')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 ${
              viewMode === 'blueprint'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer size={13} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Secondary Circuit Filter Row */}
      {viewMode === 'canvas' && (
        <div className="bg-slate-950 border-t border-slate-800/80 px-3 sm:px-6 py-1.5 sm:py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Focus Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Circuits' },
                { id: 'ultrasonic', label: '🌊 Ultrasonic (IO14/36)' },
                { id: 'i2c', label: '🌡️ I²C Weather (IO32/33)' },
                { id: 'rain', label: '🌧️ Rain + RC Filter (IO34)' },
                { id: 'power', label: '⚡ V3V3 (3.3V) & GND (Right)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onSelectFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all shrink-0 ${
                    selectedFilter === f.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Display Toggles & Canvas Zoom */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-2 pt-1 sm:pt-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onToggleAnimations}
                  className={`px-2 py-1 rounded-lg border text-[11px] flex items-center gap-1 transition-colors ${
                    showAnimations
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle live signal animations"
                >
                  <Activity size={12} className={showAnimations ? 'animate-pulse' : ''} />
                  <span>Pulse</span>
                </button>

                <button
                  onClick={onToggleVoltages}
                  className={`px-2 py-1 rounded-lg border text-[11px] flex items-center gap-1 transition-colors ${
                    showVoltages
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title="Toggle wire signal labels"
                >
                  <Eye size={12} />
                  <span>Labels</span>
                </button>
              </div>

              {/* Zoom Buttons */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 ml-auto">
                <button
                  onClick={onZoomIn}
                  className="p-1.5 hover:text-cyan-400 text-slate-400 rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={onZoomOut}
                  className="p-1.5 hover:text-cyan-400 text-slate-400 rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={onResetZoom}
                  className="p-1.5 hover:text-cyan-400 text-slate-400 rounded transition-colors"
                  title="Reset View"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
