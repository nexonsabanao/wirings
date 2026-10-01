import React, { useState, useRef, useEffect } from 'react';
import { BoardPin, SensorModule } from './types/wiring';
import { SENSORS, WIRE_CONNECTIONS } from './data/wiringData';
import { NavigationHeader, ViewMode } from './components/NavigationHeader';
import { InteractiveWiringSvg } from './components/InteractiveWiringSvg';
import { PinDetailsDrawer } from './components/PinDetailsDrawer';
import { SensorModal } from './components/SensorModal';
import { AssemblyChecklist } from './components/AssemblyChecklist';
import { PinoutMatrixTable } from './components/PinoutMatrixTable';
import { FirmwareCodeViewer } from './components/FirmwareCodeViewer';
import { PrintableBlueprint } from './components/PrintableBlueprint';
import {
  AlertTriangle,
  Info,
  ShieldCheck,
  Zap,
  HelpCircle,
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  Check,
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<BoardPin | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorModule | null>(null);

  // Display toggles
  const [showAnimations, setShowAnimations] = useState(true);
  const [showVoltages, setShowVoltages] = useState(false);
  const [showInternalModem, setShowInternalModem] = useState(true);
  const [showLegend, setShowLegend] = useState(false); // Collapsed on mobile by default

  // Zoom & Pan state
  const [scale, setScale] = useState(0.95);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Touch tracking for pinch-to-zoom on mobile
  const touchStartDist = useRef<number | null>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.15, 2.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.15, 0.5));
  const handleResetZoom = () => {
    setScale(0.95);
    setPan({ x: 0, y: 0 });
  };

  // Mouse Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Touch handlers for mobile phones & tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      dragStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
      touchStartDist.current = null;
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDist.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging.current) {
      setPan({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
    } else if (e.touches.length === 2 && touchStartDist.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchStartDist.current;
      setScale((s) => Math.min(Math.max(s * (ratio > 1 ? 1.03 : 0.97), 0.5), 2.5));
      touchStartDist.current = currentDist;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    touchStartDist.current = null;
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'canvas') return;
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.92 : 1.08;
    setScale((s) => Math.min(Math.max(s * zoomFactor, 0.5), 2.8));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navigation Header */}
      <NavigationHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        showAnimations={showAnimations}
        onToggleAnimations={() => setShowAnimations((v) => !v)}
        showVoltages={showVoltages}
        onToggleVoltages={() => setShowVoltages((v) => !v)}
        showInternalModem={showInternalModem}
        onToggleInternalModem={() => setShowInternalModem((v) => !v)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* VIEW 1: INTERACTIVE VISUAL CANVAS */}
        {viewMode === 'canvas' && (
          <div
            className="flex-1 relative flex flex-col items-center justify-center overflow-hidden touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            {/* Top Alert Banner for Quick Safety Reminders */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-2xl w-full px-3">
              <div className="bg-slate-900/95 backdrop-blur border border-cyan-500/30 p-2 sm:p-2.5 rounded-xl shadow-2xl flex items-center justify-between text-[11px] sm:text-xs text-slate-300">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Zap size={14} className="text-cyan-400 shrink-0" />
                  <span>
                    <strong className="text-cyan-300">Active Focus Mode:</strong> Selecting or hovering a sensor dims all other wires automatically.
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-cyan-400 shrink-0 ml-2">
                  {scale.toFixed(1)}x
                </span>
              </div>
            </div>

            {/* Interactive Schematic SVG */}
            <InteractiveWiringSvg
              selectedFilter={selectedFilter}
              selectedWireId={selectedWireId}
              selectedPinId={selectedPin?.id || null}
              selectedSensorId={selectedSensor?.id || null}
              onSelectWire={(id) => setSelectedWireId(id)}
              onSelectPin={(pin) => setSelectedPin(pin)}
              onSelectSensor={(sensor) => setSelectedSensor(sensor)}
              showAnimations={showAnimations}
              showVoltages={showVoltages}
              showInternalModem={showInternalModem}
              scale={scale}
              pan={pan}
            />

            {/* Bottom Floating Wire Color Legend */}
            {showLegend ? (
              <div className="absolute bottom-3 left-3 z-20 bg-slate-900/95 backdrop-blur border border-slate-800 p-3 rounded-2xl shadow-2xl max-w-xs sm:max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass size={13} className="text-cyan-400" />
                    Color Code Standard
                  </span>
                  <button
                    onClick={() => setShowLegend(false)}
                    className="text-[10px] text-slate-500 hover:text-slate-300 p-1"
                  >
                    Hide
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-slate-300 font-mono">Red: 3.3V Power</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500" />
                    <span className="text-slate-300 font-mono">Black: System GND</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span className="text-slate-300 font-mono">Cyan: I2C SDA (32)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="text-slate-300 font-mono">Yellow: I2C SCL (33)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-300 font-mono">Green: TRIG (14)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-slate-300 font-mono">Orange: ECHO (36)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                    <span className="text-slate-300 font-mono">Orange: Rain (34)</span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLegend(true)}
                className="absolute bottom-3 left-3 z-20 px-3 py-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl text-[11px] text-slate-400 hover:text-slate-200 transition-colors shadow-lg"
              >
                Wire Legend
              </button>
            )}
          </div>
        )}

        {/* VIEW 2: STEP-BY-STEP ASSEMBLY CHECKLIST */}
        {viewMode === 'checklist' && (
          <div className="flex-1 overflow-y-auto py-4 sm:py-6">
            <AssemblyChecklist onSelectFilter={(f) => setSelectedFilter(f)} />
          </div>
        )}

        {/* VIEW 3: 36-PINOUT MATRIX TABLE */}
        {viewMode === 'pinout' && (
          <div className="flex-1 overflow-y-auto py-4 sm:py-6">
            <PinoutMatrixTable onSelectPin={(pin) => setSelectedPin(pin)} />
          </div>
        )}

        {/* VIEW 4: FIRMWARE CODE VIEWER */}
        {viewMode === 'firmware' && (
          <div className="flex-1 overflow-y-auto py-4 sm:py-6">
            <FirmwareCodeViewer />
          </div>
        )}

        {/* VIEW 5: PRINTABLE BLUEPRINT */}
        {viewMode === 'blueprint' && (
          <div className="flex-1 overflow-y-auto py-4 sm:py-6 bg-slate-950">
            <PrintableBlueprint />
          </div>
        )}
      </main>

      {/* Pin Details Drawer */}
      <PinDetailsDrawer
        pin={selectedPin}
        onClose={() => setSelectedPin(null)}
        onSelectWire={(wId) => setSelectedWireId(wId)}
      />

      {/* Sensor Modal */}
      <SensorModal
        sensor={selectedSensor}
        onClose={() => setSelectedSensor(null)}
        onSelectWire={(wId) => setSelectedWireId(wId)}
        onFilterBySensor={(filter) => {
          setSelectedFilter(filter);
          setViewMode('canvas');
        }}
      />
    </div>
  );
}
