/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PackingItem } from '../types';
import { CheckSquare, Square, Plus, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PackingChecklistProps {
  items: PackingItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string, category: PackingItem['category'], essential: boolean) => void;
  onDeleteItem: (id: string) => void;
  onResetList: () => void;
}

export default function PackingChecklist({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onResetList
}: PackingChecklistProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState<PackingItem['category']>('Documents');
  const [newEssential, setNewEssential] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Documents' | 'Clothing' | 'Electronics' | 'Toiletries' | 'Other'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [essentialOnly, setEssentialOnly] = useState(false);

  const categories: PackingItem['category'][] = ['Documents', 'Clothing', 'Electronics', 'Toiletries', 'Other'];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newCategory, newEssential);
    setNewItemName('');
  };

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEssential = !essentialOnly || item.essential;
    return matchesTab && matchesSearch && matchesEssential;
  });

  const totalCount = filteredItems.length;
  const packedCount = filteredItems.filter(i => i.checked).length;
  const percentPacked = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  return (
    <div id="packing-checklist-container" className="glass-panel rounded-3xl p-6 sm:p-8 text-white">
      {/* Title & Actions */}
      <div id="packing-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 text-left">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-amber-400 animate-pulse" />
            行李打包清单 · Packing Checklist
          </h2>
          <p className="text-slate-350 text-sm mt-1">
            精心整理的申根行囊，随手打勾，确保旅途没有任何遗落
          </p>
        </div>
        <button
          onClick={onResetList}
          className="text-xs font-bold text-slate-300 hover:text-red-400 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer h-fit self-end md:self-center"
        >
          重置行李清单 · Reset List
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white/4 rounded-2xl p-4 mb-6 border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 text-left">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              整理状态进度 · Packed Status
            </span>
            <span className="text-sm font-extrabold font-mono text-emerald-400">
              {packedCount} / {totalCount} ({percentPacked}%)
            </span>
          </div>
          {/* Progress bar background */}
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentPacked}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-linear-to-r from-emerald-500 to-emerald-700 transition-all"
            ></motion.div>
          </div>
        </div>
        <div className="md:col-span-4 flex justify-end gap-2">
          {/* Essential filter */}
          <button
            onClick={() => setEssentialOnly(!essentialOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              essentialOnly
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            仅看核心必备
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Column: Form & Category Filters */}
        <div className="lg:col-span-4 space-y-6">
          {/* Create Form */}
          <form onSubmit={handleCreate} className="bg-white/4 p-5 rounded-2xl border border-white/6 space-y-4">
            <h3 className="text-sm font-bold text-white mb-1 pb-2 border-b border-white/5">添加新物品 · Add Item</h3>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                物品名称
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                placeholder="例如: 维也纳会特制耳塞、牙刷"
                className="w-full glass-input border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                  类别
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as PackingItem['category'])}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c} className="bg-slate-950 text-white">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                  属性
                </label>
                <button
                  type="button"
                  onClick={() => setNewEssential(!newEssential)}
                  className={`w-full px-2 py-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    newEssential
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  {newEssential ? '⚠️ 核心必备' : '普通物品'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              加入清单 · Add to List
            </button>
          </form>

          {/* Quick Categories list */}
          <div className="space-y-1">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 font-mono">
              按品类筛选 · Categories
            </h4>
            <button
              onClick={() => setActiveTab('All')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer border ${
                activeTab === 'All' 
                  ? 'bg-emerald-600/35 text-white border-emerald-500/50' 
                  : 'text-slate-300 border-transparent hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>📁 全部物品 (All)</span>
              <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
                {items.length}
              </span>
            </button>
            {categories.map(cat => {
              const catCount = items.filter(i => i.category === cat).length;
              const catIcon = 
                cat === 'Documents' ? '📇' :
                cat === 'Clothing' ? '👕' :
                cat === 'Electronics' ? '🔌' :
                cat === 'Toiletries' ? '🧴' : '🎒';
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer border ${
                    activeTab === cat 
                      ? 'bg-emerald-600/35 text-white border-emerald-500/50' 
                      : 'text-slate-300 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{catIcon} {cat}</span>
                  <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
                    {catCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Checklist */}
        <div className="lg:col-span-8">
          <div className="bg-white/4 rounded-2xl p-4 border border-white/6 min-h-[380px] flex flex-col">
            {/* Search filter */}
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索清单中的行李物品..."
              className="w-full bg-slate-900/60 border border-white/10 px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none rounded-xl mb-4"
            />

            {filteredItems.length === 0 ? (
              <div className="grow flex flex-col items-center justify-center py-16 text-center">
                <p className="text-slate-400 text-sm font-semibold">
                  没有找到匹配的物品
                </p>
                <p className="text-[11px] text-slate-450 mt-1">
                  换个关键词或者调整上方的分类筛选试试吧！
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        item.checked
                          ? 'bg-slate-950/20 border-white/5 text-slate-500 line-through'
                          : 'bg-slate-900/40 border-white/10 text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 select-none flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => onToggleItem(item.id)}
                          className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-hidden cursor-pointer shrink-0"
                        >
                          {item.checked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Square className="w-4.5 h-4.5 text-slate-500" />
                          )}
                        </button>
                        <span className="text-xs sm:text-sm font-semibold truncate text-left">
                          {item.name}
                        </span>
                        {item.essential && (
                          <span className="text-[8px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0 uppercase tracking-wider font-mono">
                            必备
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-450 font-bold hidden sm:inline">
                          {item.category}
                        </span>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="hover:text-red-400 text-slate-400 p-1.5 rounded-md hover:bg-white/5 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
