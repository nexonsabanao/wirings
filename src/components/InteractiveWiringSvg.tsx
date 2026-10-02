import React, { useState } from 'react';
import { BoardPin, SensorModule, WireConnection } from '../types/wiring';
import { LEFT_HEADER_PINS, RIGHT_HEADER_PINS, SENSORS, WIRE_CONNECTIONS } from '../data/wiringData';

interface InteractiveWiringSvgProps {
  selectedFilter: string;
  selectedWireId: string | null;
  selectedPinId: string | null;
  selectedSensorId: string | null;
  onSelectWire: (wireId: string | null) => void;
  onSelectPin: (pin: BoardPin | null) => void;
  onSelectSensor: (sensor: SensorModule | null) => void;
  showAnimations: boolean;
  showVoltages: boolean;
  showInternalModem?: boolean;
  scale: number;
  pan: { x: number; y: number };
}

export const InteractiveWiringSvg: React.FC<InteractiveWiringSvgProps> = ({
  selectedFilter,
  selectedWireId,
  selectedPinId,
  selectedSensorId,
  onSelectWire,
  onSelectPin,
  onSelectSensor,
  showAnimations,
  showVoltages,
  scale,
  pan,
}) => {
  const [hoveredWire, setHoveredWire] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [hoveredSensor, setHoveredSensor] = useState<string | null>(null);
  const [hoveredResistor, setHoveredResistor] = useState<boolean>(false);
  const [hoveredCapacitor, setHoveredCapacitor] = useState<boolean>(false);

  // Active focused sensor determination
  const activeFocusSensor =
    hoveredSensor ||
    selectedSensorId ||
    (selectedFilter !== 'all' && selectedFilter !== 'power' ? selectedFilter : null) ||
    (selectedWireId ? WIRE_CONNECTIONS.find((w) => w.id === selectedWireId)?.sourceSensorId : null);

  // Check if a wire belongs to the focused sensor
  const isWireInActiveFocus = (wire: WireConnection) => {
    if (selectedFilter === 'power') {
      return wire.signalType === 'power' || wire.signalType === 'ground';
    }
    if (!activeFocusSensor) return true;
    if (activeFocusSensor === 'ultrasonic' && wire.sourceSensorId === 'ultrasonic') return true;
    if (activeFocusSensor === 'i2c' && (wire.sourceSensorId === 'bme280' || wire.sourceSensorId === 'bh1750')) return true;
    if (activeFocusSensor === 'rain_gauge' && wire.sourceSensorId === 'rain_gauge') return true;
    if (activeFocusSensor === 'rain' && wire.sourceSensorId === 'rain_gauge') return true;
    return wire.sourceSensorId === activeFocusSensor;
  };

  // Wire Filter visibility
  const isWireVisible = (wire: WireConnection) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'ultrasonic') return wire.sourceSensorId === 'ultrasonic';
    if (selectedFilter === 'i2c') return wire.sourceSensorId === 'bme280' || wire.sourceSensorId === 'bh1750';
    if (selectedFilter === 'rain') return wire.sourceSensorId === 'rain_gauge';
    if (selectedFilter === 'power') return wire.signalType === 'power' || wire.signalType === 'ground';
    return true;
  };

  const isWireHighlighted = (wireId: string) => {
    if (selectedWireId === wireId) return true;
    if (hoveredWire === wireId) return true;
    return false;
  };

  // Coordinates mapping (1440 x 990 canvas)
  // Central Board X: 485, Y: 140
  // Left Header X: 525 (15 pins)
  // Right Header X: 875 (16 pins)
  const leftPinY = (index: number) => 255 + index * 34.5;
  const rightPinY = (index: number) => 255 + index * 32.5;

  const leftHeaderX = 525;
  const rightHeaderX = 875;

  // Board Pin coordinate helper
  const getBoardPinCoords = (pinId: string): { x: number; y: number } => {
    if (pinId.startsWith('left-')) {
      const idx = parseInt(pinId.replace('left-', ''), 10) - 1;
      return { x: leftHeaderX, y: leftPinY(idx) };
    }
    if (pinId.startsWith('right-')) {
      const idx = parseInt(pinId.replace('right-', ''), 10) - 1;
      return { x: rightHeaderX, y: rightPinY(idx) };
    }
    return { x: 700, y: 500 };
  };

  // Sensor Pin coordinate helper (Pixel-perfect connection points)
  const getSensorPinCoords = (sensorId: string, pinName: string): { x: number; y: number } => {
    switch (sensorId) {
      // Top-Left: AJ-SR04T Ultrasonic (Card at X: 45, Y: 65, Right-edge X = 380)
      case 'ultrasonic': {
        const baseX = 380;
        if (pinName === 'VCC') return { x: baseX, y: 115 };
        if (pinName === 'TRIG') return { x: baseX, y: 148 };
        if (pinName === 'ECHO') return { x: baseX, y: 181 };
        if (pinName === 'GND') return { x: baseX, y: 214 };
        return { x: baseX, y: 115 };
      }
      // Top-Right: BME280 (Card at X: 1050, Y: 65, Left-edge X = 1050)
      case 'bme280': {
        const baseX = 1050;
        if (pinName === 'VCC') return { x: baseX, y: 115 };
        if (pinName === 'GND') return { x: baseX, y: 145 };
        if (pinName === 'SCL') return { x: baseX, y: 175 };
        if (pinName === 'SDA') return { x: baseX, y: 205 };
        return { x: baseX, y: 115 };
      }
      // Top-Right 2: BH1750 (Card at X: 1050, Y: 275, Left-edge X = 1050)
      case 'bh1750': {
        const baseX = 1050;
        if (pinName === 'VCC') return { x: baseX, y: 325 };
        if (pinName === 'GND') return { x: baseX, y: 355 };
        if (pinName === 'SCL') return { x: baseX, y: 385 };
        if (pinName === 'SDA') return { x: baseX, y: 415 };
        return { x: baseX, y: 325 };
      }
      // Bottom-Right: Rain Gauge (Card at X: 1050, Y: 485, Left-edge X = 1050)
      case 'rain_gauge': {
        const baseX = 1050;
        if (pinName === 'YELLOW') return { x: baseX, y: 545 };
        if (pinName === 'VCC') return { x: baseX, y: 585 };
        if (pinName === 'GND') return { x: baseX, y: 625 };
        return { x: baseX, y: 545 };
      }
      default:
        return { x: 500, y: 500 };
    }
  };

  // Generate clean, aesthetic curved routing paths
  const createPath = (p1: { x: number; y: number }, p2: { x: number; y: number }, wireId: string) => {
    // Ultrasonic VCC (Red) wire from Left side looping OVER the top of the board to Right Header Pin 1 (V3V3)
    if (wireId === 'w-us-vcc') {
      return `M ${p1.x} ${p1.y} C 440 60, 780 60, ${p2.x} ${p2.y}`;
    }
    // Ultrasonic GND (Black) wire from Left side looping OVER the top of the board to Right Header Pin 2 (GND)
    if (wireId === 'w-us-gnd') {
      return `M ${p1.x} ${p1.y} C 450 80, 760 80, ${p2.x} ${p2.y}`;
    }

    // Ultrasonic Trig from Left side looping under the board to Right Header Pin 13 (IO14)
    if (wireId === 'w-us-trig') {
      return `M ${p1.x} ${p1.y} C 410 800, 800 800, ${p2.x} ${p2.y}`;
    }

    // Ultrasonic Echo directly to Left Header Pin 11 (IO36)
    if (wireId === 'w-us-echo') {
      const midX = (p1.x + p2.x) / 2;
      return `M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`;
    }

    // Right-side sensors to Right Header pins (smooth S-bezier curves)
    const midX = (p1.x + p2.x) / 2;
    return `M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`;
  };

  const isResistorActive =
    hoveredResistor ||
    selectedWireId === 'resistor-10k' ||
    selectedFilter === 'rain' ||
    selectedFilter === 'power' ||
    activeFocusSensor === 'rain_gauge' ||
    activeFocusSensor === 'rain';

  const resistorOpacity = activeFocusSensor && !isResistorActive ? 0.1 : 1;

  const isCapacitorActive =
    hoveredCapacitor ||
    selectedWireId === 'capacitor-100nf' ||
    selectedFilter === 'rain' ||
    selectedFilter === 'power' ||
    activeFocusSensor === 'rain_gauge' ||
    activeFocusSensor === 'rain';

  const capacitorOpacity = activeFocusSensor && !isCapacitorActive ? 0.1 : 1;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none cursor-grab active:cursor-grabbing flex items-center justify-center touch-none">
      <svg
        viewBox="0 0 1440 990"
        className="w-full h-full max-h-[92vh] transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <pattern id="dotgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.07)" />
          </pattern>

          {/* PCB & Component Gradients */}
          <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="50%" stopColor="#0b0f19" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          <linearGradient id="cardGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="40%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="goldPad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          <linearGradient id="batteryHolderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Resistor Gradients */}
          <linearGradient id="resistorBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ede0d4" />
            <stop offset="25%" stopColor="#e6ccb2" />
            <stop offset="55%" stopColor="#ddb892" />
            <stop offset="85%" stopColor="#b08968" />
            <stop offset="100%" stopColor="#7f5539" />
          </linearGradient>

          {/* Capacitor Gradients */}
          <linearGradient id="ceramicCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          <linearGradient id="metalLeadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="2" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Grids */}
        <rect width="1440" height="990" fill="#030712" />
        <rect width="1440" height="990" fill="url(#grid)" />
        <rect width="1440" height="990" fill="url(#dotgrid)" />

        {/* Top Header Badge */}
        <g opacity="0.5">
          <text x="720" y="34" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="2">
            LILYGO TTGO T-SIM A7670G &bull; ALL SENSORS POWERED VIA RIGHT HEADER V3V3 &amp; GND
          </text>
          <line x1="80" y1="44" x2="1360" y2="44" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
        </g>

        {/* ========================================================================= */}
        {/* EXTERNAL SENSORS (LEFT & RIGHT PERIPHERALS) */}
        {/* ========================================================================= */}

        {/* 1. TOP-LEFT: AJ-SR04T / JSN-SR04T Ultrasonic Sensor Module */}
        <g
          className="cursor-pointer transition-all duration-200"
          onClick={() => onSelectSensor(SENSORS.find((s) => s.id === 'ultrasonic') || null)}
          onMouseEnter={() => setHoveredSensor('ultrasonic')}
          onMouseLeave={() => setHoveredSensor(null)}
          opacity={activeFocusSensor && activeFocusSensor !== 'ultrasonic' ? 0.15 : 1}
        >
          <rect
            x="45"
            y="65"
            width="335"
            height="275"
            rx="14"
            fill="url(#cardGradDark)"
            stroke={activeFocusSensor === 'ultrasonic' ? '#10b981' : '#1e293b'}
            strokeWidth={activeFocusSensor === 'ultrasonic' ? 2.5 : 1.5}
            filter={activeFocusSensor === 'ultrasonic' ? 'url(#glow)' : undefined}
          />
          <rect x="45" y="65" width="335" height="38" rx="14" fill="#064e3b" />
          <rect x="45" y="90" width="335" height="13" fill="#064e3b" />
          <circle cx="68" cy="84" r="6" fill="#10b981" />
          <text x="84" y="88" fill="#ecfdf5" fontSize="13" fontWeight="bold">
            AJ-SR04T Ultrasonic Sensor
          </text>
          <text x="365" y="88" textAnchor="end" fill="#6ee7b7" fontSize="10" fontFamily="monospace">
            WATER LEVEL
          </text>

          {/* Transducer Drawing */}
          <g transform="translate(65, 120)">
            <rect x="0" y="10" width="48" height="56" rx="6" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="24" cy="38" r="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="24" cy="38" r="10" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
            <text x="24" y="80" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">
              IP67 PROBE
            </text>

            <path d="M 12 70 Q 24 82 36 70" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.8" />
            <path d="M 6 78 Q 24 94 42 78" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />

            <rect x="70" y="10" width="65" height="56" rx="4" fill="#14532d" stroke="#15803d" strokeWidth="1" />
            <rect x="78" y="20" width="18" height="24" rx="2" fill="#1e293b" />
            <circle cx="118" cy="38" r="7" fill="#cbd5e1" stroke="#475569" />
            <text x="102" y="80" textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="600">
              DRIVER PCB
            </text>
          </g>

          {/* Pin Terminals on Right of Ultrasonic Card */}
          <g transform="translate(230, 115)">
            {[
              { name: 'VCC', label: 'V3V3 (Right Pin 1)', col: '#ef4444', y: 0 },
              { name: 'TRIG', label: 'IO14 (Right Pin 13)', col: '#10b981', y: 33 },
              { name: 'ECHO', label: 'IO36 (Left Pin 11)', col: '#f59e0b', y: 66 },
              { name: 'GND', label: 'GND (Right Pin 2)', col: '#94a3b8', y: 99 },
            ].map((p, idx) => (
              <g key={idx} transform={`translate(0, ${p.y})`}>
                <rect x="0" y="-10" width="150" height="22" rx="4" fill="#020617" stroke={p.col} strokeWidth="1" />
                <circle cx="150" cy="0" r="4.5" fill={p.col} stroke="#fff" strokeWidth="1" />
                <text x="8" y="4" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {p.name}
                </text>
                <text x="140" y="4" textAnchor="end" fill="#94a3b8" fontSize="8.5">
                  {p.label}
                </text>
              </g>
            ))}
          </g>

          {/* Bottom Note */}
          <g transform="translate(58, 282)">
            <rect x="0" y="0" width="310" height="42" rx="6" fill="#064e3b" fillOpacity="0.5" stroke="#059669" strokeWidth="1" />
            <text x="10" y="16" fill="#6ee7b7" fontSize="9.5" fontWeight="bold">
              💧 Flood Depth Measurement
            </text>
            <text x="10" y="30" fill="#a7f3d0" fontSize="8.5">
              Power from Right Pin 1 (V3V3) &amp; Pin 2 (GND)
            </text>
          </g>
        </g>

        {/* ========================================================================= */}
        {/* 2. TOP-RIGHT: BME280 Environmental Sensor (Refined Layout) */}
        {/* ========================================================================= */}
        <g
          className="cursor-pointer transition-all duration-200"
          onClick={() => onSelectSensor(SENSORS.find((s) => s.id === 'bme280') || null)}
          onMouseEnter={() => setHoveredSensor('bme280')}
          onMouseLeave={() => setHoveredSensor(null)}
          opacity={activeFocusSensor && activeFocusSensor !== 'bme280' && activeFocusSensor !== 'i2c' ? 0.15 : 1}
        >
          <rect
            x="1050"
            y="65"
            width="345"
            height="195"
            rx="14"
            fill="url(#cardGradDark)"
            stroke={activeFocusSensor === 'bme280' ? '#8b5cf6' : '#1e293b'}
            strokeWidth={activeFocusSensor === 'bme280' ? 2.5 : 1.5}
            filter={activeFocusSensor === 'bme280' ? 'url(#glow)' : undefined}
          />
          <rect x="1050" y="65" width="345" height="38" rx="14" fill="#3b0764" />
          <rect x="1050" y="90" width="345" height="13" fill="#3b0764" />
          <circle cx="1072" cy="84" r="6" fill="#a855f7" />
          <text x="1088" y="88" fill="#faf5ff" fontSize="13" fontWeight="bold">
            BME280 Weather Sensor
          </text>
          <text x="1375" y="88" textAnchor="end" fill="#d8b4fe" fontSize="10" fontFamily="monospace">
            I²C (0x76)
          </text>

          {/* Left Column: Clean Terminal Header Rows (Nodes at X=1050) */}
          <g transform="translate(1050, 115)">
            {[
              { name: 'VCC', label: 'V3V3 (Right Pin 1)', col: '#ef4444', y: 0 },
              { name: 'GND', label: 'GND (Right Pin 2)', col: '#94a3b8', y: 30 },
              { name: 'SCL', label: 'IO33 (Right Pin 4)', col: '#eab308', y: 60 },
              { name: 'SDA', label: 'IO32 (Right Pin 3)', col: '#06b6d4', y: 90 },
            ].map((p, idx) => (
              <g key={idx} transform={`translate(0, ${p.y})`}>
                <rect x="0" y="-10" width="180" height="22" rx="4" fill="#020617" stroke={p.col} strokeWidth="1" />
                <circle cx="0" cy="1" r="4.5" fill={p.col} stroke="#fff" strokeWidth="1" />
                <text x="10" y="4" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {p.name}
                </text>
                <text x="170" y="4" textAnchor="end" fill="#c084fc" fontSize="8.5">
                  {p.label}
                </text>
              </g>
            ))}
          </g>

          {/* Right Column: Realistic BME280 Breakout Board Illustration */}
          <g transform="translate(1245, 112)">
            {/* PCB */}
            <rect x="0" y="0" width="135" height="120" rx="8" fill="#581c87" stroke="#7e22ce" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="#e9d5ff" strokeWidth="1" />
            <circle cx="123" cy="12" r="3.5" fill="none" stroke="#e9d5ff" strokeWidth="1" />

            {/* Bosch Metal Sensor Can */}
            <rect x="38" y="24" width="58" height="48" rx="4" fill="url(#shieldGrad)" stroke="#cbd5e1" strokeWidth="1.2" />
            <circle cx="48" cy="34" r="3" fill="#0f172a" />
            <text x="67" y="48" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">
              BOSCH
            </text>
            <text x="67" y="60" textAnchor="middle" fill="#1e293b" fontSize="7.5" fontWeight="bold">
              BME280
            </text>

            {/* Parameter badges */}
            <g transform="translate(67, 92)" textAnchor="middle">
              <text fill="#e9d5ff" fontSize="8.5" fontWeight="bold">
                TEMP &bull; HUM &bull; PRESS
              </text>
              <text y="14" fill="#a855f7" fontSize="8" fontFamily="monospace">
                I2C ADDR: 0x76
              </text>
            </g>
          </g>
        </g>

        {/* ========================================================================= */}
        {/* 3. MID-RIGHT: BH1750 Ambient Light Sensor (Refined Layout) */}
        {/* ========================================================================= */}
        <g
          className="cursor-pointer transition-all duration-200"
          onClick={() => onSelectSensor(SENSORS.find((s) => s.id === 'bh1750') || null)}
          onMouseEnter={() => setHoveredSensor('bh1750')}
          onMouseLeave={() => setHoveredSensor(null)}
          opacity={activeFocusSensor && activeFocusSensor !== 'bh1750' && activeFocusSensor !== 'i2c' ? 0.15 : 1}
        >
          <rect
            x="1050"
            y="275"
            width="345"
            height="195"
            rx="14"
            fill="url(#cardGradDark)"
            stroke={activeFocusSensor === 'bh1750' ? '#3b82f6' : '#1e293b'}
            strokeWidth={activeFocusSensor === 'bh1750' ? 2.5 : 1.5}
            filter={activeFocusSensor === 'bh1750' ? 'url(#glow)' : undefined}
          />
          <rect x="1050" y="275" width="345" height="38" rx="14" fill="#1e3a8a" />
          <rect x="1050" y="300" width="345" height="13" fill="#1e3a8a" />
          <circle cx="1072" cy="294" r="6" fill="#60a5fa" />
          <text x="1088" y="298" fill="#eff6ff" fontSize="13" fontWeight="bold">
            BH1750 Ambient Light Sensor
          </text>
          <text x="1375" y="298" textAnchor="end" fill="#93c5fd" fontSize="10" fontFamily="monospace">
            I²C (0x23)
          </text>

          {/* Left Column: Clean Terminal Header Rows (Nodes at X=1050) */}
          <g transform="translate(1050, 325)">
            {[
              { name: 'VCC', label: 'V3V3 (Right Pin 1)', col: '#ef4444', y: 0 },
              { name: 'GND', label: 'GND (Right Pin 2)', col: '#94a3b8', y: 30 },
              { name: 'SCL', label: 'IO33 (Right Pin 4)', col: '#eab308', y: 60 },
              { name: 'SDA', label: 'IO32 (Right Pin 3)', col: '#06b6d4', y: 90 },
            ].map((p, idx) => (
              <g key={idx} transform={`translate(0, ${p.y})`}>
                <rect x="0" y="-10" width="180" height="22" rx="4" fill="#020617" stroke={p.col} strokeWidth="1" />
                <circle cx="0" cy="1" r="4.5" fill={p.col} stroke="#fff" strokeWidth="1" />
                <text x="10" y="4" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {p.name}
                </text>
                <text x="170" y="4" textAnchor="end" fill="#93c5fd" fontSize="8.5">
                  {p.label}
                </text>
              </g>
            ))}
          </g>

          {/* Right Column: Realistic GY-302 Optical Dome Breakout Board */}
          <g transform="translate(1245, 322)">
            {/* PCB */}
            <rect x="0" y="0" width="135" height="120" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="#bfdbfe" strokeWidth="1" />
            <circle cx="123" cy="12" r="3.5" fill="none" stroke="#bfdbfe" strokeWidth="1" />

            {/* Optical Diffuser Dome */}
            <circle cx="67" cy="45" r="24" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" />
            <circle cx="67" cy="45" r="18" fill="url(#shieldGrad)" />
            <circle cx="67" cy="45" r="8" fill="#38bdf8" />
            <circle cx="64" cy="42" r="3" fill="#ffffff" opacity="0.6" />

            <g transform="translate(67, 88)" textAnchor="middle">
              <text fill="#ffffff" fontSize="8.5" fontWeight="bold">
                16-BIT LUX SENSOR
              </text>
              <text y="14" fill="#93c5fd" fontSize="8" fontFamily="monospace">
                ADDR: Float (0x23)
              </text>
            </g>
          </g>
        </g>

        {/* ========================================================================= */}
        {/* 4. BOTTOM-RIGHT: Tipping Bucket Rain Gauge (Refined 3-Wire Layout) */}
        {/* ========================================================================= */}
        <g
          className="cursor-pointer transition-all duration-200"
          onClick={() => onSelectSensor(SENSORS.find((s) => s.id === 'rain_gauge') || null)}
          onMouseEnter={() => setHoveredSensor('rain_gauge')}
          onMouseLeave={() => setHoveredSensor(null)}
          opacity={activeFocusSensor && activeFocusSensor !== 'rain_gauge' && activeFocusSensor !== 'rain' ? 0.15 : 1}
        >
          <rect
            x="1050"
            y="485"
            width="345"
            height="295"
            rx="14"
            fill="url(#cardGradDark)"
            stroke={activeFocusSensor === 'rain_gauge' ? '#f97316' : '#1e293b'}
            strokeWidth={activeFocusSensor === 'rain_gauge' ? 2.5 : 1.5}
            filter={activeFocusSensor === 'rain_gauge' ? 'url(#glow)' : undefined}
          />
          <rect x="1050" y="485" width="345" height="38" rx="14" fill="#7c2d12" />
          <rect x="1050" y="510" width="345" height="13" fill="#7c2d12" />
          <circle cx="1072" cy="504" r="6" fill="#fb923c" />
          <text x="1088" y="508" fill="#fff7ed" fontSize="13" fontWeight="bold">
            Tipping Bucket Rain Gauge
          </text>
          <text x="1375" y="508" textAnchor="end" fill="#fdba74" fontSize="10" fontFamily="monospace">
            3-WIRE • IO34
          </text>

          {/* Left Column: 3 Sensor Terminals (Nodes at X=1050) */}
          <g transform="translate(1050, 545)">
            {[
              { name: 'YELLOW', label: 'Signal ➔ IO34 (Right Pin 5)', col: '#eab308', y: 0 },
              { name: 'VCC', label: 'Power ➔ V3V3 (Right Pin 1)', col: '#ef4444', y: 40 },
              { name: 'GND', label: 'Ground ➔ GND (Right Pin 2)', col: '#94a3b8', y: 80 },
            ].map((p, idx) => (
              <g key={idx} transform={`translate(0, ${p.y})`}>
                <rect x="0" y="-12" width="180" height="24" rx="4" fill="#020617" stroke={p.col} strokeWidth="1" />
                <circle cx="0" cy="0" r="4.5" fill={p.col} stroke="#fff" strokeWidth="1" />
                <text x="10" y="4" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {p.name}
                </text>
                <text x="170" y="4" textAnchor="end" fill="#fed7aa" fontSize="8.5">
                  {p.label}
                </text>
              </g>
            ))}
          </g>

          {/* Right Column: Clean Mechanical Illustration of Tipping Mechanism */}
          <g transform="translate(1245, 535)">
            <rect x="0" y="0" width="135" height="115" rx="8" fill="#1e293b" stroke="#ea580c" strokeWidth="1.2" />

            {/* Funnel */}
            <path d="M 25 15 L 110 15 L 75 45 L 60 45 Z" fill="#0284c7" opacity="0.6" stroke="#38bdf8" strokeWidth="1" />
            {/* Water Drops */}
            <circle cx="67" cy="52" r="2" fill="#38bdf8" />
            <circle cx="67" cy="60" r="1.5" fill="#38bdf8" />

            {/* Pivoting Seesaw Rocker Bucket */}
            <path d="M 30 70 L 67 62 L 105 70 L 90 82 L 45 82 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="1.2" />
            <circle cx="67" cy="72" r="3.5" fill="#f97316" />

            {/* Reed Switch SOT Component */}
            <rect x="52" y="88" width="30" height="10" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="67" y="96" textAnchor="middle" fill="#38bdf8" fontSize="6.5" fontWeight="bold">
              REED SW
            </text>

            <text x="67" y="108" textAnchor="middle" fill="#fed7aa" fontSize="7.5" fontWeight="bold">
              0.2794 mm / TIP
            </text>
          </g>

          {/* Bottom Card: Explicit RC Debounce Network Callout */}
          <g transform="translate(1062, 665)">
            <rect x="0" y="0" width="320" height="52" rx="6" fill="#7f1d1d" fillOpacity="0.85" stroke="#ef4444" strokeWidth="1.5" />
            <text x="10" y="16" fill="#fef2f2" fontSize="9.5" fontWeight="bold">
              ⚠️ MANDATORY RC DEBOUNCE NETWORK
            </text>
            <text x="10" y="30" fill="#fca5a5" fontSize="8">
              • 10 kΩ pull-up resistor: Right Pin 5 (IO34) ↔ Pin 1 (V3V3)
            </text>
            <text x="10" y="43" fill="#fed7aa" fontSize="8" fontWeight="600">
              • 100 nF (104) ceramic cap: Right Pin 5 (IO34) ↔ Pin 2 (GND)
            </text>
          </g>

          {/* Bottom Card: Assembly Summary */}
          <g transform="translate(1062, 725)">
            <rect x="0" y="0" width="320" height="42" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="10" y="16" fill="#38bdf8" fontSize="9.5" fontWeight="bold">
              💡 Wiring: YELLOW ➔ IO34 | VCC ➔ V3V3 | GND ➔ GND
            </text>
            <text x="10" y="30" fill="#94a3b8" fontSize="8">
              Hardware RC filter (1.0ms τ) eliminates reed switch bounce.
            </text>
          </g>
        </g>

        {/* ========================================================================= */}
        {/* CENTRAL BOARD: LilyGO TTGO T-SIM A7670G (ESP32 + BUILT-IN HARDWARE) */}
        {/* ========================================================================= */}
        <g id="central-board" transform="translate(485, 140)">
          {/* Board PCB Outline */}
          <rect
            x="0"
            y="0"
            width="430"
            height="700"
            rx="18"
            fill="url(#pcbGrad)"
            stroke="#38bdf8"
            strokeWidth="2"
            filter="drop-shadow(0 20px 40px rgba(0,0,0,0.85))"
          />

          {/* Top Silkscreen Badges from user photo: [HF] [Pb] [2537] PY1 */}
          <g transform="translate(145, 15)">
            <rect x="0" y="0" width="140" height="28" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <text x="14" y="18" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="bold">
              HF
            </text>
            <text x="38" y="18" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="bold">
              Pb
            </text>
            <rect x="52" y="4" width="34" height="20" rx="2" fill="#0f172a" />
            <text x="69" y="18" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              2537
            </text>
            <text x="105" y="18" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">
              ⚡⚠
            </text>
            <text x="125" y="18" textAnchor="middle" fill="#cbd5e1" fontSize="8">
              🗑
            </text>
          </g>

          {/* Model Silk text */}
          <g transform="translate(215, 62)" textAnchor="middle">
            <text fill="#f8fafc" fontSize="16" fontWeight="900" letterSpacing="2">
              PY1 &bull; LILYGO® T-SIM
            </text>
            <text y="16" fill="#38bdf8" fontSize="11.5" fontWeight="700">
              A7670G LTE + ESP32 (BUILT-IN GPS &amp; BATTERY)
            </text>
          </g>

          {/* BUILT-IN 1: 18650 Battery Holder */}
          <g
            transform="translate(135, 100)"
            className="cursor-pointer"
            onClick={() => onSelectSensor(SENSORS.find((s) => s.id === 'builtin_battery') || null)}
          >
            <rect
              x="0"
              y="0"
              width="160"
              height="355"
              rx="12"
              fill="url(#batteryHolderGrad)"
              stroke="#475569"
              strokeWidth="2"
            />
            <rect x="18" y="18" width="124" height="319" rx="8" fill="#030712" stroke="#334155" />

            {/* Top Gold Spring Leaf Clip */}
            <rect x="45" y="8" width="70" height="22" rx="3" fill="url(#goldPad)" stroke="#78350f" strokeWidth="1" />
            <path d="M 60 18 L 80 26 L 100 18" fill="none" stroke="#78350f" strokeWidth="1.5" />

            {/* Bottom Contact */}
            <rect x="55" y="325" width="50" height="12" rx="2" fill="#cbd5e1" />

            <g transform="translate(80, 175)" textAnchor="middle">
              <text fill="#059669" fontSize="14" fontWeight="900" letterSpacing="1">
                BUILT-IN 18650
              </text>
              <text y="18" fill="#10b981" fontSize="11" fontWeight="bold">
                BATTERY SLOT (PY1)
              </text>
              <text y="34" fill="#94a3b8" fontSize="8.5">
                3.7V Li-ion Rechargeable
              </text>
              <text y="48" fill="#e11d48" fontSize="8" fontFamily="monospace">
                Monitored on IO35 (ADC)
              </text>
            </g>
          </g>

          {/* BUILT-IN 2: Quectel GPS Module */}
          <g
            transform="translate(230, 470)"
            className="cursor-pointer"
            onClick={() => onSelectSensor(SENSORS.find((s) => s.id === 'builtin_gps') || null)}
          >
            <rect x="0" y="0" width="140" height="110" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
            <rect x="10" y="10" width="55" height="55" rx="4" fill="url(#shieldGrad)" stroke="#cbd5e1" />
            <text x="37" y="38" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">
              QUECTEL
            </text>
            <text x="37" y="50" textAnchor="middle" fill="#1e293b" fontSize="7.5" fontWeight="bold">
              GPS
            </text>

            <circle cx="100" cy="37" r="15" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <text x="100" y="40" textAnchor="middle" fill="#334155" fontSize="7" fontWeight="bold">
              RTC BAT
            </text>

            <circle cx="100" cy="80" r="7" fill="url(#goldPad)" stroke="#78350f" />
            <circle cx="100" cy="80" r="3" fill="#0f172a" />
            <text x="100" y="96" textAnchor="middle" fill="#c7d2fe" fontSize="7">
              GPS ANT
            </text>

            <text x="70" y="102" textAnchor="middle" fill="#818cf8" fontSize="8" fontWeight="bold">
              BUILT-IN GPS (IO21/22)
            </text>
          </g>

          {/* BUILT-IN 3: SIMCOM A7670G Cellular Modem */}
          <g
            transform="translate(60, 470)"
            className="cursor-pointer"
            onClick={() => onSelectSensor(SENSORS.find((s) => s.id === 'builtin_modem') || null)}
          >
            <rect x="0" y="0" width="155" height="110" rx="6" fill="#0c4a6e" stroke="#0284c7" strokeWidth="1.5" />
            <text x="77" y="24" textAnchor="middle" fill="#f0f9ff" fontSize="11" fontWeight="bold">
              SIMCOM A7670G
            </text>
            <text x="77" y="38" textAnchor="middle" fill="#bae6fd" fontSize="8.5">
              LTE Cat-1 Cellular Modem
            </text>
            <text x="77" y="52" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontFamily="monospace">
              UART: IO26/27 &bull; PWR: IO4
            </text>

            <circle cx="35" cy="80" r="7" fill="url(#goldPad)" stroke="#78350f" />
            <text x="35" y="96" textAnchor="middle" fill="#bae6fd" fontSize="7">
              LTE ANT
            </text>

            <rect x="75" y="68" width="65" height="24" rx="2" fill="#1e293b" stroke="#475569" />
            <text x="107" y="83" textAnchor="middle" fill="#cbd5e1" fontSize="7.5" fontWeight="bold">
              NANO SIM
            </text>
          </g>

          {/* Bottom Area: Power Switch & USB-C */}
          <g transform="translate(60, 605)">
            <rect x="0" y="0" width="85" height="35" rx="3" fill="#1e293b" stroke="#64748b" />
            <rect x="10" y="6" width="26" height="23" rx="2" fill="#e2e8f0" stroke="#0f172a" />
            <text x="54" y="16" fill="#94a3b8" fontSize="7" fontWeight="bold">
              IN G
            </text>
            <text x="54" y="28" fill="#38bdf8" fontSize="7" fontWeight="bold">
              PWR ON
            </text>
          </g>

          {/* USB-C */}
          <g transform="translate(170, 640)">
            <rect x="0" y="0" width="90" height="46" rx="6" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <rect x="15" y="10" width="60" height="26" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
            <text x="45" y="52" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">
              USB-C (VBUS)
            </text>
          </g>

          {/* ========================================================================= */}
          {/* LEFT HEADER (15 PINS - MATCHING PHOTO EXACTLY) */}
          {/* ========================================================================= */}
          <g id="left-header-bar" transform="translate(40, 115)">
            <rect x="-14" y="-12" width="48" height="540" rx="5" fill="#020617" stroke="#334155" strokeWidth="1.5" />
            <text x="10" y="-18" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="900">
              LEFT HEADER
            </text>

            {LEFT_HEADER_PINS.map((pin, i) => {
              const py = i * 34.5;
              const isUsed = pin.isUsedInProject;
              const isHighlighted = selectedPinId === pin.id || hoveredPin === pin.id;

              return (
                <g
                  key={pin.id}
                  transform={`translate(10, ${py})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPin(pin);
                  }}
                  onMouseEnter={() => setHoveredPin(pin.id)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  <rect
                    x="-18"
                    y="-11"
                    width="36"
                    height="22"
                    rx="3"
                    fill={isHighlighted ? '#38bdf8' : isUsed ? '#ca8a04' : '#1e293b'}
                    stroke={isHighlighted ? '#ffffff' : '#475569'}
                    strokeWidth={isHighlighted ? 2 : 1}
                  />
                  <circle cx="0" cy="0" r="4.5" fill={isUsed ? '#fef08a' : '#0f172a'} stroke="#78350f" strokeWidth="0.8" />

                  <text
                    x="25"
                    y="4"
                    fill={isHighlighted ? '#38bdf8' : isUsed ? '#f8fafc' : '#64748b'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight={isUsed ? 'bold' : 'normal'}
                  >
                    {pin.label}
                  </text>

                  <text x="-23" y="4" textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                    {pin.pinNumber}
                  </text>

                  {isUsed && (
                    <circle
                      cx="0"
                      cy="0"
                      r="6.5"
                      fill="none"
                      stroke={isHighlighted ? '#38bdf8' : '#10b981'}
                      strokeWidth="1.5"
                      opacity={0.8}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* RIGHT HEADER (16 PINS - V3V3 PIN 1 & GND PIN 2 ON TOP FOR ALL SENSORS!) */}
          {/* ========================================================================= */}
          <g id="right-header-bar" transform="translate(390, 115)">
            <rect x="-34" y="-12" width="48" height="540" rx="5" fill="#020617" stroke="#334155" strokeWidth="1.5" />
            <text x="-10" y="-18" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="900">
              RIGHT HEADER
            </text>

            {RIGHT_HEADER_PINS.map((pin, i) => {
              const py = i * 32.5;
              const isUsed = pin.isUsedInProject;
              const isPower = pin.id === 'right-1';
              const isGnd = pin.id === 'right-2';
              const isHighlighted = selectedPinId === pin.id || hoveredPin === pin.id;

              return (
                <g
                  key={pin.id}
                  transform={`translate(-10, ${py})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPin(pin);
                  }}
                  onMouseEnter={() => setHoveredPin(pin.id)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  <rect
                    x="-18"
                    y="-10"
                    width="36"
                    height="20"
                    rx="3"
                    fill={
                      isHighlighted
                        ? '#38bdf8'
                        : isPower
                        ? '#dc2626'
                        : isGnd
                        ? '#334155'
                        : isUsed
                        ? '#ca8a04'
                        : '#1e293b'
                    }
                    stroke={
                      isHighlighted
                        ? '#ffffff'
                        : isPower
                        ? '#f87171'
                        : isGnd
                        ? '#94a3b8'
                        : '#475569'
                    }
                    strokeWidth={isHighlighted || isPower || isGnd ? 2 : 1}
                  />
                  <circle cx="0" cy="0" r="4.5" fill={isUsed ? '#fef08a' : '#0f172a'} stroke="#78350f" strokeWidth="0.8" />

                  <text
                    x="-25"
                    y="4"
                    textAnchor="end"
                    fill={
                      isHighlighted
                        ? '#38bdf8'
                        : isPower
                        ? '#fca5a5'
                        : isGnd
                        ? '#e2e8f0'
                        : isUsed
                        ? '#f8fafc'
                        : '#64748b'
                    }
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight={isUsed || isPower || isGnd ? 'bold' : 'normal'}
                  >
                    {pin.label}
                  </text>

                  <text x="23" y="4" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                    {pin.pinNumber}
                  </text>

                  {isUsed && (
                    <circle
                      cx="0"
                      cy="0"
                      r="6.5"
                      fill="none"
                      stroke={isHighlighted ? '#38bdf8' : isPower ? '#ef4444' : isGnd ? '#94a3b8' : '#10b981'}
                      strokeWidth="1.5"
                      opacity={0.9}
                    />
                  )}
                </g>
              );
            })}
          </g>
        </g>

        {/* ========================================================================= */}
        {/* PHYSICAL WIRES CONNECTING TO RIGHT HEADER V3V3 & GND */}
        {/* ========================================================================= */}
        <g id="wires-layer">
          {WIRE_CONNECTIONS.map((wire) => {
            const isVisible = isWireVisible(wire);
            if (!isVisible) return null;

            const isHighlighted = isWireHighlighted(wire.id);
            const isSelected = selectedWireId === wire.id;
            const inFocus = isWireInActiveFocus(wire);

            const p1 = getSensorPinCoords(wire.sourceSensorId, wire.sourcePinName);
            const p2 = getBoardPinCoords(wire.targetBoardPinId);

            const pathD = createPath(p1, p2, wire.id);

            // Opacity: Dim non-focused sensor wires down to 0.1!
            const wireOpacity = activeFocusSensor ? (inFocus ? 1 : 0.1) : 1;

            return (
              <g
                key={wire.id}
                className="cursor-pointer group transition-opacity duration-300"
                style={{ opacity: wireOpacity }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectWire(wire.id === selectedWireId ? null : wire.id);
                }}
                onMouseEnter={() => setHoveredWire(wire.id)}
                onMouseLeave={() => setHoveredWire(null)}
              >
                {/* Thick Invisible Hitbox */}
                <path d={pathD} fill="none" stroke="transparent" strokeWidth="18" />

                {/* Wire Shadow / Glowing background */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHighlighted || isSelected ? wire.color : '#000000'}
                  strokeWidth={isHighlighted || isSelected ? 8 : 3.5}
                  strokeOpacity={isHighlighted || isSelected ? 0.8 : 0.4}
                  filter={isHighlighted || isSelected ? 'url(#strongGlow)' : undefined}
                />

                {/* Main Physical Wire Core */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={wire.color}
                  strokeWidth={isHighlighted || isSelected ? 4 : 2.5}
                  strokeLinecap="round"
                />

                {/* Animated Electrical Current Flow */}
                {showAnimations && inFocus && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={isHighlighted || isSelected ? 3 : 1.8}
                    strokeDasharray="6,18"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="48"
                      to="0"
                      dur={wire.signalType === 'i2c' ? '0.8s' : '1.8s'}
                      repeatCount="indefinite"
                    />
                  </path>
                )}

                {/* Connection Nodes */}
                <circle cx={p1.x} cy={p1.y} r={isHighlighted ? 5.5 : 4} fill={wire.color} stroke="#ffffff" strokeWidth="1.2" />
                <circle cx={p2.x} cy={p2.y} r={isHighlighted ? 5.5 : 4} fill={wire.color} stroke="#ffffff" strokeWidth="1.2" />

                {/* Wire Badge */}
                {(isHighlighted || isSelected || showVoltages) && inFocus && (
                  <g transform={`translate(${(p1.x + p2.x) / 2}, ${(p1.y + p2.y) / 2})`}>
                    <rect
                      x="-70"
                      y="-12"
                      width="140"
                      height="24"
                      rx="6"
                      fill="#020617"
                      stroke={wire.color}
                      strokeWidth="1.5"
                      filter="url(#glow)"
                    />
                    <text x="0" y="3.5" textAnchor="middle" fill="#f8fafc" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {wire.signalName}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ========================================================================= */}
          {/* HIGH-FIDELITY AXIAL 10kΩ PULL-UP RESISTOR BRIDGING RIGHT PIN 5 (IO34) TO PIN 1 (V3V3) */}
          {/* ========================================================================= */}
          <g
            id="visible-10k-resistor-assembly"
            className="cursor-pointer transition-opacity duration-300"
            style={{ opacity: resistorOpacity }}
            onMouseEnter={() => setHoveredResistor(true)}
            onMouseLeave={() => setHoveredResistor(false)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectWire(selectedWireId === 'resistor-10k' ? null : 'resistor-10k');
            }}
          >
            {/* Top Connecting Wire: Resistor Top Lead ➔ Right Header Pin 1 (V3V3 at X=875, Y=255) */}
            <path
              d="M 955 295 L 955 255 L 875 255"
              fill="none"
              stroke="#ef4444"
              strokeWidth={isResistorActive ? 3.5 : 2.5}
              strokeLinecap="round"
              filter={isResistorActive ? 'url(#glow)' : undefined}
            />
            {/* Red Junction Node at Right Header Pin 1 (V3V3) */}
            <circle cx="875" cy="255" r="5.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

            {/* Bottom Connecting Wire: Resistor Bottom Lead ➔ Right Header Pin 5 (IO34 at X=875, Y=385) */}
            <path
              d="M 955 355 L 955 385 L 875 385"
              fill="none"
              stroke="#f97316"
              strokeWidth={isResistorActive ? 3.5 : 2.5}
              strokeLinecap="round"
              filter={isResistorActive ? 'url(#glow)' : undefined}
            />
            {/* Orange Junction Node at Right Header Pin 5 (IO34) */}
            <circle cx="875" cy="385" r="5.5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />

            {/* Top Metallic Lead */}
            <line x1="955" y1="280" x2="955" y2="295" stroke="url(#metalLeadGrad)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Bottom Metallic Lead */}
            <line x1="955" y1="355" x2="955" y2="370" stroke="url(#metalLeadGrad)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Resistor Ceramic Body (Vertical Axial Package) */}
            <g transform="translate(941, 295)">
              {/* Main Body */}
              <rect
                x="0"
                y="0"
                width="28"
                height="60"
                rx="9"
                fill="url(#resistorBodyGrad)"
                stroke={isResistorActive ? '#f97316' : '#8c5e34'}
                strokeWidth={isResistorActive ? 2 : 1.2}
                filter="drop-shadow(0 4px 10px rgba(0,0,0,0.8))"
              />

              {/* Specular Highlight */}
              <rect x="4" y="2" width="4" height="56" rx="2" fill="#ffffff" opacity="0.35" />

              {/* 4-Band Color Code */}
              {/* Band 1: Brown (1) */}
              <rect x="0" y="9" width="28" height="5" fill="#78350f" />
              <rect x="4" y="9" width="4" height="5" fill="#ffffff" opacity="0.3" />

              {/* Band 2: Black (0) */}
              <rect x="0" y="19" width="28" height="5" fill="#09090b" />
              <rect x="4" y="19" width="4" height="5" fill="#ffffff" opacity="0.2" />

              {/* Band 3: Orange (x1k) */}
              <rect x="0" y="30" width="28" height="5" fill="#ea580c" />
              <rect x="4" y="30" width="4" height="5" fill="#ffffff" opacity="0.3" />

              {/* Band 4: Gold (±5%) */}
              <rect x="0" y="45" width="28" height="4.5" fill="#ca8a04" />
              <rect x="4" y="45" width="4" height="4.5" fill="#ffffff" opacity="0.4" />
            </g>

            {/* Resistor Callout Badge */}
            <g transform="translate(972, 290)">
              <rect
                x="0"
                y="0"
                width="54"
                height="46"
                rx="6"
                fill="#0f172a"
                stroke={isResistorActive ? '#f97316' : '#ea580c'}
                strokeWidth={isResistorActive ? 2 : 1.2}
                filter="url(#glow)"
              />
              <text x="27" y="16" textAnchor="middle" fill="#f8fafc" fontSize="9.5" fontWeight="bold" fontFamily="monospace">
                10 kΩ
              </text>
              <text x="27" y="28" textAnchor="middle" fill="#fed7aa" fontSize="7" fontWeight="600">
                PULL-UP
              </text>
              <text x="27" y="39" textAnchor="middle" fill="#94a3b8" fontSize="6.5">
                IO34 ↔ 3V3
              </text>
            </g>
          </g>

          {/* ========================================================================= */}
          {/* 100 nF (104) 50V CERAMIC CAPACITOR (X7R) BRIDGING RIGHT PIN 5 (IO34) TO PIN 2 (GND) */}
          {/* ========================================================================= */}
          <g
            id="visible-100nf-capacitor-assembly"
            className="cursor-pointer transition-opacity duration-300"
            style={{ opacity: capacitorOpacity }}
            onMouseEnter={() => setHoveredCapacitor(true)}
            onMouseLeave={() => setHoveredCapacitor(false)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectWire(selectedWireId === 'capacitor-100nf' ? null : 'capacitor-100nf');
            }}
          >
            {/* Top Connecting Wire: Capacitor Top Lead ➔ Right Header Pin 2 (GND at X=875, Y=287.5) */}
            <path
              d="M 995 322 L 995 287.5 L 875 287.5"
              fill="none"
              stroke="#64748b"
              strokeWidth={isCapacitorActive ? 3.5 : 2.5}
              strokeLinecap="round"
              filter={isCapacitorActive ? 'url(#glow)' : undefined}
            />
            {/* GND Junction Node at Right Header Pin 2 (GND) */}
            <circle cx="875" cy="287.5" r="5.5" fill="#334155" stroke="#ffffff" strokeWidth="1.5" />

            {/* Bottom Connecting Wire: Capacitor Bottom Lead ➔ Right Header Pin 5 (IO34 at X=875, Y=385) */}
            <path
              d="M 995 362 L 995 385 L 875 385"
              fill="none"
              stroke="#f97316"
              strokeWidth={isCapacitorActive ? 3.5 : 2.5}
              strokeLinecap="round"
              filter={isCapacitorActive ? 'url(#glow)' : undefined}
            />
            {/* Orange Junction Node at Right Header Pin 5 (IO34) */}
            <circle cx="875" cy="385" r="5.5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />

            {/* Metallic Lead Wires */}
            <line x1="995" y1="310" x2="995" y2="326" stroke="url(#metalLeadGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="995" y1="358" x2="995" y2="374" stroke="url(#metalLeadGrad)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Ceramic Disc Capacitor Body */}
            <g transform="translate(995, 342)">
              {/* Disc Shadow & Body */}
              <ellipse
                cx="0"
                cy="0"
                rx="16"
                ry="18"
                fill="url(#ceramicCapGrad)"
                stroke={isCapacitorActive ? '#fbbf24' : '#b45309'}
                strokeWidth={isCapacitorActive ? 2.2 : 1.2}
                filter="drop-shadow(0 4px 10px rgba(0,0,0,0.8))"
              />

              {/* Specular curved highlight */}
              <path
                d="M -10 -8 A 12 14 0 0 1 8 -12"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                opacity="0.5"
                strokeLinecap="round"
              />

              {/* Capacitor Code Markings (104 & 50V) */}
              <text x="0" y="-1" textAnchor="middle" fill="#451a03" fontSize="8.5" fontWeight="900" fontFamily="monospace">
                104
              </text>
              <text x="0" y="9" textAnchor="middle" fill="#78350f" fontSize="6.5" fontWeight="bold" fontFamily="monospace">
                50V
              </text>
            </g>

            {/* Capacitor Callout Badge */}
            <g transform="translate(1020, 342)">
              <rect
                x="0"
                y="0"
                width="64"
                height="46"
                rx="6"
                fill="#0f172a"
                stroke={isCapacitorActive ? '#fbbf24' : '#d97706'}
                strokeWidth={isCapacitorActive ? 2 : 1.2}
                filter="url(#glow)"
              />
              <text x="32" y="15" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold" fontFamily="monospace">
                100 nF
              </text>
              <text x="32" y="27" textAnchor="middle" fill="#fdba74" fontSize="7" fontWeight="600">
                50V X7R (104)
              </text>
              <text x="32" y="38" textAnchor="middle" fill="#94a3b8" fontSize="6.5">
                IO34 ↔ GND
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
