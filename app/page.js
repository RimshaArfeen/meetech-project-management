
"use client"

import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Github,
  Chrome,
  ListTodo,
  CheckCircle2
} from 'lucide-react';

const App = () => {

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4 font-sans text-text-body">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-3xl"></div>
      </div>
hii
    </div>
  );
};

export default App;