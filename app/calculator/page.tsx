'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TaxFormData {
  income: string;
  deductions: {
    mortgage: string;
    charitable: string;
    medical: string;
    business: string;
    other: string;
  };
}

export default function Calculator() {
  const [formData, setFormData] = useState<TaxFormData>({
    income: '',
    deductions: {
      mortgage: '',
      charitable: '',
      medical: '',
      business: '',
      other: '',
    },
  });

  const [result, setResult] = useState<{
    taxableIncome: number;
    estimatedTax: number;
    effectiveRate: number;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'income') {
      setFormData(prev => ({ ...prev, income: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        deductions: {
          ...prev.deductions,
          [field]: value,
        },
      }));
    }
  };

  const calculateTax = () => {
    const income = parseFloat(formData.income) || 0;
    const totalDeductions = Object.values(formData.deductions).reduce(
      (sum, value) => sum + (parseFloat(value) || 0),
      0
    );

    const taxableIncome = Math.max(0, income - totalDeductions);
    
    // Simple tax calculation (2024 tax brackets for single filer)
    let estimatedTax = 0;
    if (taxableIncome <= 11600) {
      estimatedTax = 0;
    } else if (taxableIncome <= 44725) {
      estimatedTax = (taxableIncome - 11600) * 0.12;
    } else if (taxableIncome <= 95375) {
      estimatedTax = 3974.88 + (taxableIncome - 44725) * 0.22;
    } else if (taxableIncome <= 182100) {
      estimatedTax = 14198.88 + (taxableIncome - 95375) * 0.24;
    } else if (taxableIncome <= 231250) {
      estimatedTax = 36147.88 + (taxableIncome - 182100) * 0.32;
    } else if (taxableIncome <= 578125) {
      estimatedTax = 51842.88 + (taxableIncome - 231250) * 0.35;
    } else {
      estimatedTax = 174238.88 + (taxableIncome - 578125) * 0.37;
    }

    const effectiveRate = (estimatedTax / income) * 100;

    setResult({
      taxableIncome,
      estimatedTax,
      effectiveRate,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tax Calculator</h1>
          <p className="mt-2 text-gray-600">Estimate your tax liability for 2024.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="income" className="block text-sm font-medium text-gray-700">
                Annual Income
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="income"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="Enter your annual income"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Deductions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mortgage" className="block text-sm font-medium text-gray-700">
                    Mortgage Interest
                  </label>
                  <input
                    type="number"
                    id="mortgage"
                    value={formData.deductions.mortgage}
                    onChange={(e) => handleInputChange('mortgage', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="Enter mortgage interest"
                  />
                </div>
                <div>
                  <label htmlFor="charitable" className="block text-sm font-medium text-gray-700">
                    Charitable Contributions
                  </label>
                  <input
                    type="number"
                    id="charitable"
                    value={formData.deductions.charitable}
                    onChange={(e) => handleInputChange('charitable', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="Enter charitable contributions"
                  />
                </div>
                <div>
                  <label htmlFor="medical" className="block text-sm font-medium text-gray-700">
                    Medical Expenses
                  </label>
                  <input
                    type="number"
                    id="medical"
                    value={formData.deductions.medical}
                    onChange={(e) => handleInputChange('medical', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="Enter medical expenses"
                  />
                </div>
                <div>
                  <label htmlFor="business" className="block text-sm font-medium text-gray-700">
                    Business Expenses
                  </label>
                  <input
                    type="number"
                    id="business"
                    value={formData.deductions.business}
                    onChange={(e) => handleInputChange('business', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="Enter business expenses"
                  />
                </div>
                <div>
                  <label htmlFor="other" className="block text-sm font-medium text-gray-700">
                    Other Deductions
                  </label>
                  <input
                    type="number"
                    id="other"
                    value={formData.deductions.other}
                    onChange={(e) => handleInputChange('other', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    placeholder="Enter other deductions"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={calculateTax}
                className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Calculate Tax
              </button>
            </div>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Estimate Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Taxable Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${result.taxableIncome.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Estimated Tax</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${result.estimatedTax.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Effective Tax Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.effectiveRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
} 