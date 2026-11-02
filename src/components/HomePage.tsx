import React, { useState } from "react";
import type { ReactNode } from "react";
import {
  Sparkles,
  Flame,
  TrendingUp,
  Calendar,
  ShieldCheck,
  Zap,
  Trophy,
  ArrowRight,
  Play,
  Check,
  Plus,
  BarChart3,
  Clock,
  Target,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import "./HomePage.css";
import type { Plan } from "../App";
type HomePageProps = {
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onTryTracker: () => void;
  plan: Plan;
  onSelectPlan: (plan: Plan) => void;
  renderTracker: (onBack: () => void) => ReactNode;
};
export default function HomePage({
  isAuthenticated,
  onSignIn,
  onSignOut,
  onTryTracker,
  plan,
  onSelectPlan,
  renderTracker,
}: HomePageProps) {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<"home" | "tracker" | "auth">(
    "home",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const legacyWorkspaceEnabled = false;
  function handleTryTracker() {
    setCurrentView("tracker");
    onTryTracker();
  }
  function handleSelectPlan(nextPlan: Plan) {
    onSelectPlan(nextPlan);
    setCurrentView("tracker");
    onTryTracker();
  }
  const isWorkingWithTracker = isAuthenticated && currentView === "tracker";
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Morning Meditation & Breathing",
      target: "10 min",
      category: "Mindset",
      completed: true,
      streak: 14,
      icon: "🧘‍♂️",
    },
    {
      id: 2,
      name: "Deep Work & Coding",
      target: "2 hours",
      category: "Productivity",
      completed: true,
      streak: 28,
      icon: "⚡",
    },
    {
      id: 3,
      name: "Gym / Strength Training",
      target: "45 min",
      category: "Health",
      completed: false,
      streak: 6,
      icon: "💪",
    },
    {
      id: 4,
      name: "Read 20 Pages of Non-Fiction",
      target: "20 pgs",
      category: "Growth",
      completed: false,
      streak: 12,
      icon: "📚",
    },
    {
      id: 5,
      name: "Cold Shower & Recovery",
      target: "5 min",
      category: "Health",
      completed: true,
      streak: 9,
      icon: "🧊",
    },
  ]);

  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [selectedTab, setSelectedTab] = useState<
    "today" | "analytics" | "settings"
  >("today");
  const toggleHabit = (id: number) => {
    setHabits(
      habits.map((h) => {
        if (h.id === id) {
          const nextState = !h.completed;
          return {
            ...h,
            completed: nextState,
            streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      }),
    );
  };

  const deleteDemoHabit = (id: number) => {
    setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id));
  };
  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    const newH = {
      id: Date.now(),
      name: newHabitTitle,
      target: "Daily goal",
      category: "Custom",
      completed: false,
      streak: 1,
      icon: "🎯",
    };
    setHabits([...habits, newH]);
    setNewHabitTitle("");
  };
  const completedCount = habits.filter((h) => h.completed).length;
  const completionPercentage =
    Math.round((completedCount / habits.length) * 100) || 0;
  return (
    <div className="min-h-screen bg-[#070407] text-slate-100 font-sans selection:bg-[#800020] selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#800020]/30 via-[#4A0E17]/15 to-transparent blur-[140px] rounded-full opacity-70" />
        <div className="absolute top-[40%] -left-[200px] w-[600px] h-[600px] bg-[#4A0E17]/20 blur-[160px] rounded-full" />
        <div className="absolute top-[70%] -right-[200px] w-[700px] h-[700px] bg-[#800020]/15 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-[#ffffff03]_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
      </div>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070407]/80 border-b border-rose-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#800020] via-[#5c0317] to-[#1a0107] border border-rose-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(128,0,32,0.5)] group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-rose-300 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-rose-100 to-rose-400">
                HabitCraft
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#features"
              className="hover:text-rose-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-rose-400 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#demo"
              className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <span>
                {isWorkingWithTracker ? "Habit Tracker" : "Interactive Demo"}
              </span>
              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/50 px-1.5 py-0.5 rounded-full font-mono">
                Live
              </span>
            </a>
            <a
              href="#pricing"
              className="hover:text-rose-400 transition-colors"
            >
              Pricing
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={isAuthenticated ? onSignOut : onSignIn}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {isAuthenticated ? "Sign Out" : "Sign In"}
            </button>
            <button
              onClick={() => handleSelectPlan("premium-monthly")}
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm transition-all shadow-[0_0_25px_rgba(128,0,32,0.4)] hover:shadow-[0_0_35px_rgba(200,16,46,0.6)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-900 to-amber-700 rounded-xl animate-gradient" />
              <div className="relative px-5 py-2.5 bg-[#0e0609] rounded-[11px] transition-all group-hover:bg-opacity-80 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-rose-100 to-rose-200">
                  Get Premium
                </span>
              </div>
            </button>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0408] border-b border-rose-950/60 px-4 pt-2 pb-6 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 py-2"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 py-2"
            >
              How It Works
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 py-2"
            >
              {isWorkingWithTracker ? "Tracker" : "Demo"}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 py-2"
            >
              Pricing
            </a>
            <div className="pt-4 border-t border-rose-900/30 flex flex-col gap-3">
              <button
                onClick={() => {
                  (isAuthenticated ? onSignOut : onSignIn)();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-slate-200 border border-rose-900/40 rounded-lg"
              >
                {isAuthenticated ? "Sign Out" : "Sign In"}
              </button>
              <button
                onClick={() => {
                  handleSelectPlan("free");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 bg-gradient-to-r from-[#800020] to-[#5c0317] text-white font-semibold rounded-lg"
              >
                Try Tracker Free
              </button>
            </div>
          </div>
        )}
      </header>
      <main className="relative z-10">
        <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/50 border border-rose-800/40 text-rose-300 text-xs font-medium mb-8 backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span>HabitCraft v2.4 Release</span>
            <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            Transform Daily Intentions into <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-200 via-rose-400 to-rose-600 drop-shadow-[0_5px_30px_rgba(128,0,32,0.6)]">
              Unshakable Identity.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-400 leading-relaxed mb-10 font-normal">
            Ditch fragile streak counters. Master micro-habits, visualize deep
            analytical heatmaps, and build discipline with our agency-grade
            neuro-designed tracking environment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => handleSelectPlan("free")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#900C3F] via-[#800020] to-[#4A0E17] hover:from-[#a80e4b] hover:to-[#5c0d1d] text-white font-semibold text-base shadow-[0_0_40px_rgba(144,12,63,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 border border-rose-500/30 group"
            >
              <span>Try Tracker Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 text-slate-200 border border-rose-900/40 font-medium text-base transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>
                {isWorkingWithTracker
                  ? "View Habit Tracker"
                  : "Watch Live Demo"}
              </span>
            </a>
          </div>
          <div className="pt-4 border-t border-rose-950/40 max-w-3xl mx-auto flex flex-wrap justify-center items-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400" />
              <span>Real-time Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-rose-400" />
              <span>Streak Safeguard AI</span>
            </div>
          </div>
          <div
            id="demo"
            className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-rose-900/40 p-2 sm:p-4 bg-gradient-to-b from-rose-950/20 via-[#0a0307] to-[#070407] shadow-[0_0_100px_rgba(128,0,32,0.25)] backdrop-blur-2xl"
          >
            {currentView === "home" ? (
              <div>
                <div className="rounded-xl overflow-hidden bg-[#0c0509] border border-rose-900/30">
                  <div className="bg-[#12080e] px-4 py-3 border-b border-rose-950/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-3 text-xs text-slate-500 font-mono">
                        habitcraft.app/dashboard
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/40 text-rose-300 font-mono">
                        {isWorkingWithTracker ? "Habit Tracker" : "Live Demo"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                    <div className="space-y-6">
                      <div className="p-5 rounded-xl bg-gradient-to-b from-[#180a13] to-[#0e050b] border border-rose-900/30">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                          Today's Discipline
                        </span>
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-white">
                            {completionPercentage}%
                          </span>
                          <span className="text-xs text-rose-400">
                            ({completedCount}/{habits.length} Done)
                          </span>
                        </div>
                        <div className="w-full bg-rose-950/60 h-2.5 rounded-full mt-3 overflow-hidden p-[1px] border border-rose-900/40">
                          <div
                            className="bg-gradient-to-r from-[#800020] via-rose-600 to-rose-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(225,29,72,0.8)]"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="p-5 rounded-xl bg-[#140810] border border-rose-900/30 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#800020] to-[#3a040e] text-rose-300 border border-rose-500/20">
                          <Flame className="w-6 h-6 fill-rose-500/30" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            28 Days
                          </div>
                          <div className="text-xs text-slate-400">
                            Current Best Streak 🔥
                          </div>
                        </div>
                      </div>
                      <form
                        onSubmit={addHabit}
                        className="p-4 rounded-xl bg-[#10060d] border border-rose-900/30"
                      >
                        <label className="text-xs font-medium text-slate-300 block mb-2">
                          Test Dynamic Habit Addition
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newHabitTitle}
                            onChange={(e) => setNewHabitTitle(e.target.value)}
                            placeholder="e.g., Drink 3L Water"
                            className="flex-1 bg-rose-950/20 border border-rose-900/50 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                          />
                          <button
                            type="submit"
                            className="px-3 py-2 bg-[#800020] hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="lg:col-span-2 space-y-3">
                      <div className="flex items-center justify-between pb-2">
                        <h3 className="text-sm font-semibold text-slate-200">
                          Interactive Today's Protocol
                        </h3>
                        <span className="text-xs text-slate-500">
                          Click checkboxes to test logic
                        </span>
                      </div>
                      {habits.map((habit) => (
                        <div
                          key={habit.id}
                          onClick={() => toggleHabit(habit.id)}
                          className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                            habit.completed
                              ? "bg-[#150711]/90 border-rose-800/40 shadow-[0_0_15px_rgba(128,0,32,0.15)]"
                              : "bg-[#0d050a] border-rose-950/40 hover:border-rose-800/30"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <button
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                habit.completed
                                  ? "bg-gradient-to-r from-rose-600 to-[#800020] text-white shadow-[0_0_10px_rgba(225,29,72,0.6)]"
                                  : "border border-rose-800/50 hover:border-rose-500"
                              }`}
                            >
                              {habit.completed && (
                                <Check className="w-4 h-4 stroke-[3]" />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-base">{habit.icon}</span>
                                <span
                                  className={`text-sm font-medium ${habit.completed ? "line-through text-slate-400" : "text-slate-100"}`}
                                >
                                  {habit.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="text-rose-400/80">
                                  {habit.category}
                                </span>
                                <span>•</span>
                                <span>Target: {habit.target}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/40 border border-rose-900/30 text-rose-300 text-xs font-mono">
                            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>{habit.streak}d</span>
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteDemoHabit(habit.id);
                              }}
                              className="rounded-lg border border-rose-900/40 px-2 py-1 text-xs text-slate-500 transition hover:border-rose-500 hover:text-rose-300"
                              aria-label={`Delete ${habit.name}`}
                              title="Delete habit"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 text-center">
                        <button
                          onClick={handleTryTracker}
                          className="w-full py-3 rounded-xl border border-dashed border-rose-800/50 hover:border-rose-500/80 bg-rose-950/10 hover:bg-rose-950/30 text-rose-300 text-xs font-semibold tracking-wider uppercase transition flex items-center justify-center gap-2"
                        >
                          <span>Launch Full Custom Workspace</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {renderTracker(() => setCurrentView("home"))}
              </div>
            )}
          </div>
        </section>
        <section
          id="features"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rose-950/40"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono tracking-widest text-rose-400 mb-3">
              Engineered for Consistency
            </h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Everything you need to master your daily routines.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-[#12060d] to-[#0a0307] border border-rose-900/30 hover:border-rose-700/50 transition duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#800020]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#800020]/20 transition-all" />
              <div className="p-3 w-fit rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                GitHub-Style Heatmaps & Analytics
              </h3>
              <p className="text-slate-400 leading-relaxed max-w-md text-sm">
                Visualize your habit consistency across months with dense,
                glowing matrix grids. Identify routine gaps and momentum shifts
                instantly.
              </p>
              <div className="mt-8 pt-4 border-t border-rose-950/60 flex gap-2">
                {[...Array(18)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 flex-1 rounded bg-rose-950/80 border border-rose-900/40"
                    style={{ opacity: 0.3 + ((i * 7) % 10) * 0.07 }}
                  />
                ))}
              </div>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#12060d] to-[#0a0307] border border-rose-900/30 hover:border-rose-700/50 transition duration-300 relative overflow-hidden group">
              <div className="p-3 w-fit rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 mb-6">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Streak Safeguard
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Life happens. Freeze streaks up to 2 times a month without
                breaking psychological momentum or resetting your hard-earned
                progress.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#12060d] to-[#0a0307] border border-rose-900/30 hover:border-rose-700/50 transition duration-300 relative overflow-hidden group">
              <div className="p-3 w-fit rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Integrated Focus Timers
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Attach Pomodoro execution timers straight into deep work habits.
                Track hours directly logged against daily target goals.
              </p>
            </div>
            <div className="md:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-[#12060d] to-[#0a0307] border border-rose-900/30 hover:border-rose-700/50 transition duration-300 relative overflow-hidden group">
              <div className="p-3 w-fit rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Identity-Based Habit Loops
              </h3>
              <p className="text-slate-400 leading-relaxed max-w-md text-sm">
                Shift focus from outcomes ("Run a marathon") to identity
                ("Become an athlete"). Custom feedback loops reinforce core
                personal traits.
              </p>
            </div>
          </div>
        </section>
        <section
          id="pricing"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-rose-950/40"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-mono tracking-widest text-rose-400 mb-3">
              Simple & Transparent
            </h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Invest in your future self.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full">
            {/* FREE PLAN */}
            <div
              className={`p-8 rounded-2xl bg-[#0c050a] border flex flex-col justify-between min-w-0 ${
                plan === "free" ? "border-rose-500/70" : "border-rose-950/60"
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Essential tools for individual habit tracking.
                </p>

                <div className="text-4xl font-extrabold text-white mb-6">
                  $0{" "}
                  <span className="text-sm font-normal text-slate-500">
                    / forever
                  </span>
                </div>

                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400" />
                    <span>Up to 3 Active Habits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400" />
                    <span>Basic Streak Counter</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400" />
                    <span>Basic Progress Tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <X className="w-4 h-4 text-slate-500" />
                    <span>No reminders or full analytics</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan("free")}
                className={`w-full py-3 rounded-xl border transition font-medium ${
                  plan === "free"
                    ? "border-rose-500 bg-rose-950/40 text-white"
                    : "border-rose-900/50 hover:bg-rose-950/30 text-white"
                }`}
              >
                {plan === "free" ? "Current Plan" : "Choose Free"}
              </button>
            </div>

            {/* PREMIUM MONTHLY */}
            <div
              className={`p-8 rounded-2xl bg-gradient-to-b min-w-0 from-[#1c0813] to-[#0e040a] border-2 shadow-[0_0_50px_rgba(128,0,32,0.3)] relative flex flex-col justify-between ${
                plan === "premium-monthly"
                  ? "border-rose-400"
                  : "border-rose-600/50"
              }`}
            >
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-rose-600 to-[#800020] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-rose-400/30">
                Monthly
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  HabitCraft Premium
                </h3>
                <p className="text-xs text-slate-300 mb-6">
                  Full suite for serious high performers.
                </p>

                <div className="text-4xl font-extrabold text-white mb-6">
                  $4.99{" "}
                  <span className="text-sm font-normal text-slate-400">
                    / month
                  </span>
                </div>

                <ul className="space-y-3 text-sm text-slate-200 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400 stroke-[3]" />
                    <span>Unlimited Habits & Categories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400 stroke-[3]" />
                    <span>GitHub Heatmaps & Export Data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400 stroke-[3]" />
                    <span>Daily Habit Reminders</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400 stroke-[3]" />
                    <span>Full 12-Week Analytics & Heatmap</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan("premium-monthly")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#800020] via-rose-600 to-[#4A0E17] text-white font-bold transition shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:brightness-110"
              >
                {plan === "premium-monthly" ? "Current Plan" : "Choose Monthly"}
              </button>
            </div>

            {/* PREMIUM YEARLY */}
            <div
              className={`p-8 rounded-2xl bg-gradient-to-b from-[#1c0813] to-[#0e040a] border-2 relative flex flex-col justify-between min-w-0 ${
                plan === "premium-yearly"
                  ? "border-rose-400 shadow-[0_0_50px_rgba(128,0,32,0.3)]"
                  : "border-rose-600/50"
              }`}
            >
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-rose-400/30">
                Yearly
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  HabitCraft Premium
                </h3>
                <p className="text-xs text-slate-300 mb-6">
                  Full Premium access, billed annually.
                </p>

                <div className="text-4xl font-extrabold text-white mb-6">
                  $29.99{" "}
                  <span className="text-sm font-normal text-slate-400">
                    / year
                  </span>
                </div>

                <ul className="space-y-3 text-sm text-slate-200 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400 stroke-[3]" />
                    <span>Unlimited Habits & Categories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400 stroke-[3]" />
                    <span>GitHub Heatmaps & Export Data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400 stroke-[3]" />
                    <span>Daily Habit Reminders</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-rose-400 stroke-[3]" />
                    <span>Full 12-Week Analytics & Heatmap</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan("premium-yearly")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#800020] via-rose-600 to-[#4A0E17] text-white font-bold transition shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:brightness-110"
              >
                {plan === "premium-yearly" ? "Current Plan" : "Choose Yearly"}
              </button>
            </div>
          </div>
        </section>
        <footer className="border-t border-rose-950/40 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-slate-300 font-semibold">HabitCraft</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-rose-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-rose-400 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-rose-400 transition">
              Support
            </a>
          </div>
        </footer>
      </main>
      {legacyWorkspaceEnabled && currentView === "tracker" && (
        <div className="min-h-screen bg-[#080307] text-white flex flex-col">
          <div className="border-b border-rose-950/60 bg-[#0d050a] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                onClick={() => setCurrentView("home")}
                className="cursor-pointer flex items-center gap-2 text-rose-300 font-bold hover:opacity-80"
              >
                <Sparkles className="w-5 h-5 text-rose-500" />
                <span>HabitCraft Workspace</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 bg-rose-950/50 border border-rose-900/40 px-3 py-1 rounded-full">
                🔥 28 Day Streak Active
              </span>
              <button
                onClick={() => setCurrentView("home")}
                className="px-3 py-1.5 text-xs rounded-lg border border-rose-900/40 hover:bg-rose-950/40 text-slate-300 transition"
              >
                Exit Workspace
              </button>
            </div>
          </div>
          <div className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#12060e] border border-rose-900/30 space-y-2">
                <button
                  onClick={() => setSelectedTab("today")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${selectedTab === "today" ? "bg-[#800020] text-white" : "text-slate-400 hover:bg-rose-950/30"}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Today's Habits</span>
                </button>
                <button
                  onClick={() => setSelectedTab("analytics")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${selectedTab === "analytics" ? "bg-[#800020] text-white" : "text-slate-400 hover:bg-rose-950/30"}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics & Heatmap</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-[#12060e] border border-rose-900/30">
                <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-3">
                  Create New Habit
                </h4>
                <form onSubmit={addHabit} className="space-y-3">
                  <input
                    type="text"
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    placeholder="Habit Name..."
                    className="w-full bg-[#090307] border border-rose-900/40 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-[#800020] to-rose-700 hover:from-rose-700 hover:to-rose-600 text-white font-medium rounded-lg text-xs transition shadow-[0_0_15px_rgba(128,0,32,0.4)]"
                  >
                    Add Habit
                  </button>
                </form>
              </div>
            </div>
            <div className="md:col-span-3 space-y-4">
              <div className="p-6 rounded-xl bg-gradient-to-r from-[#160811] via-[#10050c] to-[#160811] border border-rose-900/30 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Daily Operations
                  </h2>
                  <p className="text-xs text-slate-400">
                    Keep standard momentum high.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-rose-400">
                    {completedCount} / {habits.length}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    Completed Today
                  </div>
                </div>
              </div>
              {selectedTab === "today" ? (
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        habit.completed
                          ? "bg-[#180914] border-rose-800/50 shadow-[0_0_15px_rgba(128,0,32,0.2)]"
                          : "bg-[#0e050b] border-rose-950/40 hover:border-rose-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                            habit.completed
                              ? "bg-rose-600 border-rose-500 text-white"
                              : "border-rose-800/50"
                          }`}
                        >
                          {habit.completed && (
                            <Check className="w-4 h-4 stroke-[3]" />
                          )}
                        </div>
                        <div>
                          <div
                            className={`font-medium text-sm ${habit.completed ? "line-through text-slate-400" : "text-slate-100"}`}
                          >
                            {habit.icon} {habit.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {habit.category} • Target: {habit.target}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/20 border border-amber-900/30 px-3 py-1 rounded-full font-mono">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{habit.streak} day streak</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-[#0f050b] border border-rose-900/30 space-y-6">
                  <h3 className="text-sm font-bold text-slate-200">
                    Consistency Matrix (Last 30 Days)
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(28)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-10 rounded-lg border flex items-center justify-center text-[10px] font-mono ${
                          i % 3 === 0
                            ? "bg-rose-600/80 border-rose-500 text-white shadow-[0_0_8px_rgba(225,29,72,0.5)]"
                            : "bg-rose-950/30 border-rose-900/30 text-slate-600"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {currentView === "auth" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 rounded-2xl bg-[#0f050b] border border-rose-900/40 shadow-[0_0_80px_rgba(128,0,32,0.4)] relative">
            <button
              onClick={() => setCurrentView("home")}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#800020] to-rose-700 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(128,0,32,0.5)]">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {authMode === "signin" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Access your HabitCraft workspace
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCurrentView("tracker");
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-[#070306] border border-rose-900/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#070306] border border-rose-900/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#800020] via-rose-700 to-[#4A0E17] text-white font-bold rounded-xl text-sm transition shadow-[0_0_20px_rgba(128,0,32,0.5)] hover:brightness-110"
              >
                {authMode === "signin"
                  ? "Sign In to Workspace"
                  : "Create Free Account"}
              </button>
            </form>
            <div className="mt-6 text-center text-xs text-slate-400">
              {authMode === "signin" ? (
                <span>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setAuthMode("signup")}
                    className="text-rose-400 underline"
                  >
                    Sign Up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("signin")}
                    className="text-rose-400 underline"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
