'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DocumentCard = ({ title, type, date, status }: {
  title: string;
  type: string;
  date: string;
  status: 'processed' | 'pending' | 'error';
}) => {
  const statusColors = {
    processed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">{date}</span>
        <div className="flex space-x-2">
          <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
            View
          </button>
          <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
            Download
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Documents() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Documents' },
    { id: 'w2', name: 'W-2 Forms' },
    { id: '1099', name: '1099 Forms' },
    { id: 'receipts', name: 'Receipts' },
    { id: 'other', name: 'Other' },
  ];

  const documents = [
    {
      title: 'W-2 Form 2023',
      type: 'W-2',
      date: 'Jan 15, 2024',
      status: 'processed' as const,
    },
    {
      title: '1099-INT Statement',
      type: '1099-INT',
      date: 'Jan 20, 2024',
      status: 'processed' as const,
    },
    {
      title: 'Business Expenses Q4',
      type: 'Receipts',
      date: 'Jan 25, 2024',
      status: 'pending' as const,
    },
    {
      title: 'Charitable Donations',
      type: 'Receipts',
      date: 'Feb 1, 2024',
      status: 'error' as const,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tax Documents</h1>
          <p className="mt-2 text-gray-600">Manage and organize your tax-related documents.</p>
        </div>

        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
            Upload New Document
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, index) => (
            <DocumentCard
              key={index}
              title={doc.title}
              type={doc.type}
              date={doc.date}
              status={doc.status}
            />
          ))}
        </div>
      </div>
    </main>
  );
} 