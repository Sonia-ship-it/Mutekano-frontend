"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Calendar, Filter, Search, Play, Download, Trash2, Clock, Camera
} from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';

// Mock data for clips
const CLIPS = [
  { id: 1, title: 'Umuntu ku irembo', camera: "Irembo Rikuru", duration: "00:45", date: "Uyu munsi, 14:30", image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070&auto=format&fit=crop", type: 'alert' },
  { id: 2, title: 'Imodoka yinjiye', camera: "Irembo Rikuru", duration: "01:20", date: "Uyu munsi, 08:15", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop", type: 'normal' },
  { id: 3, title: 'Inka zirasohoka', camera: "Ikiraro k'inka", duration: "03:10", date: "Ejo, 06:45", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop", type: 'normal' },
  { id: 4, title: 'Ikintu kidasanzwe', camera: "Camera y'Inyuma", duration: "00:15", date: "Ejo, 23:10", image: "https://images.unsplash.com/photo-1456578051410-6c5df3afdf35?q=80&w=1969&auto=format&fit=crop", type: 'alert' },
  { id: 5, title: 'Amasuku mu gipangu', camera: "Camera y'Inyuma", duration: "05:00", date: "Mbere, 10:00", image: "https://images.unsplash.com/photo-1520696956247-f5dc94cb751f?q=80&w=2070&auto=format&fit=crop", type: 'normal' },
  { id: 6, title: 'Kugaburira inka', camera: "Ikiraro k'inka", duration: "10:30", date: "Mbere, 16:20", image: "https://images.unsplash.com/photo-1592424005632-4752b04f7678?q=80&w=1974&auto=format&fit=crop", type: 'normal' },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState('zose');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] font-sans pb-12 overflow-x-hidden">
      <TopNavbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10">

        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl lg:text-[2.5rem] font-black text-brand-brown tracking-tight mb-2">Amashusho</h1>
            <p className="text-brand-text/70 font-bold text-sm">Reba amashusho yafashwe n'ama camera yawe.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-grow md:flex-grow-0 hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/40" size={18} />
              <input type="text" placeholder="Shakisha amashusho..." className="w-full md:w-64 pl-12 pr-4 py-3 rounded-full bg-white border-2 border-white shadow-[0_5px_15px_rgba(0,0,0,0.02)] focus:outline-none focus:border-brand-brown/30 focus:ring-4 focus:ring-brand-brown/10 text-sm font-medium transition-all" />
            </div>

            {/* Date Filter */}
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-brand-text/5 hover:border-brand-brown/30 rounded-full font-bold text-xs text-brand-text shadow-sm transition-all">
              <Calendar size={16} className="text-brand-brown" />
              ITARIQI
            </button>

            {/* Type Filter */}
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-brand-text/5 hover:border-brand-brown/30 rounded-full font-bold text-xs text-brand-text shadow-sm transition-all">
              <Filter size={16} className="text-brand-brown" />
              UYUNGUZI
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex overflow-x-auto pb-4 mb-4 gap-3 no-scrollbar">
          {['Zose', 'Irembo Rikuru', "Ikiraro k'inka", "Camera y'Inyuma", 'Alerts'].map((cat, idx) => {
            const isAlert = cat === 'Alerts';
            const isActive = filter === cat.toLowerCase();
            return (
              <button
                key={idx}
                onClick={() => setFilter(cat.toLowerCase())}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${isActive
                    ? isAlert ? 'bg-red-500 text-white shadow-md' : 'bg-brand-brown text-white shadow-md'
                    : isAlert ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white text-brand-text/60 hover:bg-brand-text/5 shadow-sm'
                  }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Video Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
        >
          {CLIPS.map((clip) => (
            <motion.div key={clip.id} variants={itemVariants} className="group flex flex-col bg-white rounded-[2rem] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border-4 border-white hover:border-brand-text/5 transition-all cursor-pointer">
              {/* Thumbnail */}
              <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden relative mb-4">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${clip.image}")` }}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4">
                  {clip.type === 'alert' && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5 shadow-lg">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      ALERT
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg flex items-center gap-1.5">
                  <Clock size={12} />
                  {clip.duration}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 shadow-xl">
                  <Play size={24} fill="currentColor" className="ml-1" />
                </div>
              </div>

              {/* Info */}
              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-brand-text text-lg truncate pr-2">{clip.title}</h3>
                  <div className="flex gap-2">
                    <button className="text-brand-text/30 hover:text-brand-brown transition-colors"><Download size={18} /></button>
                    <button className="text-brand-text/30 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-black tracking-widest uppercase text-brand-text/50">
                  <div className="flex items-center gap-1.5">
                    <Camera size={12} />
                    {clip.camera}
                  </div>
                  <div className="w-1 h-1 bg-brand-text/20 rounded-full"></div>
                  <span>{clip.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </main>
    </div>
  );
}
