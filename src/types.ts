/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventType = 'flight' | 'hotel' | 'train' | 'daytrip' | 'other';

export interface ItineraryItem {
  id: string;
  type: EventType;
  date: string; // "YYYY-MM-DD"
  title: string;
  city: string;
  timeLine?: string; // Time range e.g. "13:00 - 15:50"
  duration?: string; // e.g., "2h 50m"
  price?: number; // Cost in EUR, null or undefined if unknown/not budgeted
  details: string; // Long description of item
  location?: string; // Specific location / station / airport names
  status?: 'confirmed' | 'pending';
}

export interface CityInfo {
  id: string;
  name: string;
  chineseName: string;
  country: string;
  currency: string;
  exchangeRate: string; // Info about exchange rate to EUR
  description: string;
  highlights: string[];
  localTransportation: string;
  colorTheme: string; // Tailwind bg-theme / text-theme classes
  bgGradient: string;
}

export interface PackingItem {
  id: string;
  category: 'Documents' | 'Clothing' | 'Electronics' | 'Toiletries' | 'Other';
  name: string;
  checked: boolean;
  essential: boolean;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'Transport' | 'Accommodation' | 'Dining' | 'Sightseeing' | 'Shopping' | 'Other';
  date: string;
}
