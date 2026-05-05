/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('bg-gray-200 rounded-md', className)}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] rounded-2xl w-full" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
      <div className="space-y-4">
        <Skeleton className="aspect-[3/4] rounded-3xl w-full" />
        <div className="flex gap-4">
          <Skeleton className="w-24 h-32 rounded-xl" />
          <Skeleton className="w-24 h-32 rounded-xl" />
          <Skeleton className="w-24 h-32 rounded-xl" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-14 flex-1 rounded-full" />
          <Skeleton className="h-14 flex-1 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-8 pt-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
