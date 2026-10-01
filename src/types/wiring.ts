export type SignalType = 'power' | 'ground' | 'i2c' | 'uart' | 'gpio_in' | 'gpio_out' | 'analog' | 'internal';

export interface BoardPin {
  id: string;
  pinNumber: number; // 1 to 15 (left) or 1 to 16 (right)
  header: 'left' | 'right';
  label: string;
  gpio?: number;
  alternateNames?: string[];
  type: SignalType;
  voltage: string;
  description: string;
  connectedTo?: string;
  warning?: string;
  isUsedInProject: boolean;
  codeDefine?: string;
  isSinglePowerGnd?: boolean;
}

export interface SensorPin {
  id: string;
  name: string;
  label: string;
  type: SignalType;
  voltage: string;
  connectedToBoardPin: string;
  color: string;
  notes?: string;
}

export interface SensorModule {
  id: string;
  name: string;
  category: 'water_level' | 'environmental' | 'precipitation' | 'builtin_gps' | 'builtin_modem' | 'builtin_battery';
  isBuiltIn?: boolean;
  description: string;
  location: 'top-left' | 'top-right' | 'bottom-right' | 'board-builtin';
  pins: SensorPin[];
  operatingVoltage: string;
  interfaceType: string;
  addressOrProtocol?: string;
  notes: string[];
  criticalWarnings?: string[];
  firmwareDefines: { name: string; value: string; desc: string }[];
  accentColor: string;
}

export interface WireConnection {
  id: string;
  sourceSensorId: string;
  sourcePinName: string;
  targetBoardPinId: string;
  targetPinLabel: string;
  color: string;
  colorName: string;
  signalName: string;
  signalType: SignalType;
  voltage: string;
  description: string;
  isCritical?: boolean;
  codeDefine?: string;
  isBusLine?: boolean;
}

export interface AssemblyStep {
  id: number;
  title: string;
  category: string;
  estimatedTime: string;
  description: string;
  checklist: {
    id: string;
    text: string;
    detail: string;
    targetWireIds?: string[];
  }[];
  pitfalls: string[];
}
