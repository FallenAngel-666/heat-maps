import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Terminal, 
  Play, 
  Pause, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Smartphone, 
  Radio, 
  Wifi, 
  ArrowDownCircle,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { BleDetectionLog, ScannerMode, ScannerStatus } from '../../types';

interface BleTerminalConsoleProps {
  logs: BleDetectionLog[];
  scannerStatus: ScannerStatus;
  mode: ScannerMode;
  isBackendConnected: boolean;
  totalDevices: number;
}

export const BleTerminalConsole: React.FC<BleTerminalConsoleProps> = ({
  logs = [],
  scannerStatus,
  mode,
  isBackendConnected,
  totalDevices
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [displayLogs, setDisplayLogs] = useState<BleDetectionLog[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'phones' | 'discovery' | 'purge'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Sync incoming logs when not paused
  useEffect(() => {
    if (!isPaused) {
      setDisplayLogs((prev) => {
        // Merge and deduplicate by log ID
        const existingIds = new Set(prev.map(l => l.id));
        const newItems = logs.filter(l => !existingIds.has(l.id));
        if (newItems.length === 0) return prev;
        const combined = [...prev, ...newItems];
        // Keep last 150 items in buffer
        return combined.slice(-150);
      });
    }
  }, [logs, isPaused]);

  // Handle auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && !isPaused && terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayLogs, autoScroll, isPaused]);

  // Filter logs based on category and search query
  const filteredLogs = useMemo(() => {
    return displayLogs.filter((log) => {
      // Type filter
      if (filterType === 'phones') {
        const isNearbyPhone = log.signal_level === 'strong' || (log.rssi !== null && log.rssi !== undefined && log.rssi >= -75);
        if (!isNearbyPhone) return false;
      } else if (filterType === 'discovery') {
        if (log.type !== 'discovery') return false;
      } else if (filterType === 'purge') {
        if (log.type !== 'purge') return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = log.anon_id?.toLowerCase().includes(query);
        const matchesMsg = log.message.toLowerCase().includes(query);
        const matchesProx = log.proximity_est?.toLowerCase().includes(query);
        return Boolean(matchesId || matchesMsg || matchesProx);
      }

      return true;
    });
  }, [displayLogs, filterType, searchQuery]);

  // Copy logs as text
  const handleCopyLogs = () => {
    const text = filteredLogs
      .map(l => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.anon_id || 'SYSTEM'}: RSSI=${l.rssi ?? 'N/A'}dBm | ${l.proximity_est || ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Clear logs from view
  const handleClear = () => {
    setDisplayLogs([]);
  };

  const isLive = mode === 'live';
  const isActive = scannerStatus === 'active' && isBackendConnected;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 font-mono text-xs select-none">
      {/* 1. Terminal CLI Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 border border-slate-700 text-sky-400 font-bold text-[11px]">
            <Terminal className="w-3.5 h-3.5" />
            <span>root@campusops:~/ble-sniffer</span>
          </div>

          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isPaused
              ? 'bg-amber-950 text-amber-400 border-amber-800'
              : isActive
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-red-950 text-red-400 border-red-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : isActive ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`}></span>
            {isPaused ? 'STREAM PAUSED' : isActive ? 'LIVE PACKET STREAM' : 'OFFLINE'}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume stream' : 'Pause stream'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
              isPaused 
                ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-700' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={handleClear}
            title="Clear terminal buffer"
            className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 text-[11px]"
          >
            <Trash2 className="w-3 h-3 text-slate-400" />
            <span>Clear</span>
          </button>

          <button
            onClick={handleCopyLogs}
            title="Copy terminal logs to clipboard"
            className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 text-[11px]"
          >
            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="p-2.5 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        {/* Category Filters */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-sky-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Packets ({displayLogs.length})
          </button>
          <button
            onClick={() => setFilterType('phones')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium transition-colors ${
              filterType === 'phones'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3 h-3 text-emerald-300" />
            <span>Nearby Phones</span>
          </button>
          <button
            onClick={() => setFilterType('discovery')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filterType === 'discovery'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Discoveries
          </button>
          <button
            onClick={() => setFilterType('purge')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              filterType === 'purge'
                ? 'bg-rose-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Purges
          </button>
        </div>

        {/* Search Input & Auto-Scroll Checkbox */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Search DEV-ID or dBm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-6 pr-2 py-0.5 bg-black/60 border border-slate-700 rounded text-slate-200 placeholder-slate-500 text-[11px] focus:outline-none focus:border-sky-500 w-36"
            />
          </div>

          <label className="flex items-center gap-1 text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
            />
            <span className="text-[10px]">Auto-scroll</span>
          </label>
        </div>
      </div>

      {/* 3. Live Log Feed Window */}
      <div 
        ref={logContainerRef}
        className="flex-1 p-3 overflow-y-auto space-y-1.5 font-mono text-[11px] bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
        style={{ minHeight: '320px', maxHeight: '480px' }}
      >
        {/* Terminal Welcome Prompt */}
        <div className="text-slate-500 pb-2 border-b border-slate-900 leading-relaxed">
          <p># CampusOps Bluetooth Packet Sniffer & Phone Density Stream</p>
          <p># Listening on adapter: <span className="text-sky-400">{isLive ? 'Windows 11 Built-in BLE' : 'Multi-Zone Cloud Simulation'}</span></p>
          <p># Privacy Shield: Ephemeral Salted SHA-256 (Zero MAC address storage)</p>
          <p className="text-slate-600">------------------------------------------------------------</p>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <Radio className="w-6 h-6 animate-pulse text-slate-600" />
            <p>Scanning 2.4 GHz spectrum for nearby phone advertisements...</p>
            <p className="text-[10px] text-slate-600">
              Ensure Bluetooth is ON on nearby phones or double-click <span className="text-slate-400 font-bold">launch-live-ble-console.bat</span>
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isPurge = log.type === 'purge';
            const isDiscovery = log.type === 'discovery';
            const rssi = log.rssi;
            const isPhone = (rssi !== null && rssi !== undefined && rssi >= -70);

            return (
              <div 
                key={log.id}
                className={`py-1 px-1.5 rounded transition-colors flex items-start gap-2 leading-relaxed ${
                  isDiscovery ? 'bg-emerald-950/25 border-l-2 border-emerald-500' :
                  isPurge ? 'bg-rose-950/25 border-l-2 border-rose-500' :
                  isPhone ? 'bg-sky-950/20 hover:bg-slate-900/60' : 'hover:bg-slate-900/40'
                }`}
              >
                {/* Timestamp */}
                <span className="text-slate-500 shrink-0 select-none">
                  [{log.timestamp}]
                </span>

                {/* Event Type Badge */}
                {isDiscovery ? (
                  <span className="px-1 py-0.2 rounded bg-emerald-900/60 text-emerald-300 font-bold text-[9px] shrink-0 uppercase tracking-wider">
                    NEW PHONE
                  </span>
                ) : isPurge ? (
                  <span className="px-1 py-0.2 rounded bg-rose-900/60 text-rose-300 font-bold text-[9px] shrink-0 uppercase tracking-wider">
                    PURGE 60S
                  </span>
                ) : (
                  <span className="px-1 py-0.2 rounded bg-slate-800 text-sky-300 font-semibold text-[9px] shrink-0 uppercase">
                    RX PKT
                  </span>
                )}

                {/* Device Identifier */}
                {log.anon_id ? (
                  <span className="text-white font-bold tracking-tight shrink-0">
                    {log.anon_id}
                  </span>
                ) : null}

                {/* RSSI & Signal Strength */}
                {rssi !== null && rssi !== undefined ? (
                  <span className={`font-bold shrink-0 ${
                    rssi >= -70 ? 'text-emerald-400' :
                    rssi >= -85 ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {rssi} dBm
                  </span>
                ) : null}

                {/* Proximity & Inferred Device Class */}
                {log.proximity_est ? (
                  <span className="text-slate-300 truncate">
                    {log.proximity_est}
                  </span>
                ) : (
                  <span className="text-slate-400 truncate">
                    {log.message}
                  </span>
                )}

                {/* Packet Counter */}
                {log.packet_count && log.packet_count > 1 ? (
                  <span className="ml-auto text-[9px] text-slate-500 shrink-0 select-none">
                    #{log.packet_count}
                  </span>
                ) : null}
              </div>
            );
          })
        )}

        <div ref={terminalBottomRef} />
      </div>

      {/* 4. Terminal Status Footer Bar */}
      <div className="p-2 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-slate-300">
            <Smartphone className="w-3 h-3 text-emerald-400" />
            <span>Active Nearby Phones: <b className="text-white">{totalDevices}</b></span>
          </span>
          <span className="text-slate-600">|</span>
          <span>Window: <b>60s sliding</b></span>
        </div>

        <div className="flex items-center gap-2">
          <span>Buffer: <b>{filteredLogs.length} events</b></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};
