@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 220 20% 4%;
    --foreground: 210 20% 98%;
    --card: 220 20% 6%;
    --card-foreground: 210 20% 98%;
    --popover: 220 20% 6%;
    --popover-foreground: 210 20% 98%;
    --primary: 166 76% 50%;
    --primary-foreground: 220 20% 4%;
    --secondary: 220 15% 12%;
    --secondary-foreground: 210 20% 98%;
    --muted: 220 15% 15%;
    --muted-foreground: 215 15% 55%;
    --accent: 166 76% 50%;
    --accent-foreground: 220 20% 4%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 15% 18%;
    --input: 220 15% 12%;
    --ring: 166 76% 50%;
    --chart-1: 166 76% 50%;
    --chart-2: 0 72% 51%;
    --chart-3: 45 93% 47%;
    --chart-4: 200 80% 50%;
    --chart-5: 280 65% 60%;
    --radius: 0.5rem;
    --sidebar-background: 220 20% 6%;
    --sidebar-foreground: 210 20% 98%;
    --sidebar-primary: 166 76% 50%;
    --sidebar-primary-foreground: 220 20% 4%;
    --sidebar-accent: 220 15% 12%;
    --sidebar-accent-foreground: 210 20% 98%;
    --sidebar-border: 220 15% 18%;
    --sidebar-ring: 166 76% 50%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .glow-cyan {
    box-shadow: 0 0 20px rgba(45, 212, 191, 0.3);
  }
  
  .glow-cyan-sm {
    box-shadow: 0 0 10px rgba(45, 212, 191, 0.2);
  }
  
  .cyber-grid {
    background-image: 
      linear-gradient(rgba(45, 212, 191, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(45, 212, 191, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  
  .terminal-cursor {
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .typing-effect {
    overflow: hidden;
    border-right: 2px solid hsl(var(--primary));
    animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
  }
  
  @keyframes typing {
    from { width: 0; }
    to { width: 100%; }
  }
  
  @keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: hsl(var(--primary)); }
  }
}
