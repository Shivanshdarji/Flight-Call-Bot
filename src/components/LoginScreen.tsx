import React, { useState } from 'react';
import { Plane, Ticket, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_USERS, UserAccount } from '../mockData';

interface LoginScreenProps {
  onLogin: (user: UserAccount) => void;
  error?: string;
}

export default function LoginScreen({ onLogin, error: propError }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Simple mock auth
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && password === 'password') { // Hardcoded password for demo
      onLogin(user);
    } else {
      setLocalError('Invalid email or password. Hint: try user@skyjet.com / password');
    }
  };

  const handleDemoFill = () => {
    setEmail('user@skyjet.com');
    setPassword('password');
  };

  const error = propError || localError;

  return (
    <div id="login-view" className="relative flex-grow flex items-center justify-center p-4 md:p-10 min-h-[calc(100vh-8rem)]">
      {/* Background Image Accent */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="bg-cover bg-center w-full h-full transform scale-105"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4bnNYw67_IDN0MNhkl-rbx44zJszBr4wJEl9zFdQqfzNa1mCWwBrLE68-M_0AjBU6em6f55rLQV-NNwIQZQEzZA47lILpkFkt5huBJjCQJ3p6CW48Zsl2XGbLbgfp4Tm04wrT_7JHm5K33x3yM8eH1iuFwXgnHGqsQGyBCXLHPUYAPwn2I3zGHOXd3CdZbcNQMClbFoV3ZbobdT3wDTqSFuxIOyecairtJn_FZE8qXU-n_y6Q3MwzQw')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Elevated Card */}
        <div id="login-card" className="bg-surface-container-lowest rounded-xl p-8 shadow-2xl border border-outline-variant/30 flex flex-col gap-6 backdrop-blur-xs">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane id="login-icon-plane" className="text-primary w-8 h-8 rotate-90" />
            </div>
            <h2 id="login-title" className="text-2xl md:text-3xl font-bold text-primary mb-2 leading-tight">
              Welcome to SkyJet
            </h2>
            <p id="login-subtitle" className="text-sm text-on-surface-variant">
              Log in to manage your bookings and view recovery options.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div id="login-error" className="flex items-start gap-2 bg-error-container text-on-error-container p-3 rounded-lg text-sm border border-error/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form id="login-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label id="label-email" className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                <input
                  className="h-12 w-full pl-12 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder-on-surface-variant/40 outline-hidden"
                  id="email"
                  name="email"
                  placeholder="e.g., user@skyjet.com"
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label id="label-password" className="text-xs font-semibold uppercase tracking-wider text-on-surface" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                <input
                  className="h-12 w-full pl-12 pr-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder-on-surface-variant/40 outline-hidden"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              id="btn-login"
              className="mt-2 h-12 w-full bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              type="submit"
            >
              Sign In
              <ArrowRight id="login-arrow" className="w-5 h-5 text-on-secondary-container" />
            </button>
          </form>

          {/* Demo Scenario Pill */}
          <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-3">
            <button
              id="demo-login-fill"
              type="button"
              onClick={handleDemoFill}
              className="px-4 py-2 rounded-full text-xs font-semibold border bg-surface-container border-outline-variant hover:border-primary text-on-surface hover:bg-primary/5 transition-colors cursor-pointer self-center"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
