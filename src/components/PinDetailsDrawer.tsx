import React from 'react';
import { BoardPin, WireConnection } from '../types/wiring';
import { WIRE_CONNECTIONS, SENSORS } from '../data/wiringData';
import { Zap, AlertTriangle, Cpu, CheckCircle2, X, Cable, Code } from 'lucide-react';

interface PinDetailsDrawerProps {
  pin: BoardPin | null;
  onClose: () => void;
  onSelectWire: (wireId: string | null) => void;
}

export const PinDetailsDrawer: React.FC<PinDetailsDrawerProps> = ({
  pin,
  onClose,
  onSelectWire,
}) => {
  if (!pin) return null;

  // Find associated wires
  const connectedWires = WIRE_CONNECTIONS.filter(
    (w) => w.targetBoardPinId === pin.id
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-base">
            {pin.label}
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              {pin.header.toUpperCase()} HEADER &bull; PIN #{pin.pinNumber}
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              {pin.gpio !== undefined ? `GPIO ${pin.gpio}` : 'POWER / GND PIN'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {/* Status Pill & Signal Type */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Signal Type</span>
            <span className="font-semibold text-slate-200 capitalize flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              {pin.type.replace('_', ' ')}
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Voltage Level</span>
            <span className="font-semibold text-slate-200 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {pin.voltage}
            </span>
          </div>
        </div>

        {/* Function Description */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
          <span className="text-xs font-semibold text-slate-300 block">Pin Function</span>
          <p className="text-xs text-slate-400 leading-relaxed">{pin.description}</p>
        </div>

        {/* Firmware Macro Definition */}
        {pin.codeDefine && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code size={13} className="text-cyan-400" />
                Firmware Define
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Arduino / C++</span>
            </div>
            <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
              #define {pin.codeDefine} {pin.gpio ?? ''}
            </div>
          </div>
        )}

        {/* Critical Warnings */}
        {pin.warning && (
          <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <AlertTriangle size={15} />
              CRITICAL WIRING NOTICE
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">{pin.warning}</p>
          </div>
        )}

        {/* Connected Physical Wires & Sensors */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Cable size={14} className="text-cyan-400" />
            Connected Wires ({connectedWires.length})
          </span>

          {connectedWires.length === 0 ? (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500 text-center">
              {pin.isUsedInProject
                ? 'Internal on-board connection or power rail.'
                : 'Unused in this flood alert station build.'}
            </div>
          ) : (
            connectedWires.map((wire) => {
              const sensor = SENSORS.find((s) => s.id === wire.sourceSensorId);
              return (
                <div
                  key={wire.id}
                  onClick={() => onSelectWire(wire.id)}
                  className="p-3 bg-slate-950 hover:bg-slate-800/60 transition-colors rounded-xl border border-slate-800/80 cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: wire.color }}
                      />
                      <span className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300">
                        {wire.signalName}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{wire.colorName}</span>
                  </div>

                  <p className="text-xs text-slate-400">{wire.description}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                    <span className="text-slate-500">Source:</span>
                    <span className="text-slate-300 font-medium">{sensor?.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 text-center">
        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs transition-colors"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
