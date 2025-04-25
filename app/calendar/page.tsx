'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TaxEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  type: 'deadline' | 'reminder' | 'info';
}

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const taxEvents: TaxEvent[] = [
    {
      id: 1,
      title: 'Tax Return Due Date',
      date: '2024-04-15',
      description: 'Last day to file your 2023 tax return or request an extension',
      type: 'deadline'
    },
    {
      id: 2,
      title: 'Q1 Estimated Tax Payment',
      date: '2024-04-15',
      description: 'First quarter estimated tax payment due',
      type: 'deadline'
    },
    {
      id: 3,
      title: 'Q2 Estimated Tax Payment',
      date: '2024-06-15',
      description: 'Second quarter estimated tax payment due',
      type: 'reminder'
    },
    {
      id: 4,
      title: 'Q3 Estimated Tax Payment',
      date: '2024-09-15',
      description: 'Third quarter estimated tax payment due',
      type: 'reminder'
    },
    {
      id: 5,
      title: 'Q4 Estimated Tax Payment',
      date: '2025-01-15',
      description: 'Fourth quarter estimated tax payment due',
      type: 'reminder'
    },
    {
      id: 6,
      title: 'W-2 Forms Due',
      date: '2024-01-31',
      description: 'Employers must provide W-2 forms to employees',
      type: 'info'
    },
    {
      id: 7,
      title: '1099 Forms Due',
      date: '2024-01-31',
      description: 'Businesses must provide 1099 forms to contractors',
      type: 'info'
    }
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const eventsForDay = taxEvents.filter(event => event.date === dateString);

      days.push(
        <div key={day} className="h-24 p-2 border border-gray-100">
          <div className="font-medium text-gray-900">{day}</div>
          <div className="mt-1 space-y-1">
            {eventsForDay.map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded ${
                  event.type === 'deadline'
                    ? 'bg-red-100 text-red-800'
                    : event.type === 'reminder'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tax Calendar</h1>
          <p className="mt-2 text-gray-600">Important tax dates and deadlines for 2024.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {months[selectedMonth]} {selectedYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxEvents.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    event.type === 'deadline'
                      ? 'bg-red-100 text-red-800'
                      : event.type === 'reminder'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
} 