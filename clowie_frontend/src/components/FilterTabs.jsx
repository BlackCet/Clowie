import { Calendar, CheckSquare, Bell, LayoutGrid } from 'lucide-react';

export function FilterTabs({ activeFilter, onFilterChange, counts }) {
  const tabs = [
    { id: 'ALL', label: 'All', icon: LayoutGrid },
    { id: 'TASK', label: 'Tasks', icon: CheckSquare },
    { id: 'MEETING', label: 'Meetings', icon: Calendar },
    { id: 'REMINDER', label: 'Reminders', icon: Bell },
  ];

  return (
    <div className="flex gap-1.5 md:gap-2 p-1 bg-muted rounded-lg md:rounded-xl overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFilter === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`flex-1 min-w-fit px-2 sm:px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg transition-all flex items-center justify-center gap-1.5 md:gap-2 touch-manipulation ${
              isActive
                ? 'bg-card shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
            <span className="font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">
              {tab.label}
            </span>
            
            {/* The little notification badge showing the count */}
            <span className={`text-xs px-1.5 md:px-2 py-0.5 rounded-full font-bold ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {counts[tab.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}