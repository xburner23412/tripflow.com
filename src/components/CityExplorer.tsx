/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { cityData } from '../data';
import { CityInfo, ItineraryItem } from '../types';
import { Compass, Landmark, Banknote, Navigation, Calendar, Train, Plane, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CityExplorerProps {
  itinerary: ItineraryItem[];
  onSelectCityInTimeline: (cityName: string) => void;
}

export default function CityExplorer({ itinerary, onSelectCityInTimeline }: CityExplorerProps) {
  const [activeCityId, setActiveCityId] = useState<string>('lisbon');

  const activeCity = cityData.find(c => c.id === activeCityId) || cityData[0];

  // Get active city events in our itinerary
  const cityEvents = itinerary.filter(item => 
    item.city.toLowerCase().includes(activeCity.name.toLowerCase()) ||
    activeCity.name.toLowerCase().includes(item.city.toLowerCase())
  );

  return (
    <div id="city-explorer-container" className="glass-panel rounded-3xl p-6 sm:p-8 text-white">
      {/* Header */}
      <div id="city-explorer-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400 animate-spin-slow" />
            城市探险指南 · Destination Insights
          </h2>
          <p className="text-slate-350 text-sm mt-1">
            点击下方城市卡片，快速浏览目的地信息、当地交通及关联日程安排
          </p>
        </div>
        
        {/* City Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/5 max-w-full overflow-x-auto">
          {cityData.map((city) => {
            const isActive = city.id === activeCityId;
            return (
              <button
                id={`tab-city-${city.id}`}
                key={city.id}
                onClick={() => setActiveCityId(city.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {city.chineseName}
                <span className="text-[10px] ml-1 opacity-75 font-mono">{city.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* City Detail Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCityId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in"
        >
          {/* Left Column: Stats & Description */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                  {activeCity.country}
                </span>
                <span className="bg-white/5 text-slate-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-white/10">
                  <Banknote className="w-3.5 h-3.5 text-slate-400" />
                  {activeCity.currency}
                </span>
              </div>

              <h1 className="text-4xl font-serif font-black text-white tracking-tight flex items-baseline gap-2">
                {activeCity.chineseName}
                <span className="text-xl font-sans font-normal text-slate-400 font-mono italic">
                  {activeCity.name}
                </span>
              </h1>
              
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base mt-4 font-normal">
                {activeCity.description}
              </p>

              {/* Highlights section */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5 font-mono">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  景点必打卡 · Top Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeCity.highlights.map((highlight, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2.5 bg-white/4 hover:bg-white/8 p-3.5 rounded-xl border border-white/5 transition-all text-left"
                    >
                      <span className="w-5.5 h-5.5 bg-emerald-600/35 text-emerald-200 text-xs font-mono font-bold flex items-center justify-center rounded-lg border border-emerald-500/30">
                        {idx + 1}
                      </span>
                      <span className="text-slate-250 text-xs sm:text-sm font-semibold">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transportation advice */}
              <div className="mt-6 p-4 bg-white/4 rounded-2xl border border-white/6 flex gap-3 text-left">
                <div className="p-2 bg-emerald-600/30 rounded-xl h-fit border border-emerald-500/20 shrink-0">
                  <Navigation className="w-5 h-5 text-emerald-350" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider mb-1">
                    当地交通贴士 · Local Travel Tips
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {activeCity.localTransportation}
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-300 font-bold font-sans">
                    汇率参考：<span className="font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-emerald-350">{activeCity.exchangeRate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Events scheduled in this city */}
          <div className="lg:col-span-5 bg-white/4 p-5 rounded-3xl border border-white/6 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1.5 font-mono">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  当前行程预订 ({cityEvents.length})
                </h3>
                {cityEvents.length > 0 && (
                  <button 
                    onClick={() => onSelectCityInTimeline(activeCity.chineseName)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-350 hover:underline transition-all cursor-pointer"
                  >
                    去时间轴查看 →
                  </button>
                )}
              </div>

              {cityEvents.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="text-slate-400 text-sm mb-2">在该城市暂无单独行程节点</div>
                  <button 
                    onClick={() => onSelectCityInTimeline('')}
                    className="text-xs text-emerald-400 underline font-semibold hover:text-emerald-350 cursor-pointer"
                  >
                    查看全部时间轴
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
                  {cityEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all text-white"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg flex items-center justify-center ${
                            event.type === 'flight' ? 'bg-blue-500/20 text-blue-300' :
                            event.type === 'hotel' ? 'bg-emerald-500/20 text-emerald-300' :
                            event.type === 'train' ? 'bg-violet-500/20 text-violet-300' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {event.type === 'flight' && <Plane className="w-3.5 h-3.5" />}
                            {event.type === 'hotel' && <Landmark className="w-3.5 h-3.5" />}
                            {event.type === 'train' && <Train className="w-3.5 h-3.5" />}
                            {event.type === 'daytrip' && <MapPin className="w-3.5 h-3.5" />}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-300">
                            {event.date.substring(5)}
                          </span>
                        </div>
                        {event.price ? (
                          <span className="text-xs font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">
                            €{event.price}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono italic">待定</span>
                        )}
                      </div>
                      <h4 className="text-white text-xs sm:text-sm font-bold mt-2 line-clamp-1 leading-tight">
                        {event.title}
                      </h4>
                      <p className="text-slate-350 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                        {event.details}
                      </p>
                      {event.timeLine && (
                        <div className="mt-2 text-[10px] bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded w-fit font-mono">
                          🕒 {event.timeLine}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono italic">
                提示: 双击或拖动可保存或标记
              </span>
              <div className="h-6 w-1/3 bg-radial-gradient from-transparent to-emerald-500/5 rounded"></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
