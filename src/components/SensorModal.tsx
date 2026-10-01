import React from 'react';
import { SensorModule } from '../types/wiring';
import { X, CheckCircle2, AlertTriangle, Cpu, Zap, Activity, Info, Terminal } from 'lucide-react';

interface SensorModalProps {
  sensor: SensorModule | null;
  onClose: () => void;
  onSelectWire: (wireId: string | null) => void;
  onFilterBySensor: (sensorId: string) => void;
}

export const SensorModal: React.FC<SensorModalProps> = ({
  sensor,
  onClose,
  onSelectWire,
  onFilterBySensor,
}) => {
  if (!sensor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div
          className="p-5 border-b border-slate-800 flex items-center justify-between"
          style={{
            background: `linear-gradient(to right, ${sensor.accentColor}22, #0f172a)`,
            borderTop: `3px solid ${sensor.accentColor}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${sensor.accentColor}33`, color: sensor.accentColor }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{sensor.name}</h2>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="capitalize text-cyan-400">{sensor.interfaceType}</span>
                {sensor.addressOrProtocol && (
                  <>
                    <span>&bull;</span>
                    <span className="text-amber-300">{sensor.addressOrProtocol}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Description */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{sensor.description}</p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">Operating Voltage</span>
              <span className="font-semibold text-slate-200 font-mono text-xs">{sensor.operatingVoltage}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-1">Diagram Position</span>
              <span className="font-semibold text-slate-200 capitalize text-xs">
                {sensor.location.replace('-', ' ')}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block mb-1">Board Pins Required</span>
              <span className="font-semibold text-cyan-400 font-mono text-xs">{sensor.pins.length} Connections</span>
            </div>
          </div>

          {/* Pinout Breakout Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={14} className="text-cyan-400" />
              Pinout & Wiring Map
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-medium">
                    <th className="p-2.5">Module Pin</th>
                    <th className="p-2.5">Wire Color</th>
                    <th className="p-2.5">LilyGO Pin Target</th>
                    <th className="p-2.5">Signal / Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {sensor.pins.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-2.5 font-bold text-slate-200">{p.name}</td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="text-slate-300 text-[11px] font-sans">{p.label}</span>
                        </div>
                      </td>
                      <td className="p-2.5 text-cyan-300 font-bold">{p.connectedToBoardPin}</td>
                      <td className="p-2.5 text-slate-400 text-[11px] font-sans">{p.notes || p.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical Warnings */}
          {sensor.criticalWarnings && sensor.criticalWarnings.length > 0 && (
            <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle size={16} />
                Critical Hardware Warnings
              </div>
              <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
                {sensor.criticalWarnings.map((warn, i) => (
                  <li key={i} className="leading-relaxed">
                    {warn}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes & Assembly Tips */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} className="text-blue-400" />
              Technical Assembly Notes
            </h3>
            <ul className="space-y-2">
              {sensor.notes.map((note, i) => (
                <li
                  key={i}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Firmware Defines Cross-Reference */}
          {sensor.firmwareDefines.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal size={14} className="text-emerald-400" />
                Firmware Definitions (ESP32 / Arduino C++)
              </h3>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5">
                {sensor.firmwareDefines.map((def, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-300">
                    <div>
                      <span className="text-purple-400">#define</span>{' '}
                      <span className="text-cyan-300 font-bold">{def.name}</span>{' '}
                      <span className="text-amber-300">{def.value}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-sans">{def.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (sensor.id === 'ultrasonic') onFilterBySensor('ultrasonic');
              else if (sensor.id === 'bme280' || sensor.id === 'bh1750') onFilterBySensor('i2c');
              else if (sensor.id === 'rain_gauge') onFilterBySensor('rain');
              else if (sensor.id === 'gps_module') onFilterBySensor('gps');
              else if (sensor.id === 'power_buffer') onFilterBySensor('power');
              onClose();
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <Activity size={14} />
            Isolate This Circuit Trace
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
