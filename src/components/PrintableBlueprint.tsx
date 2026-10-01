import React from 'react';
import { Printer, CheckCircle2, Cpu, Radio, Battery, Droplets, Zap, ShieldAlert } from 'lucide-react';

export const PrintableBlueprint: React.FC = () => {
  const printPage = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-6 print:p-0 print:m-0 print:max-w-full">
      {/* Top Controls Bar (hidden during browser print) */}
      <div className="print:hidden p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Printer size={18} className="text-cyan-400" />
            Hardware Wiring Blueprint (Print-Optimized)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            100% WYSIWYG bench reference sheet formatted for standard A4 / Letter printout.
          </p>
        </div>
        <button
          onClick={printPage}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-600/25 cursor-pointer"
        >
          <Printer size={16} />
          Print / Save PDF
        </button>
      </div>

      {/* Main Blueprint Sheet */}
      <div className="bg-white text-slate-950 p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xl space-y-6 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
        
        {/* ========================================================================= */}
        {/* 1. BLUEPRINT HEADER */}
        {/* ========================================================================= */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 bg-slate-900 text-white rounded">
                  HARDWARE SPECIFICATION
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  REV 5.1 &bull; PY1 PINOUT
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-1.5">
                Flood Alert Sensory System &bull; Wiring Blueprint
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Target Board: <strong className="text-slate-900">LilyGO TTGO T-SIM A7670G (PY1)</strong> &bull; Microcontroller: ESP32-WROVER-E
              </p>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-600 space-y-0.5">
              <div className="font-bold text-slate-900">POWER RAIL: 3.3V DC</div>
              <div>VCC: Right Header Pin 1 (V3V3)</div>
              <div>GND: Right Header Pin 2 (GND)</div>
            </div>
          </div>

          {/* Quick Summary Strip */}
          <div className="mt-3 grid grid-cols-4 gap-2 text-center font-mono text-[10px]">
            <div className="p-1.5 bg-slate-100 rounded border border-slate-200 font-bold text-slate-800">
              Sonar: IO14 (Trig) / IO36 (Echo)
            </div>
            <div className="p-1.5 bg-slate-100 rounded border border-slate-200 font-bold text-slate-800">
              I²C Weather: IO32 (SDA) / IO33 (SCL)
            </div>
            <div className="p-1.5 bg-slate-100 rounded border border-slate-200 font-bold text-slate-800">
              Rain: IO34 (Int) + 10kΩ Pull-Up
            </div>
            <div className="p-1.5 bg-slate-100 rounded border border-slate-200 font-bold text-slate-800">
              Built-in: GPS (21/22) &bull; LTE (26/27)
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SYSTEM ARCHITECTURE & PIN INTERCONNECT TOPOLOGY */}
        {/* ========================================================================= */}
        <div className="space-y-2 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Cpu size={14} className="text-slate-700" />
            1. System Architecture &amp; Pin Interconnect Topology
          </h3>

          {/* High-Contrast Modular Architecture Block */}
          <div className="border border-slate-300 rounded-xl bg-slate-50 p-4 space-y-4">
            
            {/* Top Built-in Hardware Section */}
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                  <Zap size={13} />
                  LilyGO TTGO T-SIM A7670G (PY1) &bull; On-Board Internal Subsystems (No Header Wiring)
                </span>
                <span className="text-[10px] font-mono text-slate-400">ESP32 Core</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[10.5px]">
                <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                  <strong className="text-indigo-300 block mb-0.5">Quectel GPS Module</strong>
                  <div className="text-slate-300 text-[10px] space-y-0.5">
                    <div>TX ➔ GPIO 21 (RX)</div>
                    <div>RX ➔ GPIO 22 (TX)</div>
                    <div>RST ➔ GPIO 5</div>
                  </div>
                </div>
                <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                  <strong className="text-sky-300 block mb-0.5">SIMCOM A7670G LTE</strong>
                  <div className="text-slate-300 text-[10px] space-y-0.5">
                    <div>TX ➔ GPIO 26 | RX ➔ GPIO 27</div>
                    <div>PWR ➔ GPIO 4 | DTR ➔ GPIO 25</div>
                    <div>Power Enable ➔ GPIO 12</div>
                  </div>
                </div>
                <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                  <strong className="text-emerald-300 block mb-0.5">Built-in 18650 Battery</strong>
                  <div className="text-slate-300 text-[10px] space-y-0.5">
                    <div>3.7V Li-ion Battery Holder</div>
                    <div>Voltage Divider ➔ GPIO 35 (ADC)</div>
                    <div>Auto-Recharge via USB-C</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Pin Connections Grid (Left Header vs Right Header) */}
            <div className="grid grid-cols-12 gap-3">
              
              {/* Left Column: Left Header (15 Pins) */}
              <div className="col-span-5 bg-white p-3.5 rounded-lg border border-slate-300 space-y-3">
                <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 uppercase">LEFT HEADER (15-Pin)</span>
                  <span className="text-[10px] font-mono text-slate-500">Left Side</span>
                </div>

                <div className="space-y-2">
                  <div className="p-2 bg-amber-50 border border-amber-300 rounded font-mono text-xs">
                    <div className="font-bold text-amber-900 flex items-center justify-between">
                      <span>Pin 11 &bull; GPIO 36 (SENSOR_VP)</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1 rounded">Input</span>
                    </div>
                    <div className="text-[11px] text-amber-800 mt-1 font-sans">
                      Connects directly to <strong>AJ-SR04T ECHO</strong> pulse return lead.
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                    <strong className="text-slate-800 block text-xs mb-1">AJ-SR04T Sonar Module:</strong>
                    <ul className="list-disc list-inside space-y-0.5 font-mono text-[10.5px]">
                      <li><span className="text-red-600 font-bold">VCC:</span> Right Pin 1 (V3V3)</li>
                      <li><span className="text-slate-800 font-bold">GND:</span> Right Pin 2 (GND)</li>
                      <li><span className="text-emerald-700 font-bold">TRIG:</span> Right Pin 13 (IO14)</li>
                      <li><span className="text-amber-700 font-bold">ECHO:</span> Left Pin 11 (IO36)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Right Header (16 Pins) */}
              <div className="col-span-7 bg-white p-3.5 rounded-lg border border-slate-300 space-y-3">
                <div className="border-b border-slate-200 pb-1.5 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 uppercase">RIGHT HEADER (16-Pin)</span>
                  <span className="text-[10px] font-mono text-slate-500">Right Side</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {/* Pin 1 & Pin 2 Power Rails */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-red-50 border border-red-300 rounded">
                      <div className="font-bold text-red-900 text-[11px]">Pin 1 &bull; V3V3 (3.3V Out)</div>
                      <div className="text-[10px] text-red-800 font-sans mt-0.5">
                        Main 3.3V rail: Powers all 4 sensors &amp; 10kΩ pull-up.
                      </div>
                    </div>
                    <div className="p-2 bg-slate-100 border border-slate-300 rounded">
                      <div className="font-bold text-slate-900 text-[11px]">Pin 2 &bull; GND (Ground)</div>
                      <div className="text-[10px] text-slate-700 font-sans mt-0.5">
                        Common 0V ground return for all 4 external sensors.
                      </div>
                    </div>
                  </div>

                  {/* Pin 3 & Pin 4 I2C Bus */}
                  <div className="p-2 bg-purple-50 border border-purple-300 rounded">
                    <div className="font-bold text-purple-900 text-[11px] flex justify-between">
                      <span>Pin 3: GPIO 32 (SDA) &bull; Pin 4: GPIO 33 (SCL)</span>
                      <span className="text-[10px] bg-purple-200 text-purple-900 px-1 rounded">I²C Bus</span>
                    </div>
                    <div className="text-[10.5px] text-purple-800 font-sans mt-1">
                      Shared 2-wire bus for <strong>BME280 (0x76)</strong> and <strong>BH1750 (0x23)</strong>. (BH1750 ADDR pin is left unconnected/floating).
                    </div>
                  </div>

                  {/* Pin 5 Rain + 10k resistor */}
                  <div className="p-2 bg-amber-50 border border-amber-300 rounded">
                    <div className="font-bold text-amber-900 text-[11px] flex justify-between">
                      <span>Pin 5 &bull; GPIO 34 (RAIN INT)</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1 rounded">Input + 10kΩ</span>
                    </div>
                    <div className="text-[10.5px] text-amber-900 font-sans mt-1">
                      Connects to <strong>YELLOW</strong> signal wire from Tipping Bucket. ⚠️ <strong>10kΩ Resistor</strong> must bridge Pin 5 (IO34) to Pin 1 (V3V3).
                    </div>
                  </div>

                  {/* Pin 13 Ultrasonic Trig */}
                  <div className="p-2 bg-emerald-50 border border-emerald-300 rounded">
                    <div className="font-bold text-emerald-900 text-[11px] flex justify-between">
                      <span>Pin 13 &bull; GPIO 14 (US TRIG)</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded">Output</span>
                    </div>
                    <div className="text-[10.5px] text-emerald-800 font-sans mt-0.5">
                      Outputs 10 µs ping trigger pulse to <strong>AJ-SR04T TRIG</strong> lead.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MASTER PIN ALLOCATION TABLE */}
        {/* ========================================================================= */}
        <div className="space-y-2 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Radio size={14} className="text-slate-700" />
            2. Complete Header Pin Allocation &amp; Direction Table
          </h3>
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-900">
                <th className="p-2 border-r border-slate-300">Signal</th>
                <th className="p-2 border-r border-slate-300">Header &amp; Pin</th>
                <th className="p-2 border-r border-slate-300">GPIO</th>
                <th className="p-2 border-r border-slate-300">Direction</th>
                <th className="p-2 border-r border-slate-300">Voltage</th>
                <th className="p-2">Target Peripheral / Wiring Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              <tr className="bg-red-50/70">
                <td className="p-1.5 font-bold border-r border-slate-200 text-red-900">V3V3</td>
                <td className="p-1.5 border-r border-slate-200 font-bold text-red-700">Right #1</td>
                <td className="p-1.5 border-r border-slate-200 text-slate-500">—</td>
                <td className="p-1.5 border-r border-slate-200 font-bold">Power Out</td>
                <td className="p-1.5 border-r border-slate-200 font-bold text-red-700">3.3V</td>
                <td className="p-1.5 font-sans font-bold text-red-950">MAIN 3.3V RAIL: Powers AJ-SR04T VCC, BME280 VCC, BH1750 VCC, Rain Gauge VCC &amp; 10kΩ pull-up</td>
              </tr>
              <tr className="bg-slate-100/80">
                <td className="p-1.5 font-bold border-r border-slate-200 text-slate-900">GND</td>
                <td className="p-1.5 border-r border-slate-200 font-bold text-slate-800">Right #2</td>
                <td className="p-1.5 border-r border-slate-200 text-slate-500">—</td>
                <td className="p-1.5 border-r border-slate-200 font-bold">Ground</td>
                <td className="p-1.5 border-r border-slate-200">0V</td>
                <td className="p-1.5 font-sans font-bold text-slate-900">COMMON GROUND: Common ground return for AJ-SR04T, BME280, BH1750, Rain Gauge</td>
              </tr>
              <tr>
                <td className="p-1.5 font-bold border-r border-slate-200">I2C_SDA</td>
                <td className="p-1.5 border-r border-slate-200">Right #3</td>
                <td className="p-1.5 border-r border-slate-200 font-bold">32</td>
                <td className="p-1.5 border-r border-slate-200">Bidirectional</td>
                <td className="p-1.5 border-r border-slate-200">3.3V</td>
                <td className="p-1.5 font-sans">Shared I²C Data line (BME280 0x76 &amp; BH1750 0x23)</td>
              </tr>
              <tr>
                <td className="p-1.5 font-bold border-r border-slate-200">I2C_SCL</td>
                <td className="p-1.5 border-r border-slate-200">Right #4</td>
                <td className="p-1.5 border-r border-slate-200 font-bold">33</td>
                <td className="p-1.5 border-r border-slate-200">Output (Clock)</td>
                <td className="p-1.5 border-r border-slate-200">3.3V</td>
                <td className="p-1.5 font-sans">Shared I²C Clock line (BME280 &amp; BH1750)</td>
              </tr>
              <tr className="bg-amber-50/70">
                <td className="p-1.5 font-bold border-r border-slate-200 text-amber-900">RAIN_GAUGE</td>
                <td className="p-1.5 border-r border-slate-200 font-bold text-amber-800">Right #5</td>
                <td className="p-1.5 border-r border-slate-200 font-bold text-amber-900">34</td>
                <td className="p-1.5 border-r border-slate-200 font-bold">Input (INT)</td>
                <td className="p-1.5 border-r border-slate-200">3.3V Max</td>
                <td className="p-1.5 font-sans font-bold text-amber-950">Rain Gauge YELLOW wire. ⚠️ MUST install 10kΩ resistor bridging IO34 (Right #5) to V3V3 (Right #1)</td>
              </tr>
              <tr>
                <td className="p-1.5 font-bold border-r border-slate-200">ULTRASONIC_TRIG</td>
                <td className="p-1.5 border-r border-slate-200">Right #13</td>
                <td className="p-1.5 border-r border-slate-200 font-bold">14</td>
                <td className="p-1.5 border-r border-slate-200">Output</td>
                <td className="p-1.5 border-r border-slate-200">3.3V</td>
                <td className="p-1.5 font-sans">AJ-SR04T Sonar TRIG pin (10 µs trigger pulse)</td>
              </tr>
              <tr>
                <td className="p-1.5 font-bold border-r border-slate-200">ULTRASONIC_ECHO</td>
                <td className="p-1.5 border-r border-slate-200">Left #11</td>
                <td className="p-1.5 border-r border-slate-200 font-bold">36</td>
                <td className="p-1.5 border-r border-slate-200">Input</td>
                <td className="p-1.5 border-r border-slate-200">3.3V Max</td>
                <td className="p-1.5 font-sans">AJ-SR04T Sonar ECHO pulse return (Input-only GPIO 36)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ========================================================================= */}
        {/* 4. PERIPHERAL CONNECTION SUMMARY CARDS */}
        {/* ========================================================================= */}
        <div className="space-y-2 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Droplets size={14} className="text-slate-700" />
            3. Peripheral Wiring &amp; Color Map
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Ultrasonic */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-1.5">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex justify-between">
                <span>AJ-SR04T Waterproof Sonar</span>
                <span className="font-mono text-[10px] text-emerald-700">3.3V logic</span>
              </div>
              <div className="font-mono text-[10.5px] space-y-0.5">
                <div><span className="text-red-600 font-bold">VCC (Red):</span> Right Pin 1 (V3V3)</div>
                <div><span className="text-slate-700 font-bold">GND (Black):</span> Right Pin 2 (GND)</div>
                <div><span className="text-emerald-600 font-bold">TRIG (Green):</span> Right Pin 13 (IO14)</div>
                <div><span className="text-amber-600 font-bold">ECHO (Orange):</span> Left Pin 11 (IO36)</div>
              </div>
            </div>

            {/* BME280 */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-1.5">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex justify-between">
                <span>BME280 Weather Sensor</span>
                <span className="font-mono text-[10px] text-purple-700">I²C 0x76</span>
              </div>
              <div className="font-mono text-[10.5px] space-y-0.5">
                <div><span className="text-red-600 font-bold">VIN (Red):</span> Right Pin 1 (V3V3)</div>
                <div><span className="text-slate-700 font-bold">GND (Black):</span> Right Pin 2 (GND)</div>
                <div><span className="text-yellow-600 font-bold">SCL (Yellow):</span> Right Pin 4 (IO33)</div>
                <div><span className="text-cyan-600 font-bold">SDA (Cyan):</span> Right Pin 3 (IO32)</div>
              </div>
            </div>

            {/* BH1750 */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-1.5">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex justify-between">
                <span>BH1750 Ambient Light Sensor</span>
                <span className="font-mono text-[10px] text-blue-700">I²C 0x23</span>
              </div>
              <div className="font-mono text-[10.5px] space-y-0.5">
                <div><span className="text-red-600 font-bold">VCC (Red):</span> Right Pin 1 (V3V3)</div>
                <div><span className="text-slate-700 font-bold">GND (Black):</span> Right Pin 2 (GND)</div>
                <div><span className="text-yellow-600 font-bold">SCL (Yellow):</span> Right Pin 4 (IO33)</div>
                <div><span className="text-cyan-600 font-bold">SDA (Cyan):</span> Right Pin 3 (IO32)</div>
                <div className="text-slate-500 italic text-[10px]">ADDR Pin: Floating / Unconnected (0x23)</div>
              </div>
            </div>

            {/* Rain Gauge */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-1.5">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex justify-between">
                <span>Tipping Bucket Rain Gauge</span>
                <span className="font-mono text-[10px] text-amber-700">3-Wire + 10kΩ</span>
              </div>
              <div className="font-mono text-[10.5px] space-y-0.5">
                <div><span className="text-yellow-600 font-bold">YELLOW (Signal):</span> Right Pin 5 (IO34)</div>
                <div><span className="text-red-600 font-bold">VCC (Red):</span> Right Pin 1 (V3V3)</div>
                <div><span className="text-slate-700 font-bold">GND (Black):</span> Right Pin 2 (GND)</div>
                <div className="text-red-700 font-bold text-[10px]">⚠️ 10kΩ Resistor bridged: IO34 ↔ V3V3</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. MANDATORY ASSEMBLY & QA RULES */}
        {/* ========================================================================= */}
        <div className="space-y-2 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-700" />
            4. Mandatory Hardware Assembly Guidelines
          </h3>
          <ol className="list-decimal list-inside text-xs space-y-1.5 text-slate-800 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-lg">
            <li>
              <strong>Single 3.3V Power Rail:</strong> Wire all sensor power leads directly to <strong>Right Header Pin 1 (V3V3)</strong> and all ground leads to <strong>Right Header Pin 2 (GND)</strong>. Never connect external 5V to the sensor headers.
            </li>
            <li>
              <strong>Rain Gauge 10kΩ Pull-Up:</strong> Solder a 10 kΩ resistor bridging <strong>Right Pin 5 (IO34)</strong> and <strong>Right Pin 1 (V3V3)</strong>. ESP32 GPIO 34 is input-only and has NO internal pull-up!
            </li>
            <li>
              <strong>Ultrasonic Sensor 25cm Blind Zone:</strong> Mount the waterproof sonar transducer at least 25 cm above the maximum anticipated flood water surface.
            </li>
            <li>
              <strong>Built-In Board Hardware:</strong> The Quectel GPS receiver (IO21/22), SIMCOM A7670G LTE cellular modem (IO26/27), and onboard 18650 battery holder (IO35) are integrated directly on the PCB and require no header jumper wires.
            </li>
          </ol>
        </div>

      </div>
    </div>
  );
};
