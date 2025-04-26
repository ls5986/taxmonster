'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-teal-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Tax Monster</Link>
        <div className="flex gap-6">
          <Link href="/dashboard" className="hover:text-teal-200">Dashboard</Link>
          <Link href="/documents" className="hover:text-teal-200">Documents</Link>
          <Link href="/calendar" className="hover:text-teal-200">Calendar</Link>
          <Link href="/calculator" className="hover:text-teal-200">Calculator</Link>
        </div>
      </div>
    </nav>
  )
} 