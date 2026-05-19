import { useState } from 'react';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameDay, isToday, startOfWeek, endOfWeek, addMonths, 
  subMonths, addWeeks, subWeeks, addDays, subDays 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarView({ entries, viewType, onViewTypeChange }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = (direction) => {
    if (viewType === 'month') {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    } else if (viewType === 'week') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1));
    }
  };

  const getEntriesForDate = (date) => {
    return entries.filter(entry => isSameDay(entry.scheduledTime, date));
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs md:text-sm font-medium text-muted-foreground py-1 md:py-2">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
        {days.map((day, idx) => {
          const dayEntries = getEntriesForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          
          return (
            <div
              key={idx}
              tabIndex={0} 
              className={`relative group cursor-pointer outline-none min-h-16 md:min-h-24 p-1 md:p-2 rounded-md md:rounded-lg border-2 transition-all hover:z-50 focus:z-50 ${
                isToday(day)
                  ? 'bg-primary/10 border-primary/50'
                  : 'bg-card border-border hover:border-primary/30 focus:border-primary/50'
              } ${!isCurrentMonth ? 'opacity-40 hover:opacity-100 focus:opacity-100' : ''}`}
            >
              
              {/* Normal Grid View */}
              <div className={`text-xs md:text-sm font-medium mb-0.5 md:mb-1 ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5 md:space-y-1">
                {dayEntries.slice(0, 2).map(entry => (
                  <div
                    key={entry.id}
                    className={`text-[10px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded truncate ${
                      entry.type === 'MEETING' ? 'bg-pastel-pink text-foreground' :
                      entry.type === 'TASK' ? 'bg-pastel-blue text-foreground' :
                      'bg-pastel-lavender text-foreground'
                    }`}
                  >
                    <span className="hidden md:inline">{entry.title}</span>
                    <span className="md:hidden">•</span>
                  </div>
                ))}
                {dayEntries.length > 2 && (
                  <div className="text-[10px] md:text-xs text-muted-foreground font-medium">
                    <span className="hidden md:inline">+{dayEntries.length - 2} more</span>
                    <span className="md:hidden">+{dayEntries.length - 2}</span>
                  </div>
                )}
              </div>

              {/* POPOVER OVERLAY */}
              {dayEntries.length > 0 && (
                <div className="absolute top-[-10px] left-[-10px] right-[-10px] min-w-[160px] z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus:opacity-100 group-focus:pointer-events-auto transition-all duration-200 bg-card border-2 border-border rounded-xl shadow-xl p-2 md:p-3 flex flex-col">
                  <div className="text-xs md:text-sm font-bold text-foreground mb-2 pb-1 border-b border-border flex justify-between items-center">
                    <span>{format(day, 'MMM d, yyyy')}</span>
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-[10px] font-medium">
                      {dayEntries.length}
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                    {dayEntries.map(entry => (
                      <div
                        key={entry.id}
                        className={`text-[10px] md:text-xs px-2 py-1.5 rounded flex flex-col gap-0.5 ${
                          entry.type === 'MEETING' ? 'bg-pastel-pink text-foreground' :
                          entry.type === 'TASK' ? 'bg-pastel-blue text-foreground' :
                          'bg-pastel-lavender text-foreground'
                        }`}
                      >
                        <span className="font-medium leading-tight">{entry.title}</span>
                        <span className="text-[9px] opacity-70">
                          {format(entry.scheduledTime, 'h:mm a')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-1.5 md:gap-3">
        {days.map((day) => {
          const dayEntries = getEntriesForDate(day);
          return (
            <div 
              key={day.toString()} 
              tabIndex={0}
              className="relative group cursor-pointer outline-none flex flex-col gap-1.5 md:gap-2 p-1 md:p-1.5 rounded-lg transition-all hover:bg-muted/30 focus:bg-muted/30 hover:z-50 focus:z-50"
            >
              {/* Normal Grid View */}
              <div className={`text-center p-2 md:p-3 rounded-md md:rounded-lg ${
                isToday(day) ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <div className="text-[10px] md:text-xs font-medium">{format(day, 'EEE')}</div>
                <div className="text-base md:text-xl font-bold mt-0.5 md:mt-1">{format(day, 'd')}</div>
              </div>
              <div className="space-y-1 md:space-y-2 flex-1">
                {dayEntries.slice(0, 4).map(entry => (
                  <div
                    key={entry.id}
                    className={`p-1.5 md:p-2 rounded-md md:rounded-lg text-[10px] md:text-xs ${
                      entry.type === 'MEETING' ? 'bg-pastel-pink text-foreground border-2 border-pastel-pink' :
                      entry.type === 'TASK' ? 'bg-pastel-blue text-foreground border-2 border-pastel-blue' :
                      'bg-pastel-lavender text-foreground border-2 border-pastel-lavender'
                    }`}
                  >
                    <div className="font-medium truncate">{entry.title}</div>
                    <div className="text-muted-foreground mt-0.5 md:mt-1 hidden sm:block">
                      {format(entry.scheduledTime, 'h:mm a')}
                    </div>
                  </div>
                ))}
                {dayEntries.length > 4 && (
                  <div className="text-[10px] md:text-xs text-muted-foreground font-medium text-center">
                    +{dayEntries.length - 4} more
                  </div>
                )}
              </div>

              {/* POPOVER OVERLAY */}
              {dayEntries.length > 0 && (
                <div className="absolute top-0 left-[-5px] right-[-5px] md:left-[-10px] md:right-[-10px] min-w-[160px] z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus:opacity-100 group-focus:pointer-events-auto transition-all duration-200 bg-card border-2 border-border rounded-xl shadow-xl p-2 md:p-3 flex flex-col">
                  <div className="text-xs md:text-sm font-bold text-foreground mb-2 pb-1 border-b border-border flex justify-between items-center">
                    <span>{format(day, 'MMM d, yyyy')}</span>
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-[10px] font-medium">
                      {dayEntries.length}
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                    {dayEntries.map(entry => (
                      <div
                        key={entry.id}
                        className={`text-[10px] md:text-xs px-2 py-1.5 rounded flex flex-col gap-0.5 ${
                          entry.type === 'MEETING' ? 'bg-pastel-pink text-foreground' :
                          entry.type === 'TASK' ? 'bg-pastel-blue text-foreground' :
                          'bg-pastel-lavender text-foreground'
                        }`}
                      >
                        <span className="font-medium leading-tight">{entry.title}</span>
                        <span className="text-[9px] opacity-70">
                          {format(entry.scheduledTime, 'h:mm a')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEntries = getEntriesForDate(currentDate).sort(
      (a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime()
    );

    return (
      <div className="space-y-2 md:space-y-3">
        <div className="text-center p-4 md:p-6 bg-primary text-primary-foreground rounded-lg md:rounded-xl">
          <div className="text-xs md:text-sm font-medium">{format(currentDate, 'EEEE')}</div>
          <div className="text-3xl md:text-4xl font-bold mt-1 md:mt-2">{format(currentDate, 'd')}</div>
          <div className="text-xs md:text-sm mt-0.5 md:mt-1">{format(currentDate, 'MMMM yyyy')}</div>
        </div>
        <div className="space-y-2 md:space-y-3">
          {dayEntries.length === 0 ? (
            <div className="text-center py-8 md:py-12 text-sm md:text-base text-muted-foreground">
              No events scheduled for this day
            </div>
          ) : (
            dayEntries.map(entry => (
              <div
                key={entry.id}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 ${
                  entry.type === 'MEETING' ? 'bg-pastel-pink/30 border-pastel-pink' :
                  entry.type === 'TASK' ? 'bg-pastel-blue/30 border-pastel-blue' :
                  'bg-pastel-lavender/30 border-pastel-lavender'
                }`}
              >
                <div className="font-medium text-sm md:text-base text-foreground">{entry.title}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                  {format(entry.scheduledTime, 'h:mm a')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 md:gap-2 justify-center sm:justify-start">
          <button
            onClick={() => navigate('prev')}
            className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <h3 className="text-base md:text-xl font-semibold min-w-36 md:min-w-48 text-center text-foreground">
            {viewType === 'day' && format(currentDate, 'MMM d, yyyy')}
            {viewType === 'week' && (
              <span className="hidden sm:inline">Week of {format(startOfWeek(currentDate), 'MMM d, yyyy')}</span>
            )}
            {viewType === 'week' && (
              <span className="sm:hidden">{format(startOfWeek(currentDate), 'MMM d')}</span>
            )}
            {viewType === 'month' && format(currentDate, 'MMMM yyyy')}
          </h3>
          <button
            onClick={() => navigate('next')}
            className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors touch-manipulation"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        <div className="flex gap-1.5 md:gap-2 bg-muted p-1 rounded-lg">
          {['day', 'week', 'month'].map(type => (
            <button
              key={type}
              onClick={() => onViewTypeChange(type)}
              className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-md capitalize transition-all touch-manipulation ${
                viewType === type
                  ? 'bg-card shadow-sm text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      {viewType === 'month' && renderMonthView()}
      {viewType === 'week' && renderWeekView()}
      {viewType === 'day' && renderDayView()}
    </div>
  );
}