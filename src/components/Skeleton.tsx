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
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('bg-[#EAE6DF]', className)}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-7 space-y-4">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="flex gap-3">
          <Skeleton className="w-20 md:w-24 aspect-[3/4]" />
          <Skeleton className="w-20 md:w-24 aspect-[3/4]" />
          <Skeleton className="w-20 md:w-24 aspect-[3/4]" />
        </div>
      </div>
      <div className="lg:col-span-5 space-y-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-36" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-3 pt-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="pt-6">
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
}
