import React, { useState } from 'react';
import axios from 'axios';
import { useLiveEvents } from '../hooks/useLiveEvents';
import { 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  MousePointer, 
  ShoppingBag, 
  LifeBuoy, 
  Activity, 
  Wifi, 
  WifiOff 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { events, isConnected } = useLiveEvents();
    const [simulating, setSimulating] = useState<string | null>(null);
    const [simError, setSimError] = useState<string | null>(null);

    // Static Customer details (mocking ID = 1)
    const customer = {
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        status: "Gold VIP",
        joined: "May 27, 2026"
    };

    const triggerSimulation = async (type: 'CLICK' | 'PURCHASE' | 'TICKET') => {
        setSimulating(type);
        setSimError(null);

        let metadata = {};
        if (type === 'CLICK') {
            metadata = {
                page: "Dashboard / Live View",
                elementId: "action-simulator-panel",
                durationMs: Math.floor(Math.random() * 2000) + 100
            };
        } else if (type === 'PURCHASE') {
            const items = ["Mechanical Keyboard", "High-Fi Headphones", "Ergonomic Desk", "Dual-Monitor Arm"];
            const selectedItem = items[Math.floor(Math.random() * items.length)];
            metadata = {
                item: selectedItem,
                amount: parseFloat((Math.random() * 400 + 49.99).toFixed(2)),
                currency: "USD",
                paymentMethod: "Credit Card"
            };
        } else if (type === 'TICKET') {
            const subjects = ["Billing dispute", "API connection timeout", "Webhook notification delay"];
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            metadata = {
                ticketId: `TCK-${Math.floor(Math.random() * 9000) + 1000}`,
                subject: subject,
                priority: "HIGH",
                channel: "Web Portal"
            };
        }

        const payload = {
            customerId: customer.id,
            actionType: type,
            metadata: metadata
        };

        try {
            await axios.post('/api/events', payload);
        } catch (err: any) {
            console.error("Simulation failed", err);
            setSimError(`Failed to trigger simulated ${type} event.`);
        } finally {
            setSimulating(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Customer 360 Insights
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Real-time behavior tracking & logs dashboard</p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-full px-4 py-2">
                        {isConnected ? (
                            <>
                                <Wifi className="w-5 h-5 text-emerald-400 animate-pulse" />
                                <span className="text-xs font-semibold text-emerald-400 tracking-wide">LIVE STREAM CONNECTED</span>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-5 h-5 text-rose-500" />
                                <span className="text-xs font-semibold text-rose-500 tracking-wide">CONNECTING TO STREAM...</span>
                            </>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* --- LEFT SIDEBAR (PROFILE & CONTROL PANEL) --- */}
                    <div className="space-y-6 lg:col-span-1">
                        
                        {/* PROFILE CARD */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-300"></div>
                            
                            <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold">{customer.name}</h2>
                                        <span className="bg-amber-500/15 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                                            {customer.status}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400">Customer ID: #{customer.id}</span>
                                </div>
                            </div>

                            <div className="mt-5 space-y-4">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Mail className="w-4.5 h-4.5 text-slate-400" />
                                    <span className="text-sm font-medium">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Calendar className="w-4.5 h-4.5 text-slate-400" />
                                    <span className="text-sm font-medium">Joined {customer.joined}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <ShieldCheck className="w-4.5 h-4.5 text-slate-400" />
                                    <span className="text-sm font-medium">Verification Status: Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* EVENT SIMULATION PANEL */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-400" /> Action Simulator
                            </h3>
                            <p className="text-xs text-slate-400 mb-5">
                                Trigger custom client behavior mock events. These publish to Kafka, persist to Elasticsearch, and stream back via Server-Sent Events.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => triggerSimulation('CLICK')}
                                    disabled={simulating !== null}
                                    className="w-full flex items-center justify-between bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 font-semibold transition-all duration-200 group disabled:opacity-50"
                                >
                                    <span className="flex items-center gap-3 text-sm">
                                        <MousePointer className="w-4.5 h-4.5 text-blue-400" />
                                        Simulate Page Click
                                    </span>
                                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md font-bold">
                                        {simulating === 'CLICK' ? 'Sending...' : 'TRIGGER'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => triggerSimulation('PURCHASE')}
                                    disabled={simulating !== null}
                                    className="w-full flex items-center justify-between bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 font-semibold transition-all duration-200 group disabled:opacity-50"
                                >
                                    <span className="flex items-center gap-3 text-sm">
                                        <ShoppingBag className="w-4.5 h-4.5 text-emerald-400" />
                                        Simulate Product Purchase
                                    </span>
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md font-bold">
                                        {simulating === 'PURCHASE' ? 'Sending...' : 'TRIGGER'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => triggerSimulation('TICKET')}
                                    disabled={simulating !== null}
                                    className="w-full flex items-center justify-between bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 font-semibold transition-all duration-200 group disabled:opacity-50"
                                >
                                    <span className="flex items-center gap-3 text-sm">
                                        <LifeBuoy className="w-4.5 h-4.5 text-rose-400" />
                                        Simulate Support Ticket
                                    </span>
                                    <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-md font-bold">
                                        {simulating === 'TICKET' ? 'Sending...' : 'TRIGGER'}
                                    </span>
                                </button>
                            </div>

                            {simError && (
                                <div className="mt-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl p-3">
                                    {simError}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT (LIVE STREAM FEED) --- */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[525px] overflow-hidden">
                            
                            <div className="border-b border-slate-800 p-5 flex justify-between items-center bg-slate-900/50">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></div>
                                    <h3 className="font-bold text-lg">Live Activity Feed</h3>
                                </div>
                                <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                                    Showing latest {events.length} events
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
                                {events.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
                                        <Activity className="w-12 h-12 text-slate-700 stroke-[1.5]" />
                                        <div>
                                            <p className="font-medium text-sm text-slate-400">Waiting for live data stream...</p>
                                            <p className="text-xs text-slate-500 mt-1">Use the Action Simulator on the left to trigger events.</p>
                                        </div>
                                    </div>
                                ) : (
                                    events.map((evt) => {
                                        let icon = <MousePointer className="w-5 h-5" />;
                                        let colorClass = "from-blue-500 to-sky-600 bg-blue-500/5 border-blue-500/20 text-blue-400";
                                        
                                        if (evt.actionType === 'PURCHASE') {
                                            icon = <ShoppingBag className="w-5 h-5" />;
                                            colorClass = "from-emerald-500 to-teal-600 bg-emerald-500/5 border-emerald-500/20 text-emerald-400";
                                        } else if (evt.actionType === 'TICKET') {
                                            icon = <LifeBuoy className="w-5 h-5" />;
                                            colorClass = "from-rose-500 to-orange-600 bg-rose-500/5 border-rose-500/20 text-rose-400";
                                        }

                                        return (
                                            <div 
                                                key={evt.eventId}
                                                className={`border rounded-2xl p-4 transition-all duration-300 hover:border-slate-700 bg-slate-900/50 flex gap-4 items-start ${colorClass.split(" ")[2]}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr flex items-center justify-center shrink-0 ${colorClass.split(" ")[0]} ${colorClass.split(" ")[1]} text-white shadow-md`}>
                                                    {icon}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center gap-2">
                                                        <span className="font-bold text-sm text-slate-200 tracking-wide">
                                                            {evt.actionType}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-mono">
                                                            {new Date(evt.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>

                                                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                                                        Event ID: {evt.eventId}
                                                    </p>

                                                    {/* Event Metadata details */}
                                                    <div className="mt-3 bg-slate-950/80 border border-slate-900 rounded-xl p-3">
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Metadata</span>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1.5 text-xs">
                                                            {Object.entries(evt.metadata || {}).map(([k, v]) => (
                                                                <div key={k} className="flex justify-between border-b border-slate-900/60 pb-1">
                                                                    <span className="text-slate-400 font-mono">{k}:</span>
                                                                    <span className="text-slate-300 font-medium truncate max-w-[120px]" title={String(v)}>
                                                                        {typeof v === 'number' && k === 'amount' ? `$${v.toFixed(2)}` : String(v)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
