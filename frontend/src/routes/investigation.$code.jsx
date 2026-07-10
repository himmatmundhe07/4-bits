import { useEffect, useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getPlayerId } from "@/lib/player-id";
import { 
  getSuspects, 
  getInvestigationLog, 
  getDiscoveredClues, 
  getActivePlayers, 
  submitAction 
} from "@/lib/investigation";
import { Search, Send, User, MapPin, Database, ChevronRight, Activity } from "lucide-react";

export const Route = createFileRoute("/investigation/$code")({
  component: InvestigationScreen
});

function InvestigationScreen() {
  const { code } = Route.useParams();
  const playerId = getPlayerId();
  
  // Data State
  const [suspects, setSuspects] = useState([]);
  const [log, setLog] = useState([]);
  const [clues, setClues] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action State
  const [actionType, setActionType] = useState("ask");
  const [actionTarget, setActionTarget] = useState("");
  const [actionContent, setActionContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Mobile Tab State
  const [activeTab, setActiveTab] = useState("log");

  const logEndRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [susData, logData, clueData, playerData] = await Promise.all([
          getSuspects(code),
          getInvestigationLog(code),
          getDiscoveredClues(code),
          getActivePlayers(code)
        ]);
        if (cancelled) return;
        setSuspects(susData);
        setLog(logData);
        setClues(clueData);
        setPlayers(playerData);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [code]);

  // Auto-scroll to bottom of log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (submitting || (!actionTarget && actionType !== "inspect") || (actionType !== "inspect" && !actionContent)) return;

    setSubmitting(true);
    try {
      const result = await submitAction(code, playerId, {
        type: actionType,
        target: actionTarget,
        content: actionContent
      });
      
      setLog(prev => [...prev, ...result.newEntries]);
      
      // Update clues if inspect returned new ones (in mock, we just refetch for simplicity if real API)
      const updatedClues = await getDiscoveredClues(code);
      setClues(updatedClues);

      setActionContent("");
      // Don't reset target, useful for follow-up questions
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[color:var(--color-bg-base)]">
        <span className="tracked-caps text-[11px] text-[color:var(--color-text-tertiary)] animate-pulse">
          Loading investigation board...
        </span>
      </main>
    );
  }

  // --- Components ---

  const SuspectsPanel = () => (
    <div className="h-full flex flex-col border-r border-[color:var(--color-border-hairline)] bg-[color:var(--color-bg-base)]">
      <div className="p-4 border-b border-[color:var(--color-border-hairline)]">
        <span className="tracked-caps text-[10px] text-[color:var(--color-text-tertiary)]">Persons of Interest</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {suspects.map(s => (
          <div key={s.id} className="p-3 border border-[color:var(--color-border-hairline)] bg-[color:var(--color-bg-elevated)]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-serif-display text-lg text-[color:var(--color-text-primary)]">{s.name}</p>
                <p className="text-xs text-[color:var(--color-text-secondary)] italic">{s.role}</p>
              </div>
              {s.isPlayer && (
                <span className="text-[9px] tracked-caps bg-[color:var(--color-border-hairline)] px-2 py-1">Player</span>
              )}
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <button 
                onClick={() => { setActionType("ask"); setActionTarget(s.name); setActiveTab("log"); }}
                className="text-[10px] tracked-caps border border-[color:var(--color-border-hairline)] px-2 py-1 hover:bg-[color:var(--color-border-hairline)] transition-colors"
              >
                Ask
              </button>
              <button 
                onClick={() => { setActionType("request"); setActionTarget(s.name); setActiveTab("log"); }}
                className="text-[10px] tracked-caps border border-[color:var(--color-border-hairline)] px-2 py-1 hover:bg-[color:var(--color-border-hairline)] transition-colors"
              >
                Request
              </button>
              <button 
                onClick={() => { setActionType("accuse"); setActionTarget(s.name); setActiveTab("log"); }}
                className="text-[10px] tracked-caps border border-[color:var(--color-accent-blood)] text-[color:var(--color-accent-blood)] px-2 py-1 hover:bg-[rgba(113,26,36,0.1)] transition-colors"
              >
                Accuse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EvidencePanel = () => (
    <div className="h-full flex flex-col border-l border-[color:var(--color-border-hairline)] bg-[color:var(--color-bg-base)]">
      <div className="p-4 border-b border-[color:var(--color-border-hairline)]">
        <span className="tracked-caps text-[10px] text-[color:var(--color-text-tertiary)]">Evidence & Clues</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {clues.length === 0 && (
          <p className="text-xs text-[color:var(--color-text-tertiary)] text-center py-8">No evidence discovered yet.</p>
        )}
        {clues.map(c => (
          <div key={c.id} className="p-3 border border-[color:var(--color-border-hairline)] bg-[color:var(--color-bg-elevated)] tw-animate-in tw-zoom-in-95 tw-duration-300">
            <p className="font-serif-display text-md text-[color:var(--color-text-primary)]">{c.title}</p>
            <p className="text-xs text-[color:var(--color-text-secondary)] mt-2">{c.description}</p>
          </div>
        ))}
      </div>
      
      {/* Live Players Strip */}
      <div className="p-4 border-t border-[color:var(--color-border-hairline)] bg-[color:var(--color-bg-elevated)]">
        <span className="tracked-caps text-[10px] text-[color:var(--color-text-tertiary)] block mb-3">Active Investigators</span>
        <div className="flex flex-wrap gap-3">
          {players.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${p.active ? 'bg-green-700' : 'bg-gray-500'}`} />
              <span className="text-xs text-[color:var(--color-text-secondary)]">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LogPanel = () => (
    <div className="h-full flex flex-col bg-[color:var(--color-bg-base)] relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-32 md:pb-40">
        {log.map(entry => (
          <div key={entry.id} className={`max-w-xl tw-animate-in tw-fade-in tw-slide-in-from-bottom-2 tw-duration-300 ${entry.type === 'player' ? 'ml-auto text-right' : ''}`}>
            <span className="tracked-caps text-[9px] text-[color:var(--color-text-tertiary)] block mb-1">
              {entry.author}
            </span>
            <div className={`p-4 inline-block ${entry.type === 'player' ? 'border border-[color:var(--color-border-hairline)] bg-[color:var(--color-bg-elevated)]' : ''}`}>
              <p className={`text-sm leading-relaxed ${entry.type === 'ai' ? 'font-serif-display text-lg text-[color:var(--color-text-primary)]' : 'text-[color:var(--color-text-secondary)]'}`}>
                {entry.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Action Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[color:var(--color-border-hairline-strong)] bg-[color:var(--color-bg-elevated)] p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleActionSubmit} className="max-w-3xl mx-auto space-y-3">
          
          {/* Action Types */}
          <div className="flex flex-wrap gap-2 mb-2">
            {['ask', 'request', 'inspect', 'accuse'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setActionType(type)}
                className={`text-[10px] tracked-caps px-3 py-1.5 transition-colors border ${
                  actionType === type 
                    ? type === 'accuse' 
                      ? 'border-[color:var(--color-accent-blood)] bg-[rgba(113,26,36,0.1)] text-[color:var(--color-accent-blood)]' 
                      : 'border-[color:var(--color-text-primary)] bg-[color:var(--color-text-primary)] text-[color:var(--color-bg-base)]'
                    : 'border-[color:var(--color-border-hairline)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-text-primary)]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {actionType !== 'inspect' && (
              <select 
                value={actionTarget}
                onChange={(e) => setActionTarget(e.target.value)}
                className="bg-transparent border border-[color:var(--color-border-hairline)] text-[color:var(--color-text-primary)] text-xs p-2 md:p-3 outline-none focus:border-[color:var(--color-text-secondary)]"
              >
                <option value="" disabled>Select Target</option>
                {suspects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            )}

            {actionType === 'inspect' && (
              <input
                type="text"
                placeholder="What to inspect? (e.g. Desk, Body, Clock)"
                value={actionTarget}
                onChange={(e) => setActionTarget(e.target.value)}
                className="flex-1 bg-transparent border border-[color:var(--color-border-hairline)] text-[color:var(--color-text-primary)] text-sm p-2 md:p-3 outline-none focus:border-[color:var(--color-text-secondary)] placeholder-[color:var(--color-text-tertiary)]"
              />
            )}

            {actionType !== 'inspect' && (
              <input
                type="text"
                placeholder={actionType === 'accuse' ? "State your reasoning..." : "What do you want to say?"}
                value={actionContent}
                onChange={(e) => setActionContent(e.target.value)}
                className="flex-1 bg-transparent border border-[color:var(--color-border-hairline)] text-[color:var(--color-text-primary)] text-sm p-2 md:p-3 outline-none focus:border-[color:var(--color-text-secondary)] placeholder-[color:var(--color-text-tertiary)]"
              />
            )}

            <button 
              type="submit"
              disabled={submitting}
              className="bg-[color:var(--color-text-primary)] text-[color:var(--color-bg-base)] p-2 md:p-3 flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[color:var(--color-bg-base)]">
      
      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:flex w-full h-full">
        <div className="w-[300px] shrink-0">
          <SuspectsPanel />
        </div>
        <div className="flex-1 min-w-0">
          <LogPanel />
        </div>
        <div className="w-[300px] shrink-0">
          <EvidencePanel />
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="flex md:hidden flex-col w-full h-full">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'suspects' && <SuspectsPanel />}
          {activeTab === 'log' && <LogPanel />}
          {activeTab === 'evidence' && <EvidencePanel />}
        </div>

        {/* Mobile Tab Bar */}
        <div className="h-16 shrink-0 bg-[color:var(--color-bg-elevated)] border-t border-[color:var(--color-border-hairline-strong)] flex">
          <button 
            onClick={() => setActiveTab('suspects')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeTab === 'suspects' ? 'text-[color:var(--color-text-primary)]' : 'text-[color:var(--color-text-tertiary)]'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] tracked-caps">Suspects</span>
          </button>
          <button 
            onClick={() => setActiveTab('log')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeTab === 'log' ? 'text-[color:var(--color-text-primary)]' : 'text-[color:var(--color-text-tertiary)]'}`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[9px] tracked-caps">Investigate</span>
          </button>
          <button 
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeTab === 'evidence' ? 'text-[color:var(--color-text-primary)]' : 'text-[color:var(--color-text-tertiary)]'}`}
          >
            <Database className="w-5 h-5" />
            <span className="text-[9px] tracked-caps">Clues</span>
          </button>
        </div>

      </div>

    </div>
  );
}
