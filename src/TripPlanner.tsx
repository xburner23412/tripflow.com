/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ItineraryItem, ExpenseItem, PackingItem } from './types';
import { initialItinerary, initialExpenses, initialPackingList } from './data';
import CityExplorer from './components/CityExplorer';
import PackingChecklist from './components/PackingChecklist';
import BudgetDashboard from './components/BudgetDashboard';
import { 
  Plane, Train, Calendar, Plus, Save, Clock, Search, ExternalLink, 
  MapPin, Edit, Trash2, Heart, Download, Upload, RefreshCw, 
  ChevronRight, Hotel, Compass, Lightbulb, Bell, Layers, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Itinerary persistence
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    try {
      const saved = localStorage.getItem('europe_itinerary');
      return saved ? JSON.parse(saved) : initialItinerary;
    } catch {
      return initialItinerary;
    }
  });

  // Expense persistence
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem('europe_expenses');
      return saved ? JSON.parse(saved) : initialExpenses;
    } catch {
      return initialExpenses;
    }
  });

  // Packing list persistence
  const [packingList, setPackingList] = useState<PackingItem[]>(() => {
    try {
      const saved = localStorage.getItem('europe_packing');
      return saved ? JSON.parse(saved) : initialPackingList;
    } catch {
      return initialPackingList;
    }
  });

  // Active view tab in main container
  const [activeSegment, setActiveSegment] = useState<'timeline' | 'cities' | 'expenses' | 'checklist'>('timeline');
  const [filterType, setFilterType] = useState<ItineraryItem['type'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

  // Editing state for event drawer
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDate, setEditingDate] = useState('');
  const [editingTimeLine, setEditingTimeLine] = useState('');
  const [editingPrice, setEditingPrice] = useState('');
  const [editingDetails, setEditingDetails] = useState('');
  const [editingLocation, setEditingLocation] = useState('');
  const [editingDuration, setEditingDuration] = useState('');
  const [editingStatus, setEditingStatus] = useState<'confirmed' | 'pending'>('confirmed');

  // Trigger countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  // Live Map Tracking state linked with Google Maps embed
  const [selectedMapQuery, setSelectedMapQuery] = useState<string>('Avenida Garden Apartments, Lisbon');

  // Toast notification state
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem('tripflow_current_user');
    } catch {
      return null;
    }
  });

  // PWA Install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState<boolean>(false);

  // Auto clear toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = authEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthError('请输入有效邮箱地址。');
      return;
    }

    if (authPassword.length < 6) {
      setAuthError('密码至少需要 6 位。');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('tripflow_users') || '{}');

      if (authMode === 'register') {
        if (users[email]) {
          setAuthError('这个邮箱已经注册，请直接登录。');
          return;
        }

        users[email] = { password: authPassword, createdAt: new Date().toISOString() };
        localStorage.setItem('tripflow_users', JSON.stringify(users));
      } else if (!users[email] || users[email].password !== authPassword) {
        setAuthError('邮箱或密码不正确。');
        return;
      }

      localStorage.setItem('tripflow_current_user', email);
      setCurrentUser(email);
      setAuthError('');
      setAuthPassword('');
    } catch {
      setAuthError('登录信息保存失败，请确认浏览器允许本地存储。');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tripflow_current_user');
    setCurrentUser(null);
    setAuthPassword('');
  };

  // Handle PWA installation prompt detection
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
      setToast({ text: '💡 检测到浏览器支持！您可以直接点击上方【安装桌面软件】将 TripFlow 存为本地应用。', type: 'success' });
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also check if app is already running in standalone mode (installed as software)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setShowInstallBtn(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      setToast({ text: 'ℹ️ 您的系统已安装此应用，或正在使用独立软件模式运行！', type: 'success' });
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User installation choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
    if (outcome === 'accepted') {
      setToast({ text: '🎉 感谢安装！TripFlow 已成功添加至您的桌面/开始菜单。', type: 'success' });
    }
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('europe_itinerary', JSON.stringify(itinerary));
  }, [itinerary]);

  useEffect(() => {
    localStorage.setItem('europe_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('europe_packing', JSON.stringify(packingList));
  }, [packingList]);

  // Calculate live countdown to July 2, 2026
  useEffect(() => {
    const calculateTime = () => {
      const target = new Date('2026-07-02T13:00:00Z').getTime();
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft({ days: d, hours: h, minutes: m });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  // Filtered itinerary
  const filteredItinerary = useMemo(() => {
    return itinerary.filter(item => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = !selectedDateFilter || item.date === selectedDateFilter;
      return matchesType && matchesSearch && matchesDate;
    }).sort((a, b) => {
      // Sort by date, then by timeline start if available
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      
      const aTime = a.timeLine ? a.timeLine.split('-')[0].trim() : 'zz';
      const bTime = b.timeLine ? b.timeLine.split('-')[0].trim() : 'zz';
      return aTime.localeCompare(bTime);
    });
  }, [itinerary, filterType, searchQuery, selectedDateFilter]);

  // Handle Timeline Date Select from City Explorer navigation
  const handleSelectCityInTimeline = (cityName: string) => {
    if (!cityName) {
      setSearchQuery('');
      setFilterType('all');
      setSelectedDateFilter(null);
    } else {
      setSearchQuery(cityName);
      setFilterType('all');
    }
    setActiveSegment('timeline');
    
    // Smooth scroll down to Timeline Anchor after short timeout
    setTimeout(() => {
      const el = document.getElementById('timeline-section-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Event Edit Launch
  const startEdit = (event: ItineraryItem) => {
    setEditingEventId(event.id);
    setEditingTitle(event.title);
    setEditingDate(event.date);
    setEditingTimeLine(event.timeLine || '');
    setEditingPrice(event.price ? event.price.toString() : '');
    setEditingDetails(event.details);
    setEditingLocation(event.location || '');
    setEditingDuration(event.duration || '');
    setEditingStatus(event.status || 'confirmed');
  };

  // Event Save changes
  const saveEventEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEventId) return;

    const priceNum = parseFloat(editingPrice);
    const updatedPrice = isNaN(priceNum) || priceNum < 0 ? undefined : priceNum;

    setItinerary(prev => prev.map(item => {
      if (item.id === editingEventId) {
        return {
          ...item,
          title: editingTitle,
          date: editingDate,
          timeLine: editingTimeLine,
          price: updatedPrice,
          details: editingDetails,
          location: editingLocation,
          duration: editingDuration,
          status: editingStatus
        };
      }
      return item;
    }));

    // Cascade update to expenses list
    setExpenses(prev => {
      const exists = prev.some(exp => exp.id === `auto-${editingEventId}`);
      if (updatedPrice !== undefined) {
        // Update or insert automated expense item
        if (exists) {
          return prev.map(exp => exp.id === `auto-${editingEventId}` ? {
            ...exp,
            amount: updatedPrice,
            title: `[Synced] ${editingTitle}`,
            date: editingDate
          } : exp);
        } else {
          return [
            ...prev,
            {
              id: `auto-${editingEventId}`,
              title: `[Synced] ${editingTitle}`,
              amount: updatedPrice,
              category: getExpenseCategoryFromEventType(editingEventId),
              date: editingDate
            }
          ];
        }
      } else {
        // If price removed, remove linked auto expense
        return prev.filter(exp => exp.id !== `auto-${editingEventId}`);
      }
    });

    setEditingEventId(null);
  };

  const getExpenseCategoryFromEventType = (eventId: string): ExpenseItem['category'] => {
    const item = itinerary.find(i => i.id === eventId);
    if (!item) return 'Other';
    if (item.type === 'flight' || item.type === 'train') return 'Transport';
    if (item.type === 'hotel') return 'Accommodation';
    if (item.type === 'daytrip') return 'Sightseeing';
    return 'Other';
  };

  // Add custom Event
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addType, setAddType] = useState<ItineraryItem['type']>('other');
  const [addDate, setAddDate] = useState('2026-07-08');
  const [addCity, setAddCity] = useState('Vienna');
  const [addTimeLine, setAddTimeLine] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addDetails, setAddDetails] = useState('');
  const [addLocation, setAddLocation] = useState('');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim()) return;

    const priceNum = parseFloat(addPrice);
    const itemPrice = isNaN(priceNum) ? undefined : priceNum;
    const newId = `custom-${Date.now()}`;

    const newEvent: ItineraryItem = {
      id: newId,
      type: addType,
      date: addDate,
      title: addTitle,
      city: addCity,
      timeLine: addTimeLine || undefined,
      price: itemPrice,
      details: addDetails,
      location: addLocation || undefined,
      status: 'confirmed'
    };

    setItinerary(prev => [...prev, newEvent]);

    if (itemPrice !== undefined) {
      const expCategory: ExpenseItem['category'] = 
        addType === 'hotel' ? 'Accommodation' :
        (addType === 'flight' || addType === 'train') ? 'Transport' : 'Other';

      setExpenses(prev => [
        ...prev,
        {
          id: `auto-${newId}`,
          title: `[Synced] ${addTitle}`,
          amount: itemPrice,
          category: expCategory,
          date: addDate
        }
      ]);
    }

    // Reset fields
    setAddTitle('');
    setAddType('other');
    setAddPrice('');
    setAddDetails('');
    setAddLocation('');
    setShowAddEventModal(false);
  };

  // Delete event node
  const handleDeleteEvent = (id: string) => {
    if (window.confirm('确定要删除这节行程安排吗？（关联的花销也将同步下架）')) {
      setItinerary(prev => prev.filter(item => item.id !== id));
      setExpenses(prev => prev.filter(exp => exp.id !== `auto-${id}`));
    }
  };

  // Packing logic
  const handleTogglePackingItem = (id: string) => {
    setPackingList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddPackingItem = (name: string, category: PackingItem['category'], essential: boolean) => {
    const newItem: PackingItem = {
      id: `pack-${Date.now()}`,
      category,
      name,
      checked: false,
      essential
    };
    setPackingList(prev => [...prev, newItem]);
  };

  const handleDeletePackingItem = (id: string) => {
    setPackingList(prev => prev.filter(item => item.id !== id));
  };

  const handleResetPackingList = () => {
    if (window.confirm('确定要重置打包清单到默认推荐指南吗？')) {
      setPackingList(initialPackingList);
    }
  };

  // Expense logic
  const handleAddExpense = (title: string, amount: number, category: ExpenseItem['category'], date: string) => {
    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title,
      amount,
      category,
      date
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  // Reset entire trip plan to user specifications config
  const handleResetAllData = () => {
    if (window.confirm('🚨 警告：此操作将清除您本地的所有修改，并恢复到原本的行进时间方案。是否确定重置？')) {
      setItinerary(initialItinerary);
      setExpenses(initialExpenses);
      setPackingList(initialPackingList);
      setSelectedDateFilter(null);
      setSearchQuery('');
      setFilterType('all');
    }
  };

  // Export profile
  const handleExportItinerary = () => {
    const backup = { itinerary, expenses, packingList };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Europe_Odyssey_Itinerary_Data.json';
    link.click();
    URL.revokeObjectURL(url);
    setToast({ text: '🎉 配置文件已成功导出保存！文件：Europe_Odyssey_Itinerary_Data.json', type: 'success' });
  };

  // Import profile
  const handleImportItinerary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && (Array.isArray(json.itinerary) || Array.isArray(json.expenses) || Array.isArray(json.packingList))) {
          if (json.itinerary) setItinerary(json.itinerary);
          if (json.expenses) setExpenses(json.expenses);
          if (json.packingList) setPackingList(json.packingList);
          setToast({ text: '⭐️ 配置导入成功！游玩方案、预算统计与行李打包已同步更新。', type: 'success' });
        } else {
          setToast({ text: '❌ 导入失败：选中文件不是合法的行程单备份数据。', type: 'error' });
        }
      } catch (err) {
        setToast({ text: '❌ 导入出错：无法解析选中的 JSON 文档。', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input to allow re-upload
  };

  // Budget calculations
  const totalTripCost = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  // July 2026 Calendar days matrix (July 1st is Wednesday, trip starts on July 2nd Thursday)
  const calendarDays = useMemo(() => {
    const days = [];
    // Pad first 3 days (Mon - Wed) representing late June
    for (let i = 0; i < 3; i++) {
      days.push({ day: null, dateStr: '' });
    }
    // July 1 - 31
    for (let d = 1; d <= 31; d++) {
      const dateStr = `2026-07-${d < 10 ? '0' + d : d}`;
      // Check if there are any events on this day
      const dayEvents = itinerary.filter(i => i.date === dateStr);
      days.push({
        day: d,
        dateStr,
        events: dayEvents,
        isTravelDay: dayEvents.length > 0,
        hasHotel: dayEvents.some(e => e.type === 'hotel'),
        hasFlight: dayEvents.some(e => e.type === 'flight'),
        hasTrain: dayEvents.some(e => e.type === 'train')
      });
    }
    return days;
  }, [itinerary]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-96 h-96 rounded-full bg-emerald-600/25 blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[8%] right-[-10%] w-96 h-96 rounded-full bg-teal-500/20 blur-[120px] pointer-events-none" />
        <form onSubmit={handleAuthSubmit} className="relative z-10 w-full max-w-md glass-panel rounded-3xl border border-white/10 shadow-2xl p-7 space-y-5">
          <div className="space-y-2 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">TripFlow</h1>
            <p className="text-sm text-slate-400">使用邮箱进入你的欧洲旅行计划</p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/5 p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
              }}
              className={`py-2 rounded-xl text-sm font-semibold transition-all ${authMode === 'login' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthError('');
              }}
              className={`py-2 rounded-xl text-sm font-semibold transition-all ${authMode === 'register' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              注册
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="邮箱地址"
              className="w-full px-4 py-3 rounded-2xl text-sm text-white focus:outline-hidden glass-input"
              autoComplete="email"
              required
            />
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="密码"
              className="w-full px-4 py-3 rounded-2xl text-sm text-white focus:outline-hidden glass-input"
              autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
              required
            />
          </div>

          {authError && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {authError}
            </div>
          )}

          <button type="submit" className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40 transition-all">
            {authMode === 'register' ? '创建账号' : '进入 TripFlow'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-900 selection:text-emerald-100 relative overflow-hidden pb-12">
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white backdrop-blur-md"
      >
        退出
      </button>
      
      {/* Background Animated Water Glass Flow Blobs */}
      <div className="absolute top-[8%] left-[-5%] w-96 h-96 rounded-full bg-emerald-600/25 blur-[110px] pointer-events-none animate-blob-1 z-0" />
      <div className="absolute top-[32%] right-[-5%] w-96 h-96 rounded-full bg-teal-500/20 blur-[120px] pointer-events-none animate-blob-2 z-0" />
      <div className="absolute bottom-[25%] left-[5%] w-96 h-96 rounded-full bg-green-700/15 blur-[110px] pointer-events-none animate-blob-1 z-0" />
      <div className="absolute bottom-[8%] right-[10%] w-80 h-80 rounded-full bg-emerald-500/12 blur-[100px] pointer-events-none animate-blob-2 z-0" />

      {/* Visual Ambient Banner Map Schematic */}
      <div className="relative w-full overflow-hidden bg-emerald-950/20 text-white min-h-[460px] flex flex-col justify-between border-b border-white/5 z-10 backdrop-blur-md">
        {/* Abstract connection line SVG background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 1440 400" fill="none">
            {/* Draw a gorgeous travel line linking different cities */}
            <path 
              d="M100,50 L250,300 L420,180 L600,280 L800,100 L990,260 L1150,80 L1300,220" 
              stroke="#34d399" 
              strokeWidth="2.5" 
              strokeDasharray="10 6" 
              className="animate-dash" 
            />
            <circle cx="100" cy="50" r="6" fill="#10b981" />
            <circle cx="250" cy="300" r="6" fill="#059669" />
            <circle cx="420" cy="180" r="6" fill="#34d399" />
            <circle cx="600" cy="280" r="6" fill="#059669" />
            <circle cx="800" cy="100" r="6" fill="#10b981" />
            <circle cx="990" cy="260" r="6" fill="#34d399" />
            <circle cx="1150" cy="80" r="6" fill="#059669" />
          </svg>
        </div>

        {/* Global Control Bar */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center relative z-20 gap-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-650 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-emerald-600/30 font-serif border border-emerald-500/25">🇪🇺</span>
            <span className="font-serif font-black tracking-widest text-sm uppercase text-slate-200">EURO TRAVEL 2026</span>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            {showInstallBtn ? (
              <button
                onClick={handleInstallApp}
                className="px-3.5 py-1.8 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all backdrop-blur-md cursor-pointer border border-emerald-500/30 relative overflow-hidden group animate-pulse"
                title="一键将 TripFlow 安装为您电脑或手机上的本地运行软件，100% 免费安全且支持离线使用"
              >
                <span className="w-2 h-2 rounded-full col-span-1 bg-emerald-400 animate-ping absolute left-1"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-0.5"></span>
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>安装为本地软件 (PWA)</span>
              </button>
            ) : (
              <button
                onClick={() => setToast({ text: '💡 如果您想在电脑/手机上做成独立软件运行：点击浏览器右上角 “安装” 按钮或在 Safari 中选择 “添加到主屏幕” 即可！', type: 'success' })}
                className="px-3.5 py-1.8 bg-white/5 hover:bg-white/10 text-slate-350 rounded-xl text-xs flex items-center gap-1.5 transition-all backdrop-blur-md cursor-pointer border border-white/5"
                title="了解如何将网页安装为离线软件"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>软件安装指南</span>
              </button>
            )}
            <button
              onClick={handleExportItinerary}
              className="px-3.5 py-1.8 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all backdrop-blur-md cursor-pointer border border-white/5"
              title="将您更新过的时间、价格信息导出"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              导出配置
            </button>
            <label
              className="px-3.5 py-1.8 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all backdrop-blur-md cursor-pointer border border-white/5"
              title="载入您在此前存盘的 JSON 配置文件"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              导入配置
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportItinerary} 
                className="hidden" 
              />
            </label>
            <button
              onClick={handleResetAllData}
              className="px-3.5 py-1.8 bg-red-950/40 hover:bg-red-950/60 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all backdrop-blur-md cursor-pointer border border-red-500/20"
              title="还原到初始游览方案"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              还原初始值
            </button>
          </div>
        </div>

        {/* Hero Central Pitch */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-20 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Header wording */}
            <div className="lg:col-span-7 space-y-4">
              <span className="bg-emerald-600 font-sans tracking-widest font-extrabold text-[10px] sm:text-xs uppercase px-3 py-1 rounded-full text-emerald-50 border border-emerald-400/20">
                7月欧洲群岛与中欧五国之旅
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-none tracking-tight">
                夏日欧洲之旅 · <br className="hidden sm:inline" />专属出行仪表盘
              </h1>
              
              {/* Connection tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-slate-300">
                {['Helsinki 赫尔辛基', 'Lisbon 里斯本', 'Porto 波尔图', 'Prague 布拉格', 'Vienna 维也纳', 'Budapest 布达佩斯', 'Stockholm 斯德哥尔摩'].map((city, idx) => (
                  <React.Fragment key={city}>
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    <span className="text-xs sm:text-sm font-medium hover:text-white transition-colors">{city}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Travel Countdown & Quick Overview card */}
            <div className="lg:col-span-5 bg-emerald-950/20 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/20 space-y-6">
              
              {/* Countdown panel */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  行程起航倒计时 · COUNTDOWN TO HEL-LIS FLIGHT
                </span>
                <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                  <div className="bg-white/5 rounded-2xl p-2.5 border border-white/5">
                    <span className="block text-2xl sm:text-3xl font-serif font-bold text-emerald-400 font-mono">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] text-slate-400">研学天数</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-2.5 border border-white/5">
                    <span className="block text-2xl sm:text-3xl font-serif font-bold text-emerald-400 font-mono">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[10px] text-slate-400">小时分秒</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-2.5 border border-white/5">
                    <span className="block text-2xl sm:text-3xl font-serif font-bold text-emerald-400 font-mono">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[10px] text-slate-400">当前分钟</span>
                  </div>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10 text-center">
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-slate-400">总预算花销</span>
                  <span className="block text-lg font-bold font-mono text-emerald-400 mt-1">€{totalTripCost}</span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-slate-400">交通航线</span>
                  <span className="block text-lg font-bold font-mono text-teal-400 mt-1">
                    {itinerary.filter(i => i.type === 'flight' || i.type === 'train').length} 处
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold text-slate-400">预计城市</span>
                  <span className="block text-lg font-bold font-mono text-amber-400 mt-1">7 城</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Global Sticky Navigation Module tabs */}
        <div className="w-full bg-slate-950/40 border-t border-b border-white/5 relative z-30">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3.5 no-scrollbar select-none">
              {[
                { id: 'timeline', label: '📅 整体时间轴 · Route Timeline' },
                { id: 'cities', label: '🧭 城市精选风光 · City Insights' },
                { id: 'expenses', label: '👛 预算开支表 · Budgets & Costs' },
                { id: 'checklist', label: '🎒 必备行李打包 · Packing List' }
              ].map((tab) => {
                const isActive = activeSegment === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSegment(tab.id as any)}
                    className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-600/25 border border-white/20' 
                        : 'text-slate-300 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">

        {/* Interactive App Segments */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: TIMELINE */}
          {activeSegment === 'timeline' && (
            <motion.div
              key="timeline-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              
              {/* Highlight Month Grid & Mini Map Integration */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Days grid */}
                <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-serif font-semibold text-white tracking-tight flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-emerald-400" />
                        七月行程总安排 · 2026 July Timeline
                      </h2>
                      <p className="text-slate-300 text-sm mt-1">
                        点击卡片可进行细节修改、调整金额；选中右侧日历或任一卡片，将同步更新地图。
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        setAddDate(selectedDateFilter || '2026-07-08');
                        setShowAddEventModal(true);
                      }}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40 hover:shadow-emerald-500/30 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      追加新事项/车票
                    </button>
                  </div>

                  {/* Filter and query toolbar */}
                  <div id="timeline-filters-bar" className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="搜索航班、预订单、站台、细节..."
                        className="w-full glass-input placeholder-slate-400 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white focus:outline-hidden font-medium"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-2xl h-fit border border-white/5">
                      {[
                        { id: 'all', label: '全部' },
                        { id: 'flight', label: '✈️ 航班' },
                        { id: 'hotel', label: '🏨 住宿' },
                        { id: 'train', label: '🚆 火车' },
                        { id: 'daytrip', label: '📍 游玩' }
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setFilterType(type.id as any)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            filterType === type.id 
                              ? 'bg-emerald-600 font-extrabold text-white shadow-md' 
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Date Filter active indicator */}
                  {selectedDateFilter && (
                    <div className="flex items-center justify-between bg-amber-50 rounded-2xl border border-amber-200/50 p-3 text-xs text-amber-900">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">📅 已过滤查看日期：{selectedDateFilter}</span>
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          当天共 {filteredItinerary.length} 项行程安排
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedDateFilter(null)}
                        className="text-amber-800 font-bold underline cursor-pointer hover:text-amber-950 text-[11px]"
                      >
                        清除日期过滤
                      </button>
                    </div>
                  )}

                  {/* Active timeline nodes */}
                  <div id="timeline-section-anchor" className="relative pl-6 sm:pl-8 border-l border-slate-200 space-y-8 pt-4 pb-2">
                    {filteredItinerary.length === 0 ? (
                      <div className="text-center py-16 text-slate-400 text-sm">
                        此过滤条件下未找到任何行程。您可以在该天追加行程，或重置过滤器。
                      </div>
                    ) : (
                      filteredItinerary.map((event, idx) => {
                        const isEditing = editingEventId === event.id;
                        
                        // Theme properties depending on EventType
                        const typeThemes: Record<ItineraryItem['type'], { color: string; bg: string; text: string; icon: any }> = {
                          flight: { color: 'border-blue-200 bg-blue-50 text-blue-700', bg: 'bg-blue-600 text-white', text: 'text-blue-700', icon: Plane },
                          hotel: { color: 'border-emerald-200 bg-emerald-50 text-emerald-700', bg: 'bg-emerald-600 text-white', text: 'text-emerald-700', icon: Hotel },
                          train: { color: 'border-violet-200 bg-violet-50 text-violet-700', bg: 'bg-violet-600 text-white', text: 'text-violet-700', icon: Train },
                          daytrip: { color: 'border-amber-200 bg-amber-50 text-amber-700', bg: 'bg-amber-600 text-white', text: 'text-amber-700', icon: MapPin },
                          other: { color: 'border-slate-200 bg-slate-50 text-slate-700', bg: 'bg-slate-600 text-white', text: 'text-slate-600', icon: Compass }
                        };

                        const theme = typeThemes[event.type] || typeThemes.other;
                        const IconComponent = theme.icon;

                        return (
                          <div key={event.id} className="relative">
                            
                            {/* Round timeline node mark on left border */}
                            <span className={`absolute -left-[37px] sm:-left-[45px] top-4 w-7.5 h-7.5 rounded-full ${theme.bg} border-4 border-slate-950 flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-110 z-10`}>
                              <IconComponent className="w-3.5 h-3.5" />
                            </span>

                            {/* Outer card shell with click maps refocus */}
                            <div 
                              onClick={() => setSelectedMapQuery(event.location || event.title || event.city)}
                              className={`rounded-2xl p-5 shadow-sm transition-all duration-300 border text-left flex flex-col justify-between cursor-pointer ${
                                selectedMapQuery === (event.location || event.title || event.city)
                                  ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-950/40 ring-4 ring-emerald-500/20'
                                  : 'bg-white/4 hover:bg-white/9 border-white/10 hover:border-white/20'
                              }`}
                            >
                              
                              {/* Form mode when isEditing */}
                              {isEditing ? (
                                <form onSubmit={saveEventEdit} className="space-y-4">
                                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                    <span className="text-xs font-bold text-slate-400 uppercase">编辑日程细节</span>
                                    <div className="flex gap-1.5">
                                      <button 
                                        type="button" 
                                        onClick={() => setEditingEventId(null)}
                                        className="px-2.5 py-1 bg-white/10 hover:bg-white/25 text-slate-300 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                                      >
                                        取消
                                      </button>
                                      <button 
                                        type="submit" 
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                                      >
                                        <Save className="w-3 h-3" />
                                        保存
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">主题 / 名称</label>
                                      <input 
                                        type="text" 
                                        value={editingTitle} 
                                        onChange={e => setEditingTitle(e.target.value)}
                                        className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">日期 (YYYY-MM-DD)</label>
                                      <input 
                                        type="date" 
                                        value={editingDate} 
                                        onChange={e => setEditingDate(e.target.value)}
                                        className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono"
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">时间范围 (Timeline)</label>
                                      <input 
                                        type="text" 
                                        value={editingTimeLine} 
                                        onChange={e => setEditingTimeLine(e.target.value)}
                                        placeholder="如 13:00 - 15:50"
                                        className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">价格费用 (€)</label>
                                      <input 
                                        type="number" 
                                        value={editingPrice} 
                                        onChange={e => setEditingPrice(e.target.value)}
                                        placeholder="260"
                                        className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">预订状态</label>
                                      <select
                                        value={editingStatus}
                                        onChange={e => setEditingStatus(e.target.value as any)}
                                        className="w-full bg-white px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden"
                                      >
                                        <option value="confirmed">🟢 预订确信 (Confirmed)</option>
                                        <option value="pending">🟡 预算待定 (Pending)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">位置 / 车站 / 酒店地址</label>
                                      <input 
                                        type="text" 
                                        value={editingLocation} 
                                        onChange={e => setEditingLocation(e.target.value)}
                                        placeholder="如 Santa Apolonía Station"
                                        className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">旅途时长</label>
                                      <input 
                                        type="text" 
                                        value={editingDuration} 
                                        onChange={e => setEditingDuration(e.target.value)}
                                        placeholder="如 3h 13m"
                                        className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">描述与明细注释 (Details)</label>
                                    <textarea 
                                      value={editingDetails} 
                                      onChange={e => setEditingDetails(e.target.value)}
                                      rows={2}
                                      className="w-full bg-white p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                                      required
                                    />
                                  </div>
                                </form>
                              ) : (
                                // Standard reading mode
                                <div className="space-y-4">
                                  
                                  {/* Head Row info */}
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    {/* Event Type & Date Node */}
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 font-sans">
                                        🗓️ {event.date}
                                        <span className="text-slate-350 font-normal font-mono">({event.city})</span>
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold ${
                                        event.type === 'flight' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                        event.type === 'hotel' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                        event.type === 'train' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' :
                                        event.type === 'daytrip' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 
                                        'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                                      }`}>
                                        {event.type === 'flight' ? '✈️ 航班' : 
                                         event.type === 'hotel' ? '🏨 住宿' : 
                                         event.type === 'train' ? '🚆 火车' : 
                                         event.type === 'daytrip' ? '📍 侧线一日游' : '🧩 其他'}
                                      </span>
                                    </div>

                                    {/* Action buttons and monetary amount */}
                                    <div className="flex items-center gap-3">
                                      <div className="text-right">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold inline-block font-mono ${
                                          event.status === 'confirmed' 
                                            ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30' 
                                            : 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                                        }`}>
                                          {event.status === 'confirmed' ? '已确认' : '预算/计划待定'}
                                        </span>
                                      </div>
                                      
                                      {/* Price display badge */}
                                      <span className="font-mono text-xs sm:text-sm font-extrabold text-white bg-white/10 px-2.5 py-1 rounded-xl">
                                        {event.price && event.price > 0 ? `€${event.price}` : '待定'}
                                      </span>

                                      {/* Tool actions toggle */}
                                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEdit(event);
                                          }}
                                          className="p-1 px-2.5 hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer border-r border-white/5"
                                          title="编辑此事项信息"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteEvent(event.id);
                                          }}
                                          className="p-1 px-2.5 hover:bg-red-950/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                          title="下架删除此日程"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Event Name */}
                                  <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight leading-tight flex items-center gap-1.5 pt-0.5">
                                    {event.title}
                                  </h3>

                                  {/* Detail Wording */}
                                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                                    {event.details}
                                  </p>

                                  {/* Optional info sub-bar */}
                                  {(event.timeLine || event.location || event.duration) && (
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                                      {event.timeLine && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                                          时间范围：{event.timeLine}
                                        </span>
                                      )}
                                      {event.duration && (
                                        <span className="flex items-center gap-1">
                                          ⏱️ 历时：{event.duration}
                                        </span>
                                      )}
                                      {event.location && (
                                        <span className="flex items-center gap-1 truncate max-w-xs sm:max-w-md">
                                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                          定位位置：<span className="underline truncate text-slate-300 hover:text-emerald-400 transition-colors">{event.location}</span>
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Interactive Booking & Maps API Deep Links Connection Block */}
                                  <div className="mt-2.5 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                                    {event.type === 'hotel' ? (
                                      <a
                                        href={`https://www.agoda.com/zh-cn/search?query=${encodeURIComponent(event.title || event.location || event.city)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/90 text-white hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all shadow-sm"
                                      >
                                        <ExternalLink className="w-3 h-3" /> Booking Agoda 搜订酒店 🏨
                                      </a>
                                    ) : (event.type === 'train' || event.type === 'flight') ? (
                                      <a
                                        href={(() => {
                                          let q = event.location || event.title;
                                          if (event.title.includes('to')) {
                                            const pts = event.title.split('to');
                                            const o = pts[0]?.replace(/Train:|Flight:/i, '')?.trim();
                                            const d = pts[1]?.trim() || event.city;
                                            q = `${o} to ${d}`;
                                          }
                                          return `https://www.omio.com/travel/search?q=${encodeURIComponent(q)}&date=${event.date}`;
                                        })()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/90 text-white hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all shadow-sm"
                                      >
                                        <ExternalLink className="w-3 h-3" /> Search Omio 火车/机票预订 🚆
                                      </a>
                                    ) : null}

                                    {/* Google Maps Search deep link */}
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || event.title || event.city)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl text-xs font-medium border border-white/10 transition-all"
                                    >
                                      <MapPin className="w-3 h-3" /> Google Map 路线导航 🗺️
                                    </a>
                                  </div>

                                </div>
                              )}

                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Side: Smart Interactive Month Grid Calendar filter */}
                <div className="lg:col-span-4 glass-panel p-6 sm:p-7 rounded-3xl space-y-6">
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-white flex items-center gap-1.5 pb-2 border-b border-white/5">
                      <span>📆 2026年7月日历</span>
                    </h3>
                    <p className="text-slate-350 text-xs mt-1">
                      点击高亮圆点日期，可快速聚焦筛选当天的行程明细。
                    </p>
                  </div>

                  {/* Calendar Widget Grid */}
                  <div className="space-y-4">
                    {/* Weekdays names */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {['一', '二', '三', '四', '五', '六', '日'].map((w, idx) => (
                        <span key={idx} className="text-[10px] font-bold text-slate-400 uppercase py-1">
                          {w}
                        </span>
                      ))}
                    </div>

                    {/* Numeric Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((cell, idx) => {
                        const isSelected = selectedDateFilter === cell.dateStr;
                        
                        return (
                          <div 
                            key={idx}
                            onClick={() => {
                              if (cell.day === null) return;
                              if (cell.isTravelDay) {
                                setSelectedDateFilter(isSelected ? null : cell.dateStr);
                              } else {
                                // Default day select to allow adding custom events
                                setSelectedDateFilter(cell.dateStr);
                              }
                            }}
                            className={`min-h-[52px] rounded-xl flex flex-col justify-between p-1.5 transition-all text-left relative cursor-pointer group ${
                              cell.day === null ? 'bg-transparent cursor-default' :
                              isSelected ? 'bg-emerald-600 text-white font-extrabold ring-2 ring-emerald-500/40 shadow-md shadow-emerald-600/30' :
                              cell.isTravelDay ? 'bg-white/10 hover:bg-white/20 hover:text-white border border-white/10 text-white' :
                              'bg-white/3 hover:bg-white/10 text-slate-500 font-normal hover:text-slate-300'
                            }`}
                          >
                            <span className="text-[11px] font-mono leading-none font-bold">
                              {cell.day}
                            </span>

                            {/* Dots for events list */}
                            {cell.day && cell.events.length > 0 && (
                              <div className="flex flex-wrap gap-0.6 overflow-hidden max-h-4">
                                {cell.hasFlight && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full inline-block" title="航班" />}
                                {cell.hasHotel && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" title="酒店" />}
                                {cell.hasTrain && <span className="w-1.5 h-1.5 bg-violet-400 rounded-full inline-block" title="火车" />}
                                {cell.events.some(e => e.type === 'daytrip' || e.type === 'other') && (
                                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block" title="周边游游乐" />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Color Guide Legend */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-3 border-t border-white/5 text-[10px] text-slate-450 font-mono">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-400 rounded-full inline-block" /> 飞机航班
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" /> 酒店/公寓
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-violet-400 rounded-full inline-block" /> 欧铁/火车
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-amber-400 rounded-full inline-block" /> 日游/游玩
                      </span>
                    </div>

                    {/* Quick reset calendar button if date chosen */}
                    {selectedDateFilter && (
                      <button 
                        onClick={() => setSelectedDateFilter(null)}
                        className="w-full bg-white/5 hover:bg-white/10 py-2 text-[10px] font-bold text-slate-300 rounded-lg text-center cursor-pointer font-sans transition-all"
                      >
                        重置日历过滤
                      </button>
                    )}
                  </div>

                  {/* Interactive Google Map Panel Section */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <h4 className="text-sm font-serif font-bold text-white flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                      <span>🧭 Google 地图导航追踪器</span>
                    </h4>
                    
                    <div className="space-y-1.5">
                      <input 
                        type="text"
                        value={selectedMapQuery}
                        onChange={(e) => setSelectedMapQuery(e.target.value)}
                        placeholder="输入地址、旅馆及航线搜索位置..."
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2 px-3 text-[11px] text-white focus:outline-none placeholder-slate-500"
                      />
                      <span className="text-[10px] text-slate-400 block truncate">
                        已锁定位点: <span className="text-emerald-300 font-semibold select-all font-mono">{selectedMapQuery || '双击行程卡锁定'}</span>
                      </span>
                    </div>

                    {/* Real Embedded Maps Frame */}
                    <div className="w-full h-52 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-slate-900/40 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        referrerPolicy="no-referrer"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedMapQuery || 'Lisbon')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        allowFullScreen
                        title="Interactive Google Map Tracker"
                      ></iframe>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                      <span>💡 鼠标点击左列卡片，地图将自动转移</span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 font-bold hover:underline"
                      >
                        新页面打开航线图
                      </a>
                    </div>
                  </div>

                  {/* Travel advice accordion or note box */}
                  <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/15 text-xs text-amber-205 space-y-2">
                    <h5 className="font-bold flex items-center gap-1 text-amber-300">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                      当前城市行游高光
                    </h5>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed text-amber-200/90">
                      <li><strong>里斯本</strong>：7.4安排了单日波尔图往返，请提前至少25分钟抵达火车站。</li>
                      <li><strong>布拉格</strong>：7.6-7.8两晚在老城老城宜必思，周边非常安静。</li>
                      <li><strong>维也纳与布达佩斯</strong>：这5天具体住宿未定（待订），目前已在预算看板划拨240欧元。</li>
                    </ul>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: CITIES */}
          {activeSegment === 'cities' && (
            <motion.div
              key="cities-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CityExplorer 
                itinerary={itinerary} 
                onSelectCityInTimeline={handleSelectCityInTimeline} 
              />
            </motion.div>
          )}

          {/* TAB 3: EXPENSES BUDGET */}
          {activeSegment === 'expenses' && (
            <motion.div
              key="expenses-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <BudgetDashboard 
                expenses={expenses} 
                onAddExpense={handleAddExpense} 
                onDeleteExpense={handleDeleteExpense} 
              />
            </motion.div>
          )}

          {/* TAB 4: PACKING CHECKLIST */}
          {activeSegment === 'checklist' && (
            <motion.div
              key="checklist-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <PackingChecklist 
                items={packingList} 
                onToggleItem={handleTogglePackingItem} 
                onAddItem={handleAddPackingItem} 
                onDeleteItem={handleDeletePackingItem} 
                onResetList={handleResetPackingList} 
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/15 flex justify-between items-center bg-emerald-950/50">
              <h3 className="font-serif font-bold text-lg text-white">追加行程安排 & 预订车票</h3>
              <button 
                onClick={() => setShowAddEventModal(false)}
                className="text-slate-400 hover:text-white font-bold transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body form */}
            <form onSubmit={handleAddEvent} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] bg-slate-950/20">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  行程标题 / 订票名称 (Title)
                </label>
                <input
                  type="text"
                  value={addTitle}
                  onChange={e => setAddTitle(e.target.value)}
                  placeholder="例如: 维也纳美泉宫音乐会"
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden glass-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    类型
                  </label>
                  <select
                    value={addType}
                    onChange={e => setAddType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white focus:outline-hidden glass-input bg-slate-900"
                  >
                    <option value="flight">✈️ 航班 (Flight)</option>
                    <option value="hotel">🏨 住宿 (Sleep)</option>
                    <option value="train">🚆 火车/大巴 (Train)</option>
                    <option value="daytrip">📍 日游游览 (Daytrip)</option>
                    <option value="other">🧩 其他杂项 (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    关联预算价格 (€ EUR, 可省略)
                  </label>
                  <input
                    type="number"
                    value={addPrice}
                    onChange={e => setAddPrice(e.target.value)}
                    placeholder="35"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white focus:outline-hidden font-mono glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    所属城市
                  </label>
                  <input
                    type="text"
                    value={addCity}
                    onChange={e => setAddCity(e.target.value)}
                    placeholder="例如: Vienna"
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden glass-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    设定日期 (Date)
                  </label>
                  <input
                    type="date"
                    min="2026-07-01"
                    max="2026-07-31"
                    value={addDate}
                    onChange={e => setAddDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden font-mono glass-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    细时间段 (TimeLine, 选填)
                  </label>
                  <input
                    type="text"
                    value={addTimeLine}
                    onChange={e => setAddTimeLine(e.target.value)}
                    placeholder="例如: 13:01 - 17:21"
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden font-mono glass-input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    车站/登机口等位置 (Location)
                  </label>
                  <input
                    type="text"
                    value={addLocation}
                    onChange={e => setAddLocation(e.target.value)}
                    placeholder="如: Wien Hauptbahnhof"
                    className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  行程明细与备忘备注说明 (Details)
                </label>
                <textarea
                  value={addDetails}
                  onChange={e => setAddDetails(e.target.value)}
                  rows={3}
                  placeholder="请输入该事项具体的交通指引或订票码等重要记录..."
                  className="w-full p-2.5 rounded-xl text-xs text-white focus:outline-hidden glass-input"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-350 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  放弃取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md shadow-emerald-950/40"
                >
                  保存添加事项
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Styled Footer */}
      <footer className="w-full border-t border-white/5 bg-slate-950/40 backdrop-blur-md py-12 mt-16 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-sm font-serif font-bold text-white tracking-wider flex items-center justify-center md:justify-start gap-1">
              <span>✈️ 2026 夏日欧洲之行 · 智慧规划控制台</span>
            </h4>
            <p className="text-slate-400 text-xs">
              通过智能 Timeline 时间轴、预算可视化报表和必备行李打包清单，保障您的精彩申根与东欧研学行游无间。
            </p>
          </div>
          <div className="flex gap-4 text-xs font-semibold text-slate-450 font-mono">
            <span>存储状态：本地安全沙盒（100% 离线自主）</span>
            <span>·</span>
            <span>2026 Summer Tour</span>
          </div>
        </div>
      </footer>

      {/* Floating Animated Toast Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl backdrop-blur-md border text-xs sm:text-sm font-semibold max-w-sm"
            style={{
              backgroundColor: toast.type === 'success' ? 'rgba(6, 78, 59, 0.95)' : 'rgba(153, 27, 27, 0.95)',
              borderColor: toast.type === 'success' ? 'rgba(52, 211, 153, 0.35)' : 'rgba(248, 113, 113, 0.35)',
              color: '#ffffff',
            }}
          >
            <span>{toast.text}</span>
            <button 
              onClick={() => setToast(null)}
              className="text-white/65 hover:text-white font-bold ml-2 cursor-pointer focus:outline-none"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
