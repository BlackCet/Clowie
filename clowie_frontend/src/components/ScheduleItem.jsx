import { format } from 'date-fns';
import { Calendar, CheckSquare, Bell, Trash2 } from 'lucide-react';

export function ScheduleItem({ entry, onDelete }) {
  const typeConfig = {
    MEETING: {
      icon: Calendar,
      color: 'bg-pastel-pink',
      borderColor: 'border-primary',
      iconColor: 'text-primary'
    },
    TASK: {
      icon: CheckSquare,
      color: 'bg-pastel-blue',
      borderColor: 'border-pastel-blue',
      iconColor: 'text-secondary'
    },
    REMINDER: {
      icon: Bell,
      color: 'bg-pastel-lavender',
      borderColor: 'border-pastel-lavender',
      iconColor: 'text-foreground'
    },
  };

  // Fallback to TASK if for some reason the database returns an unknown type
  const config = typeConfig[entry.type] || typeConfig.TASK; 
  const Icon = config.icon;

  return (
    <div className={`p-3 md:p-4 bg-white rounded-lg md:rounded-xl border-2 ${config.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-2 md:gap-3">
        
        {/* Left Side: Icon and Text */}
        <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
          <div className={`p-1.5 md:p-2 ${config.color} rounded-md md:rounded-lg flex-shrink-0`}>
            <Icon className={`w-4 h-4 md:w-5 md:h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm md:text-base font-medium text-foreground truncate">
              {entry.title}
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
              {format(entry.scheduledTime, 'MMM dd, yyyy • h:mm a')}
            </p>
          </div>
        </div>

        {/* Right Side: Actions (Delete) */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1.5 md:p-2 hover:bg-destructive/10 rounded-md md:rounded-lg transition-colors touch-manipulation group"
            aria-label="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>

      </div>
    </div>
  );
}