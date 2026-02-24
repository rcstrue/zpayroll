'use client';

import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>HRMS Pro - Manpower Management System</span>
        </div>
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()} All rights reserved.</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> in India
          </span>
        </div>
      </div>
    </footer>
  );
}
