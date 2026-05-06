/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkle } from 'lucide-react';

export default function RotatingBadge() {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Background Circle */}
      <div className="absolute w-32 h-32 bg-[#E2FF6F] rounded-full border border-black shadow-lg"></div>

      {/* Rotating Text */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 z-20"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <path
              id="badgePath"
              d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
            />
          </defs>
          <text className="text-[7.5px] font-bold uppercase tracking-[0.2em] fill-black">
            <textPath xlinkHref="#badgePath" startOffset="0%">
              • PREMIUM FASHION ESSENTIALS • PREMIUM FASHION ESSENTIALS
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Center Icon */}
      <div className="relative z-10 text-black">
        <Sparkle size={32} fill="currentColor" />
      </div>
    </div>
  );
}
