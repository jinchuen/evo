'use client';

import React from 'react';
import {  EvoCard, cardStyles } from '../src/Card/Card';

// Card data organized by variant type
const showcaseData = {
  normal: [
    { color: 'cyan' as const, title: 'Basic Shield', type: 'Common Item', stat: '+20 Defense', desc: 'A reliable shield for beginners.' },
    { color: 'rose' as const, title: 'Iron Sword', type: 'Common Weapon', stat: '+15 Attack', desc: 'Standard issue blade.' },
  ],
  playable: [
    { color: 'violet' as const, title: 'Void Walker', type: 'Mythic Armor', stat: '+200 Evasion', desc: 'Phase through dimensions.' },
    { color: 'amber' as const, title: 'Phoenix Blade', type: 'Legendary Weapon', stat: '+300 Fire DMG', desc: 'Burns with eternal flame.' },
  ],
  glass: [
    { color: 'cyan' as const, title: 'Crystal Orb', type: 'Rare Artifact', stat: '+50 Mana', desc: 'Amplifies magical energy.' },
    { color: 'emerald' as const, title: 'Nature&apos;s Gift', type: 'Epic Support', stat: '+80 HP Regen', desc: 'Blessed by forest spirits.' },
  ],
  neon: [
    { color: 'rose' as const, title: 'Cyber Edge', type: 'Tech Weapon', stat: '+150 Crit', desc: 'High-tech laser blade.' },
    { color: 'violet' as const, title: 'Neural Link', type: 'Tech Helm', stat: '+100 Speed', desc: 'Enhanced reflexes.' },
  ],
  holo: [
    { color: 'amber' as const, title: 'Prismatic Core', type: 'Legendary Gem', stat: 'All Stats +50', desc: 'Contains rainbow essence.' },
    { color: 'cyan' as const, title: 'Starlight Robe', type: 'Mythic Armor', stat: '+250 Magic DEF', desc: 'Woven from starlight.' },
  ],
  pulse: [
    { color: 'emerald' as const, title: 'Living Armor', type: 'Epic Set', stat: '+100 HP/sec', desc: 'Regenerates continuously.' },
    { color: 'rose' as const, title: 'Heart Stone', type: 'Rare Gem', stat: '+500 Max HP', desc: 'Pulses with life force.' },
  ],
  tilt: [
    { color: 'violet' as const, title: 'Dimension Blade', type: 'Mythic Weapon', stat: '+400 ATK', desc: 'Cuts through reality.' },
    { color: 'amber' as const, title: 'Sun Shield', type: 'Legendary Shield', stat: '+350 DEF', desc: 'Forged in solar fire.' },
  ],
};

const variantLabels: Record<string, { name: string; description: string }> = {
  normal: { name: 'Normal', description: 'Clean, minimal design with subtle hover effects' },
  playable: { name: 'Playable', description: '180° flip animation with holographic sweep' },
  glass: { name: 'Glass', description: 'Frosted glassmorphism with backdrop blur' },
  neon: { name: 'Neon', description: 'Glowing neon borders with pulse animation' },
  holo: { name: 'Holographic', description: 'Rainbow shimmer effect on hover' },
  pulse: { name: 'Pulse', description: 'Breathing glow animation effect' },
  tilt: { name: '3D Tilt', description: 'Interactive perspective tilt on mouse move' },
};

export default function Showcase() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
            EvoCard Design System
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A collection of 7 unique card effects for gaming interfaces. 
            Hover over each card to experience the effect.
          </p>
        </div>
      </header>

      {/* Card Sections */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        {Object.entries(showcaseData).map(([variant, cards]) => (
          <section key={variant} className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {variantLabels[variant].name} Cards
                </h2>
                <p className="text-slate-400">
                  {variantLabels[variant].description}
                </p>
              </div>
              <span className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-slate-300 uppercase tracking-wider">
                variant=&quot;{variant}&quot;
              </span>
            </div>

            {/* Cards Grid */}
            <div className="flex flex-wrap gap-8 justify-start">
              {cards.map((card, idx) => (
                <div key={`${variant}-${idx}`}>
                  {variant === 'playable' ? (
                    <EvoCard variant="playable" color={card.color}>
                      <EvoCard.Front>
                        <div className="h-full flex flex-col justify-between">
                          <span className={cardStyles.cardBadge}>{card.type}</span>
                          <div>
                            <h3 className={cardStyles.cardAccentTitle}>{card.title}</h3>
                            <p className={cardStyles.cardDescription}>{card.desc}</p>
                          </div>
                        </div>
                      </EvoCard.Front>
                      <EvoCard.Back>
                        <h3 className={cardStyles.cardTitle}>{card.type}</h3>
                        <div className={cardStyles.cardStat}>{card.stat}</div>
                        <button className={cardStyles.cardButton}>Equip Item</button>
                      </EvoCard.Back>
                    </EvoCard>
                  ) : (
                    <EvoCard variant={variant as 'normal' | 'glass' | 'neon' | 'holo' | 'pulse' | 'tilt'} color={card.color}>
                      <div className="h-full flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className={cardStyles.cardBadge}>{card.type}</span>
                          <h3 className={cardStyles.cardAccentTitle}>{card.title}</h3>
                          <p className={cardStyles.cardDescription}>{card.desc}</p>
                        </div>
                        <div className="space-y-3 mt-auto pt-6">
                          <div className={cardStyles.cardStat}>{card.stat}</div>
                          <button className={cardStyles.cardButton}>View Details</button>
                        </div>
                      </div>
                    </EvoCard>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Color Palette Reference */}
        <section className="space-y-8 border-t border-slate-800 pt-20">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Color Palette</h2>
            <p className="text-slate-400">Available accent colors for all card variants</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {(['cyan', 'rose', 'emerald', 'amber', 'violet'] as const).map((color) => (
              <div 
                key={color}
                className="p-6 rounded-xl border border-slate-700 bg-slate-900 text-center"
                data-color={color}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-3"
                  style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 20px var(--glow)' }}
                />
                <p className="font-semibold capitalize text-white">{color}</p>
                <p className="text-xs text-slate-500 mt-1">color=&quot;{color}&quot;</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          EvoCard Design System • Built with SCSS Modules & React
        </div>
      </footer>
    </div>
  );
}
