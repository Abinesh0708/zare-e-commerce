/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export default function RotatingBadge() {
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <div className="absolute w-28 h-28 bg-[#EFECE6] border border-[#111111]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 z-20"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <path
              id="badgePath"
              d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
            />
          </defs>
          <text className="text-[7px] font-bold uppercase tracking-[0.2em] fill-[#111111]">
            <textPath xlinkHref="#badgePath" startOffset="0%">
              • ZARE ATELIER ARCHIVE • PERMANENT COLLECTION
            </textPath>
          </text>
        </svg>
      </motion.div>
      <div className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-[#111111]">
        2026
      </div>
    </div>
  );
}
