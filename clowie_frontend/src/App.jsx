import { useState, useEffect } from 'react';
import { ConversationalInput } from './components/ConversationalInput';
import { SystemActionFeed } from './components/SystemActionFeed';
import { ScheduleItem } from './components/ScheduleItem';
import { FilterTabs } from './components/FilterTabs';
import { CalendarView } from './components/CalendarView';
import { Sparkles, Calendar as CalendarIcon, LogOut } from 'lucide-react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

export default function App() {
  // 1. Auth State
  const [token, setToken] = useState(localStorage.getItem('clowie_token'));

  // Initialize Data State
  const [entries, setEntries] = useState([]);
  
  // UI State
  const [actionStatus, setActionStatus] = useState('idle');
  const [actionMessage, setActionMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('list');
  const [calendarViewType, setCalendarViewType] = useState('month');

  // --- AUTHENTICATION HELPERS ---
  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('clowie_token');
    setToken(null);
    setEntries([]); // Clear calendar data from screen
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

  // 2. THE REAL DATA FETCH (Secured)
  const fetchEvents = async () => {
    if (!token) return; // Don't fetch if not logged in

    try {
      const res = await fetch(`${API_BASE}/api/events`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 500) {
          handleLogout(); // If token is expired or invalid, log them out safely
          return;
        }
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      
      const formattedData = data.map((item) => ({
        id: item.id.toString(),
        title: item.title,
        type: item.type,
        scheduledTime: item.scheduledTime ? new Date(item.scheduledTime) : new Date(), 
      }));

      const sortedData = formattedData.sort((a, b) => 
        a.scheduledTime.getTime() - b.scheduledTime.getTime()
      );
      
      setEntries(sortedData);
    } catch (error) {
      console.error("Failed to fetch events from Java:", error);
    }
  };

  // Load data immediately on startup (if token exists) or when token changes
  useEffect(() => {
    fetchEvents();
  }, [token]);

  // 3. THE REAL AGENTIC PROCESSING (Secured)
  const handleAIProcessing = async (message) => {
    if (!message.trim() || !token) return;

    setActionStatus('processing');
    setActionMessage('Clowie is evaluating your calendar...');

    try {
      const res = await fetch(`${API_BASE}/api/schedule`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'text/plain',
          'Authorization': `Bearer ${token}`
        },
        body: message
      });
      
      const textResponse = await res.text();

      if (textResponse.includes('⚠️')) {
        setActionStatus('error');
        setActionMessage(textResponse);
      } else {
        setActionStatus('success');
        setActionMessage(textResponse);
        fetchEvents(); 
      }
    } catch (error) {
      setActionStatus('error');
      setActionMessage('Connection failed! Is the Java backend running?');
    }
  };

  // 4. THE REAL DATABASE DELETE (Secured)
  const handleDelete = async (id) => {
    if (!token) return;

    try {
      await fetch(`${API_BASE}/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setActionStatus('success');
      setActionMessage('✓ Entry wiped from database.');
      fetchEvents(); 
      
      setTimeout(() => setActionStatus('idle'), 3000);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  // Filtering Logic
  const filteredEntries = activeFilter === 'ALL'
    ? entries
    : entries.filter(entry => entry.type === activeFilter);

  const getCounts = () => ({
    ALL: entries.length,
    MEETING: entries.filter(e => e.type === 'MEETING').length,
    TASK: entries.filter(e => e.type === 'TASK').length,
    REMINDER: entries.filter(e => e.type === 'REMINDER').length,
  });

  // --- RENDER LOGIN SCREEN IF NO TOKEN ---
  if (!token) {
    return (
      <div className="size-full min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-card p-8 md:p-12 rounded-2xl border-2 border-border shadow-xl flex flex-col items-center gap-6 max-w-md w-full text-center">
          <div className="p-4 bg-primary/20 rounded-full mb-2">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Clowie</h1>
            <p className="text-muted-foreground">Log in to manage your schedule and receive AI-powered reminders.</p>
          </div>
          <div className="mt-4">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const jwt = credentialResponse.credential;
                localStorage.setItem('clowie_token', jwt);
                setToken(jwt);
              }}
              onError={() => {
                console.error('Login Failed');
              }}
              shape="pill"
            />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN DASHBOARD IF LOGGED IN ---
  return (
    <div className="size-full bg-background flex items-center justify-center p-3 sm:p-4 md:p-6 min-h-screen">
      <div className="w-full max-w-7xl h-full max-h-[900px] grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4 md:gap-6">
        
        {/* Left Panel - Conversational Control Center */}
        <div className="flex flex-col gap-4 md:gap-6 bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-border shadow-lg max-h-[500px] lg:max-h-none">
          
          {/* Header with Logout Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-primary rounded-lg md:rounded-xl">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Clowie</h1>
                <p className="text-xs md:text-sm text-muted-foreground">Your AI Assistant</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors flex items-center gap-2"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-3 md:gap-4 overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="space-y-3 md:space-y-4">
                <div className="p-3 md:p-4 bg-muted rounded-lg md:rounded-xl">
                  <p className="text-xs md:text-sm text-foreground">
                    Hi! I'm Clowie. Tell me what you need to schedule, and I'll handle the rest.
                  </p>
                </div>
                <SystemActionFeed status={actionStatus} message={actionMessage} />
              </div>
            </div>

            <ConversationalInput onSubmit={handleAIProcessing} />
          </div>
        </div>

        {/* Right Panel - Master Schedule Dashboard */}
        <div className="flex flex-col gap-4 md:gap-6 bg-card rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-border shadow-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-secondary rounded-lg md:rounded-xl">
                <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-secondary-foreground" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Your Schedule</h2>
            </div>
            
            <div className="flex gap-1.5 md:gap-2 bg-muted p-1 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-md transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Calendar
              </button>
            </div>
          </div>

          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={getCounts()}
          />

          <div className="flex-1 overflow-y-auto min-h-0">
            {viewMode === 'list' ? (
              <div className="space-y-2 md:space-y-3">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-sm md:text-base text-muted-foreground">
                    No {activeFilter === 'ALL' ? 'entries' : activeFilter.toLowerCase() + 's'} scheduled yet.
                  </div>
                ) : (
                  filteredEntries.map(entry => (
                    <ScheduleItem
                      key={entry.id}
                      entry={entry}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            ) : (
              <CalendarView
                entries={filteredEntries}
                viewType={calendarViewType}
                onViewTypeChange={setCalendarViewType}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}