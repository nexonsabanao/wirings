import React, { useState } from 'react';
import { ASSEMBLY_STEPS } from '../data/wiringData';
import { CheckSquare, Square, AlertTriangle, Clock, ChevronRight, ChevronDown, CheckCircle2, RotateCcw, Wrench } from 'lucide-react';

interface AssemblyChecklistProps {
  onSelectFilter: (filter: string) => void;
}

export const AssemblyChecklist: React.FC<AssemblyChecklistProps> = ({ onSelectFilter }) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const toggleItem = (itemId: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleStepExpand = (stepId: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  // Calculate overall progress
  const allChecklistIds = ASSEMBLY_STEPS.flatMap((s) => s.checklist.map((c) => c.id));
  const completedCount = allChecklistIds.filter((id) => completedItems[id]).length;
  const progressPercent = Math.round((completedCount / allChecklistIds.length) * 100);

  const resetAll = () => {
    if (window.confirm('Reset all assembly checklist progress?')) {
      setCompletedItems({});
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Progress Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Wrench size={16} />
            Hardware Build & Wiring Protocol
          </div>
          <h2 className="text-xl font-extrabold text-slate-100">
            LilyGO TTGO T-SIM A7670G Assembly Checklist
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Follow each phase step-by-step to wire power, I²C sensors, ultrasonic water probe, rain gauge, and GPS module safely.
          </p>
        </div>

        {/* Progress Circle & Stats */}
        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 shrink-0">
          <div className="text-center">
            <div className="text-2xl font-black text-cyan-400 font-mono">{progressPercent}%</div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Done</span>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div>
            <div className="text-xs font-medium text-slate-300">
              <span className="text-emerald-400 font-bold">{completedCount}</span> of{' '}
              <span className="font-bold">{allChecklistIds.length}</span> verified
            </div>
            <button
              onClick={resetAll}
              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 mt-1 transition-colors"
            >
              <RotateCcw size={11} /> Reset progress
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step by Step Cards */}
      <div className="space-y-4">
        {ASSEMBLY_STEPS.map((step) => {
          const isExpanded = !!expandedSteps[step.id];
          const stepCheckIds = step.checklist.map((c) => c.id);
          const stepDoneCount = stepCheckIds.filter((id) => completedItems[id]).length;
          const isStepComplete = stepDoneCount === stepCheckIds.length;

          return (
            <div
              key={step.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                isStepComplete
                  ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Step Accordion Header */}
              <div
                onClick={() => toggleStepExpand(step.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-slate-900/90 hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm font-mono shrink-0 transition-colors ${
                      isStepComplete
                        ? 'bg-emerald-500 text-white'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {isStepComplete ? <CheckCircle2 size={18} /> : `0${step.id}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        {step.category}
                      </span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {step.estimatedTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base">{step.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    {stepDoneCount}/{step.checklist.length}
                  </span>
                  {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                </div>
              </div>

              {/* Step Expanded Content */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Checklist Items */}
                  <div className="space-y-2.5">
                    {step.checklist.map((item) => {
                      const isChecked = !!completedItems[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                            isChecked
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0 text-cyan-400">
                            {isChecked ? (
                              <CheckSquare size={18} className="text-emerald-400" />
                            ) : (
                              <Square size={18} className="text-slate-500" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <span
                              className={`text-xs sm:text-sm font-semibold block ${
                                isChecked ? 'line-through text-slate-400' : 'text-slate-100'
                              }`}
                            >
                              {item.text}
                            </span>
                            <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pitfalls & Gotchas */}
                  {step.pitfalls.length > 0 && (
                    <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <AlertTriangle size={15} />
                        Common Assembly Pitfalls for this step
                      </div>
                      <ul className="space-y-1 text-xs text-amber-200/90 list-disc list-inside">
                        {step.pitfalls.map((pitfall, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">
                            {pitfall}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
