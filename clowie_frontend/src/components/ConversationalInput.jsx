import { useState } from 'react';
import { Send } from 'lucide-react';

export function ConversationalInput({ onSubmit }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput(''); // Clear the box after sending
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:gap-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Hey Clowie, schedule a meeting..."
        className="w-full h-24 md:h-32 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-card border-2 border-border rounded-lg md:rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
        onKeyDown={(e) => {
          // Allows user to press "Enter" to submit, but "Shift+Enter" for a new line
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        className="self-end px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm touch-manipulation"
      >
        <span className="font-medium">Send to Clowie</span>
        <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </button>
    </form>
  );
}