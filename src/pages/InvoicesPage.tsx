/**
 * Invoices Page
 * صفحة الفواتير
 */

import React from 'react';
import { motion } from 'framer-motion';
import { InvoicesDashboard } from '@/features/invoice';

export default function InvoicesPage() {
  return (
    <motion.div 
      className="min-h-screen bg-background p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <InvoicesDashboard />
      </div>
    </motion.div>
  );
}
