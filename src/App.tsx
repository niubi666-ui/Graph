/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileUp, 
  Edit3, 
  Settings, 
  Shuffle, 
  Layers, 
  Camera, 
  Trash2, 
  List, 
  FolderTree, 
  MessageSquare,
  MoveLeft,
  MoveRight,
  MoveUp,
  MoveDown,
  Plus,
  Minus,
  Maximize,
  Search,
  ChevronDown,
  Activity,
  Database,
  Box,
  Clock,
  Monitor,
  PanelLeft,
  PanelRight,
  X,
  Sliders,
  Check,
  Info,
  Save,
  RefreshCcw,
  LayoutGrid
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data for the chart
const generateMockData = () => {
  const data = [];
  for (let i = 0; i <= 100; i += 2) {
    data.push({
      freq: i,
      vX: Math.sin(i / 10) * 100 + Math.random() * 20 + 200,
      vY: Math.cos(i / 15) * 80 + Math.random() * 15 + 150,
      transX: Math.exp(i / 50) * 10 + Math.random() * 5,
      rotZ: Math.log10(i + 1) * 50 + Math.random() * 10,
    });
  }
  return data;
};

const MOCK_DATA = generateMockData();

const ToolbarButton = ({ icon: Icon, label, onClick, danger = false, active = false }: { icon: any, label: string, onClick?: () => void, danger?: boolean, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 p-2 transition-all duration-200 rounded-lg group min-w-[64px]",
      active ? "bg-emerald-500/10 text-emerald-400" : "hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400",
      danger && "hover:bg-red-500/10 text-zinc-400 hover:text-red-400"
    )}
  >
    <Icon size={20} className={cn("transition-transform group-hover:-translate-y-0.5", active && "scale-110")} />
    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 group-hover:opacity-100">{label}</span>
  </button>
);

const Modal = ({ isOpen, onClose, title, children, icon: Icon }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, icon: any }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Icon size={20} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-white tracking-tight">{title}</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-900/30">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
            <button className="px-6 py-2 text-sm font-bold bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
              Apply Changes
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeCurve, setActiveCurve] = useState<string | null>('vX');
  const [isModelTreeExpanded, setIsModelTreeExpanded] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const curves = [
    { id: 'vX', name: 'c1: X-velocity/Value', color: '#10b981' },
    { id: 'vY', name: 'c2: Y-velocity/Value', color: '#3b82f6' },
    { id: 'transX', name: 'c3: 7012/Translational Direction-X(tx)', color: '#f43f5e' },
    { id: 'rotZ', name: 'c4: 7012/Rotational Direction-Z(rz)', color: '#a855f7' },
  ];

  const renderModalContent = () => {
    switch (activeModal) {
      case 'Edit':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Curve Transformation</label>
                <div className="space-y-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Scale Factor</span>
                      <span className="text-emerald-400 font-mono">1.0x</span>
                    </div>
                    <input type="range" className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Offset (Y)</span>
                      <span className="text-emerald-400 font-mono">0.00</span>
                    </div>
                    <input type="range" className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Smoothing</label>
                <div className="space-y-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-xs text-zinc-300">Enable Low-pass Filter</span>
                    <div className="w-8 h-4 bg-emerald-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Window Size</span>
                      <span className="text-emerald-400 font-mono">5 pts</span>
                    </div>
                    <input type="range" className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex gap-3">
              <Info size={18} className="text-emerald-400 shrink-0" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                Editing a curve will create a virtual copy in the current view. Original data remains untouched in the source file.
              </p>
            </div>
          </div>
        );
      case 'Define':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Curve Metadata Definition</label>
              <div className="overflow-hidden border border-zinc-800 rounded-xl bg-zinc-950/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/80 text-zinc-500 uppercase tracking-tighter">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Property</th>
                      <th className="px-4 py-3 font-semibold">Value</th>
                      <th className="px-4 py-3 font-semibold">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {[
                      { p: 'X-Axis Type', v: 'Frequency', u: 'Hz' },
                      { p: 'Y-Axis Type', v: 'Acceleration', u: 'm/s²' },
                      { p: 'Data Source', v: 'Simulation_R01', u: '-' },
                      { p: 'Sampling Rate', v: '1024', u: 'pts' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3 text-zinc-400">{row.p}</td>
                        <td className="px-4 py-3 font-mono text-emerald-400">{row.v}</td>
                        <td className="px-4 py-3 text-zinc-500">{row.u}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Global Settings</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-emerald-500 bg-emerald-500/20 flex items-center justify-center">
                    <Check size={10} className="text-emerald-400" />
                  </div>
                  <span className="text-xs text-zinc-300">Auto-detect units from header</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Export Format</span>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded p-1 text-xs text-zinc-300">
                  <option>CSV (Comma Separated)</option>
                  <option>JSON Analytics</option>
                  <option>MATLAB Data</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'Compare':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select Datasets to Compare</label>
              <button className="text-[10px] text-emerald-400 hover:underline">Add External File</button>
            </div>
            <div className="space-y-2">
              {[
                { name: 'DAISY_NJ_DEV_08 (Current)', date: '2024-03-04', active: true },
                { name: 'DAISY_NJ_DEV_07 (Baseline)', date: '2024-02-28', active: false },
                { name: 'DAISY_NJ_DEV_06 (Legacy)', date: '2024-02-15', active: false },
              ].map((ds, i) => (
                <div key={i} className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                  ds.active ? "bg-emerald-500/5 border-emerald-500/30" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center border", ds.active ? "bg-emerald-500 border-emerald-500" : "border-zinc-700")}>
                      {ds.active && <Check size={12} className="text-black" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium text-white">{ds.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{ds.date}</div>
                    </div>
                  </div>
                  <LayoutGrid size={16} className="text-zinc-600" />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div className="p-12 text-center text-zinc-500">Feature placeholder for {activeModal}</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden text-zinc-200 bg-zinc-950 font-sans selection:bg-emerald-500/30">
      {/* Top Header / Navigation */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Activity size={18} className="text-emerald-400" />
            <span className="text-sm font-bold tracking-tight text-emerald-500">CURVEPRO</span>
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <nav className="flex items-center gap-1">
            {['File', 'Curve', 'Develop', 'Window', 'Help'].map((item) => (
              <button key={item} className="px-3 py-1 text-xs font-medium transition-colors rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800">
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 text-[10px] font-mono text-zinc-500 bg-zinc-900 rounded-md border border-zinc-800">
            <Monitor size={12} />
            <span>PROJECT: DAISY_NJ_DEV_08</span>
          </div>
          <button className="p-2 transition-colors rounded-full hover:bg-zinc-800 text-zinc-400">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-zinc-800/50 bg-zinc-900/30">
        <div className="flex items-center gap-1 pr-4 border-r border-zinc-800/50">
          <ToolbarButton icon={FileUp} label="Import" />
          <ToolbarButton icon={Shuffle} label="Export" />
        </div>
        <div className="flex items-center gap-1 px-4 border-r border-zinc-800/50">
          <ToolbarButton icon={Edit3} label="Edit" onClick={() => setActiveModal('Edit')} active={activeModal === 'Edit'} />
          <ToolbarButton icon={Settings} label="Define" onClick={() => setActiveModal('Define')} active={activeModal === 'Define'} />
          <ToolbarButton icon={Layers} label="Compare" onClick={() => setActiveModal('Compare')} active={activeModal === 'Compare'} />
          <ToolbarButton icon={Camera} label="Capture" />
          <ToolbarButton icon={Trash2} label="Delete" danger />
        </div>
        <div className="flex items-center gap-1 px-4 border-r border-zinc-800/50">
          <ToolbarButton icon={MoveLeft} label="Left" />
          <ToolbarButton icon={MoveRight} label="Right" />
          <ToolbarButton icon={MoveUp} label="Up" />
          <ToolbarButton icon={MoveDown} label="Down" />
        </div>
        <div className="flex items-center gap-1 px-4">
          <ToolbarButton icon={Plus} label="Zoom In" />
          <ToolbarButton icon={Minus} label="Zoom Out" />
          <ToolbarButton icon={Maximize} label="Fit" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Data Selection */}
        <AnimatePresence mode="wait">
          {leftPanelOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex flex-col border-r border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm overflow-hidden"
            >
              <div className="p-4 space-y-6 overflow-y-auto">
                {/* File Info */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data Source</h3>
                    <Database size={14} className="text-zinc-600" />
                  </div>
                  <div className="p-3 space-y-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-medium">Active File</label>
                      <div className="text-xs font-mono truncate text-emerald-400/80">D:\Cymry.Results\Graph_cases\08.pch</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-medium">Subcase</label>
                        <select className="w-full p-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-md outline-none focus:border-emerald-500/50">
                          <option>Subcase 1</option>
                          <option>Subcase 2</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-medium">Data Block</label>
                        <select className="w-full p-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-md outline-none focus:border-emerald-500/50">
                          <option>ACCELERATION</option>
                          <option>VELOCITY</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Component Selection */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Components</h3>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-zinc-800 rounded"><Search size={12} /></button>
                      <button className="p-1 hover:bg-zinc-800 rounded text-emerald-500"><Plus size={12} /></button>
                    </div>
                  </div>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {['X-velocity', 'Y-velocity', 'Z-velocity', 'Total Magnitude', 'Phase Angle', 'Frequency Response'].map((comp) => (
                      <button 
                        key={comp}
                        className="flex items-center w-full gap-3 px-3 py-2 text-xs text-left transition-all rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 group"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors" />
                        {comp}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Task List */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Recent Tasks</h3>
                    <Clock size={14} className="text-zinc-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 text-[10px] font-mono text-zinc-500 bg-zinc-900/30 rounded border border-dashed border-zinc-800">
                      # Command: Import Curve Success
                    </div>
                    <div className="p-2 text-[10px] font-mono text-zinc-500 bg-zinc-900/30 rounded border border-dashed border-zinc-800">
                      # Command: Edit Curve vX
                    </div>
                  </div>
                </section>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Center - Chart Area */}
        <section className="flex-1 flex flex-col relative bg-zinc-950">
          {/* Toggle Buttons */}
          <button 
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="absolute left-4 top-4 z-40 p-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all hover:scale-110"
          >
            <PanelLeft size={18} />
          </button>
          <button 
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="absolute right-4 top-4 z-40 p-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all hover:scale-110"
          >
            <PanelRight size={18} />
          </button>

          {/* Chart Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="space-y-1">
              <h2 className="text-xl font-light tracking-tight text-white">Frequency Analysis <span className="text-zinc-600 font-mono text-sm ml-2">Graph_01</span></h2>
              <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                <span className="flex items-center gap-1"><Box size={10} /> Domain: Frequency</span>
                <span className="flex items-center gap-1"><Activity size={10} /> Unit: Acceleration (Magn)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-black rounded-md hover:bg-emerald-400 transition-colors">
                Draw Curve
              </button>
              <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700 transition-colors">
                Clear
              </button>
            </div>
          </div>

          {/* Actual Chart */}
          <div className="flex-1 p-6 min-h-0">
            <div className="w-full h-full bg-zinc-900/20 rounded-2xl border border-zinc-800/50 p-4 relative group">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="freq" 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -10, fill: '#71717a', fontSize: 10, fontWeight: 600 }}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    label={{ value: 'Acceleration (Magn)', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ padding: '2px 0' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '20px' }}
                  />
                  {curves.map((curve) => (
                    <Line 
                      key={curve.id}
                      type="monotone" 
                      dataKey={curve.id} 
                      name={curve.name}
                      stroke={curve.color} 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                  ))}
                  <ReferenceLine y={200} stroke="#3f3f46" strokeDasharray="3 3" label={{ position: 'right', value: 'Threshold', fill: '#52525b', fontSize: 10 }} />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Floating Legend Overlay */}
              <div className="absolute top-8 right-8 p-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Live Legend</div>
                <div className="space-y-2">
                  {curves.map(c => (
                    <div key={c.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-[10px] font-medium text-zinc-300">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar - Model Tree */}
        <AnimatePresence mode="wait">
          {rightPanelOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex flex-col border-l border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm overflow-hidden"
            >
              <div className="p-4 space-y-6 overflow-y-auto h-full">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Curve Model Tree</h3>
                    <FolderTree size={14} className="text-zinc-600" />
                  </div>
                  
                  <div className="space-y-2">
                    {/* View Node */}
                    <div className="space-y-1">
                      <button 
                        onClick={() => setIsModelTreeExpanded(!isModelTreeExpanded)}
                        className="flex items-center w-full gap-2 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 transition-colors text-left"
                      >
                        <motion.div
                          animate={{ rotate: isModelTreeExpanded ? 0 : -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={14} className="text-zinc-500" />
                        </motion.div>
                        <List size={14} className="text-emerald-400" />
                        <span className="text-xs font-bold">View-1 <span className="text-zinc-500 font-normal">({curves.length})</span></span>
                      </button>
                      
                      {/* Curve Nodes */}
                      <AnimatePresence>
                        {isModelTreeExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-6 space-y-1 overflow-hidden"
                          >
                            {curves.map((curve) => (
                              <div 
                                key={curve.id}
                                onClick={() => setActiveCurve(curve.id)}
                                className={cn(
                                  "flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer group",
                                  activeCurve === curve.id ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-zinc-800/50 border border-transparent"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: curve.color }} />
                                  <span className={cn("text-[11px] font-medium transition-colors", activeCurve === curve.id ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-200")}>
                                    {curve.name.split(':')[0]}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 hover:text-emerald-400"><Edit3 size={10} /></button>
                                  <button className="p-1 hover:text-red-400"><Trash2 size={10} /></button>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </section>

                {/* Annotation / Details */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Curve Details</h3>
                    <MessageSquare size={14} className="text-zinc-600" />
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 space-y-4">
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase">Description</div>
                      <div className="text-xs text-zinc-300 leading-relaxed">
                        Frequency response analysis for the structural component under random vibration load.
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Max Value</div>
                        <div className="text-sm font-mono text-emerald-400">390.42</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase">Min Value</div>
                        <div className="text-sm font-mono text-red-400">-12.05</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <Modal 
        isOpen={activeModal !== null} 
        onClose={() => setActiveModal(null)} 
        title={`${activeModal} Curve Configuration`}
        icon={activeModal === 'Edit' ? Sliders : activeModal === 'Define' ? Settings : Layers}
      >
        {renderModalContent()}
      </Modal>

      {/* Status Bar */}
      <footer className="flex items-center justify-between px-4 py-1.5 border-t border-zinc-800/50 bg-zinc-900/80 text-[10px] font-medium text-zinc-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400 uppercase tracking-wider">System Ready</span>
          </div>
          <div className="h-3 w-px bg-zinc-800" />
          <span>X: 110.00 Hz</span>
          <span>Y: 3.90E+4 Magn</span>
        </div>
        <div className="flex items-center gap-4">
          <span>MEM: 1.2GB / 16GB</span>
          <span className="text-emerald-500/80">CONNECTED: REMOTE_SERVER_01</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}
