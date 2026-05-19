import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function SystemActionFeed({ status, message }) {
  // If nothing is happening, don't render the box at all
  if (status === 'idle' || !message) return null;

  const statusConfig = {
    processing: {
      icon: Loader2,
      bgColor: 'bg-secondary/20',
      borderColor: 'border-secondary',
      textColor: 'text-secondary',
      iconClass: 'animate-spin',
    },
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-pastel-mint/50',
      borderColor: 'border-pastel-mint',
      textColor: 'text-foreground',
      iconClass: '',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-destructive/20',
      borderColor: 'border-destructive',
      textColor: 'text-destructive',
      iconClass: '',
    },
  };

  // Fallback just in case an unknown status is passed
  const config = statusConfig[status];
  if (!config) return null; 

  const Icon = config.icon;

  return (
    <div
      className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 ${config.bgColor} ${config.borderColor} flex items-start gap-2 md:gap-3 transition-all`}
    >
      <Icon className={`w-4 h-4 md:w-5 md:h-5 ${config.textColor} flex-shrink-0 mt-0.5 ${config.iconClass}`} />
      <p className={`${config.textColor} flex-1 text-xs md:text-sm font-medium`}>{message}</p>
    </div>
  );
}