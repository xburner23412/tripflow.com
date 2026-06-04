/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExpenseItem } from '../types';
import { Wallet, Plus, Trash2, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BudgetDashboardProps {
  expenses: ExpenseItem[];
  onAddExpense: (title: string, amount: number, category: ExpenseItem['category'], date: string) => void;
  onDeleteExpense: (id: string) => void;
}

export default function BudgetDashboard({ expenses, onAddExpense, onDeleteExpense }: BudgetDashboardProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('Transport');
  const [newDate, setNewDate] = useState('2026-07-02');

  const categories: ExpenseItem['category'][] = [
    'Transport',
    'Accommodation',
    'Dining',
    'Sightseeing',
    'Shopping',
    'Other'
  ];

  // Calculations
  const totalSpend = expenses.reduce((sum, item) => sum + item.amount, 0);

  const statsByCategory = categories.map(cat => {
    const total = expenses.filter(i => i.category === cat).reduce((sum, item) => sum + item.amount, 0);
    return { name: cat, total, percentage: totalSpend > 0 ? (total / totalSpend) * 100 : 0 };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;
    const amountVal = parseFloat(newAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;
    
    onAddExpense(newTitle.trim(), amountVal, newCategory, newDate);
    setNewTitle('');
    setNewAmount('');
  };

  // Color mappings
  const categoryColors: Record<ExpenseItem['category'], { bg: string; fill: string; border: string; text: string }> = {
    Transport: { bg: 'bg-blue-500/20', fill: '#60a5fa', border: 'border-blue-500/30', text: 'text-blue-300' },
    Accommodation: { bg: 'bg-emerald-500/20', fill: '#34d399', border: 'border-emerald-500/30', text: 'text-emerald-300' },
    Dining: { bg: 'bg-rose-500/20', fill: '#fb7185', border: 'border-rose-500/30', text: 'text-rose-300' },
    Sightseeing: { bg: 'bg-amber-500/20', fill: '#fbbf24', border: 'border-amber-500/30', text: 'text-amber-300' },
    Shopping: { bg: 'bg-purple-500/20', fill: '#c084fc', border: 'border-purple-500/30', text: 'text-purple-300' },
    Other: { bg: 'bg-slate-500/20', fill: '#94a3b8', border: 'border-slate-500/30', text: 'text-slate-300' }
  };

  return (
    <div id="budget-dashboard-container" className="glass-panel rounded-3xl p-6 sm:p-8 text-white">
      {/* Title */}
      <div id="budget-header" className="mb-6 text-left">
        <h2 className="text-2xl font-serif font-semibold text-white tracking-tight flex items-center gap-2">
          <Wallet className="w-6 h-6 text-emerald-400 animate-pulse" />
          花销与预算看板 · Travel Budget Planner
        </h2>
        <p className="text-slate-350 text-sm mt-1">
          实时统计住宿、交通等行前/行中开销，随时追加调整，出行花费心中有数
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Section: Expenses Overview and custom visualizer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Visualizer Widget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/4 p-6 rounded-2xl border border-white/5">
            
            {/* Net Cost Counter */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">
                  当前预估总开销
                </span>
                <div className="text-4xl font-serif font-bold text-white mt-1.5 font-mono flex items-baseline gap-1">
                  €{totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs font-sans font-normal text-slate-450">EUR</span>
                </div>
                <p className="text-slate-350 text-xs mt-3 leading-relaxed">
                  包含您的3处指定酒店预订价格（共430欧），及
                  指定的火车票 (25欧)，加上估算的机票及交通花费。
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-2.5 bg-emerald-500/10 text-emerald-300 rounded-xl border border-emerald-500/15 text-xs font-semibold">
                <TrendingUp className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>明细清晰，未计入餐饮与当地买票开销</span>
              </div>
            </div>

            {/* Custom Interactive SVG Horizontal bar/doughnut and stats */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-2 font-mono">
                花销结构比例 · Cost Distribution
              </h4>
              <div className="space-y-2.5">
                {statsByCategory.map(stat => {
                  const colors = categoryColors[stat.name as ExpenseItem['category']];
                  if (stat.total === 0) return null;
                  return (
                    <div key={stat.name} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">
                          {stat.name === 'Transport' ? '🚆 交通' : 
                           stat.name === 'Accommodation' ? '🏨 住宿' : 
                           stat.name === 'Dining' ? '🍽️ 餐饮' : 
                           stat.name === 'Sightseeing' ? '🎟️ 经典门票' : 
                           stat.name === 'Shopping' ? '🛍️ 购物' : '🎒 其他'}
                        </span>
                        <span className="font-mono text-slate-200 font-extrabold">
                          €{stat.total} ({stat.percentage.toFixed(0)}%)
                        </span>
                      </div>
                      {/* Bar indicator */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.percentage}%` }}
                          transition={{ duration: 0.6 }}
                          style={{ backgroundColor: colors.fill }}
                          className="h-full rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* List of expenses with scrolling */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-450 tracking-wider uppercase font-mono">
              开销明细清单 · Expenses Itemized
            </h3>
            <div className="bg-white/4 rounded-2xl border border-white/6 p-4 max-h-[350px] overflow-y-auto space-y-2">
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-slate-450 text-sm">
                  暂无任何开销数据，请使用右侧表单添加
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {expenses.map((expense) => {
                    const colors = categoryColors[expense.category];
                    return (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                            {expense.category === 'Transport' ? '交通' : expense.category === 'Accommodation' ? '住宿' : expense.category === 'Dining' ? '餐饮' : expense.category === 'Sightseeing' ? '景点' : expense.category === 'Shopping' ? '购物' : '其他'}
                          </span>
                          <div className="truncate text-left border-l-0 pl-1">
                            <h4 className="text-white text-xs sm:text-sm font-bold truncate leading-tight">
                              {expense.title}
                            </h4>
                            <span className="text-[10px] text-slate-450 font-mono mt-0.5 inline-block">
                              🗓️ {expense.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-150 font-mono">
                            €{expense.amount}
                          </span>
                          <button
                            onClick={() => onDeleteExpense(expense.id)}
                            className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Add expense form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="bg-white/4 p-5 rounded-2xl border border-white/6 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 pb-2 border-b border-white/5">
              <span>👛 记一笔 · Add Record</span>
            </h3>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">
                花销事项 / 描述
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="例如: 维也纳晚餐、布拉格城堡票"
                className="w-full glass-input border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <label className="block text-[11px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">
                  硬币金额 (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  placeholder="25"
                  className="w-full glass-input border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">
                  分类
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as ExpenseItem['category'])}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c} className="bg-slate-950 text-white">
                      {c === 'Transport' ? '🚆 交通' : 
                       c === 'Accommodation' ? '🏨 住宿' : 
                       c === 'Dining' ? '🍽️ 餐饮' : 
                       c === 'Sightseeing' ? '🎟️ 景点' : 
                       c === 'Shopping' ? '🛍️ 购物' : '🎒 其他'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-405 uppercase tracking-wider mb-1.5">
                支出日期
              </label>
              <input
                type="date"
                min="2026-07-02"
                max="2026-07-20"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full glass-input border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              记入统计 · Record Cost
            </button>
          </form>

          {/* Quick tips about currency */}
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-bounce-slow" />
            <div>
              <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                欧洲旅行货币换算
              </h5>
              <p className="text-slate-300 text-[10px] leading-relaxed mt-0.5 text-left font-normal">
                本面板采用欧元计价。捷克克朗(CZK)及匈牙利福林(HUF)可用 1:25及1:395 比例折合成欧元直接记账。
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
