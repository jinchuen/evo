'use client';

import React, { useState } from 'react';
import { EvoCard, cardStyles } from '../src/Card/Card';
import { EvoButton } from '../src/Button/Button';
import { EvoStack } from '../src/Stack/Stack';
import { EvoGrid } from '../src/Grid/Grid';
import { EvoDivider } from '../src/Divider/Divider';
import { EvoContainer } from '../src/Container/Container';
import { EvoTabs } from '../src/Tabs/Tabs';
import { EvoBreadcrumb } from '../src/Breadcrumb/Breadcrumb';
import { EvoNav } from '../src/Nav/Nav';
import { EvoPagination } from '../src/Pagination/Pagination';
import { EvoInput } from '../src/Input/Input';
import { EvoSelect } from '../src/Select/Select';
import { EvoCheckbox } from '../src/Checkbox/Checkbox';
import { EvoRadio } from '../src/Radio/Radio';
import { EvoToggle } from '../src/Toggle/Toggle';
import { EvoForm } from '../src/Form/Form';
import { EvoModal } from '../src/Modal/Modal';
import { EvoToastProvider, useToast } from '../src/Toast/Toast';
import { EvoTooltip } from '../src/Tooltip/Tooltip';
import { EvoAlert } from '../src/Alert/Alert';
import { EvoBadge } from '../src/Badge/Badge';
import { EvoSkeleton } from '../src/Skeleton/Skeleton';
import { EvoTable, TableColumn } from '../src/Table/Table';

// ─── Card data ────────────────────────────────────────────────────────────────
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
    { color: 'emerald' as const, title: "Nature's Gift", type: 'Epic Support', stat: '+80 HP Regen', desc: 'Blessed by forest spirits.' },
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

// ─── Table data ───────────────────────────────────────────────────────────────
type Player = {
  rank: number;
  name: string;
  class: string;
  level: number;
  score: number;
  status: 'online' | 'offline' | 'in-battle';
};

const leaderboardData: Player[] = [
  { rank: 1, name: 'VoidWalker',   class: 'Rogue',   level: 99, score: 142_800, status: 'in-battle' },
  { rank: 2, name: 'Starforged',   class: 'Paladin', level: 97, score: 138_450, status: 'online'    },
  { rank: 3, name: 'NullStrike',   class: 'Mage',    level: 96, score: 121_300, status: 'online'    },
  { rank: 4, name: 'IronVeil',     class: 'Warrior', level: 94, score: 108_720, status: 'offline'   },
  { rank: 5, name: 'ArcaneShift',  class: 'Mage',    level: 91, score:  97_540, status: 'in-battle' },
  { rank: 6, name: 'PhantomEdge',  class: 'Rogue',   level: 88, score:  84_100, status: 'offline'   },
];

const statusColors: Record<Player['status'], string> = {
  'online':    '#34d399',
  'offline':   '#6b7280',
  'in-battle': '#f87171',
};

const leaderboardColumns: TableColumn<Player>[] = [
  {
    key: 'rank',
    header: '#',
    width: '52px',
    render: (v) => (
      <span style={{ fontWeight: 700, color: Number(v) <= 3 ? '#fbbf24' : '#94a3b8' }}>
        {String(v)}
      </span>
    ),
  },
  { key: 'name',  header: 'Player',  render: (v) => <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{String(v)}</span> },
  { key: 'class', header: 'Class' },
  { key: 'level', header: 'Lvl', width: '60px' },
  {
    key: 'score',
    header: 'Score',
    width: '110px',
    render: (v) => Number(v).toLocaleString(),
  },
  {
    key: 'status',
    header: 'Status',
    width: '110px',
    render: (v) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', color: statusColors[v as Player['status']] }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColors[v as Player['status']], display: 'inline-block' }} />
        {String(v)}
      </span>
    ),
  },
];

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, description, tag, children }: {
  title: string; description: string; tag: string; children: React.ReactNode;
}) => (
  <section className="space-y-6">
    <div className="flex items-start gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-slate-300 uppercase tracking-wider shrink-0">
        {tag}
      </span>
    </div>
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
      {children}
    </div>
  </section>
);

// ─── Toast demo (needs hook) ──────────────────────────────────────────────────
const ToastDemo = () => {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <EvoButton label="Success Toast" severity="success" onClick={() => toast('Item equipped successfully!', 'success')} />
      <EvoButton label="Error Toast" severity="danger" onClick={() => toast('Connection failed. Please retry.', 'error')} />
      <EvoButton label="Warning Toast" severity="warning" onClick={() => toast('Inventory almost full.', 'warning')} />
      <EvoButton label="Info Toast" severity="info" onClick={() => toast('New season content available.', 'info')} />
    </div>
  );
};

// ─── Nav icon helpers ─────────────────────────────────────────────────────────
const Icon = ({ ch }: { ch: string }) => <span style={{ fontSize: '1rem' }}>{ch}</span>;

// ─── Main showcase ────────────────────────────────────────────────────────────
function ShowcaseInner() {
  // Form / input state
  const [inputVal, setInputVal] = useState('');
  const [selectVal, setSelectVal] = useState('');
  const [checks, setChecks] = useState({ sword: true, shield: false, helm: false });
  const [radioVal, setRadioVal] = useState('warrior');
  const [toggles, setToggles] = useState({ notifications: true, darkMode: true, sound: false });

  // Nav active state
  const [navActive, setNavActive] = useState('dashboard');

  // Pagination state
  const [page, setPage] = useState(3);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Table state
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Hero ── */}
      <header className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
            EvoUI Design System
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            23 components — cards, buttons, layout primitives, forms, overlays, and data display. All dark-themed, SCSS-powered, zero runtime deps.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">

        {/* ── CARD SECTIONS ── */}
        {Object.entries(showcaseData).map(([variant, cards]) => (
          <section key={variant} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {variantLabels[variant].name} Cards
                </h2>
                <p className="text-slate-400">{variantLabels[variant].description}</p>
              </div>
              <span className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-slate-300 uppercase tracking-wider">
                variant=&quot;{variant}&quot;
              </span>
            </div>
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

        {/* ── COMPONENT LIBRARY ── */}
        <div className="border-t border-slate-800 pt-20 space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Component Library</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              20 new components across layout, navigation, forms, overlays, and data display.
            </p>
          </div>

          {/* ─── LAYOUT & STRUCTURE ─────────────────────────────────── */}
          <div className="space-y-10">
            <h3 className="text-lg font-semibold text-cyan-400 uppercase tracking-widest">Layout &amp; Structure</h3>

            {/* Stack */}
            <Section title="Stack" description="Flex layout primitive — control direction, gap, alignment in one component." tag="EvoStack">
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Row (direction=&quot;row&quot; gap=&quot;1rem&quot;)</p>
                  <EvoStack direction="row" gap="1rem" align="center">
                    {['Alpha', 'Beta', 'Gamma', 'Delta'].map((t) => (
                      <div key={t} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200">{t}</div>
                    ))}
                  </EvoStack>
                </div>
                <EvoDivider />
                <div>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Column (direction=&quot;column&quot; gap=&quot;0.5rem&quot;)</p>
                  <EvoStack direction="column" gap="0.5rem">
                    {['First', 'Second', 'Third'].map((t) => (
                      <div key={t} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200">{t}</div>
                    ))}
                  </EvoStack>
                </div>
              </div>
            </Section>

            {/* Grid */}
            <Section title="Grid" description="CSS Grid wrapper with responsive columns and span support via Grid.Item." tag="EvoGrid">
              <EvoGrid cols={3} gap="1rem">
                {['Sword', 'Shield', 'Helmet', 'Boots', 'Gloves', 'Cape'].map((item, i) => (
                  <EvoGrid.Item key={item} colSpan={i === 0 ? 2 : 1}>
                    <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 text-center">
                      {item}{i === 0 && ' (colSpan=2)'}
                    </div>
                  </EvoGrid.Item>
                ))}
              </EvoGrid>
            </Section>

            {/* Divider */}
            <Section title="Divider" description="Horizontal / vertical separator with optional label." tag="EvoDivider">
              <div className="space-y-6">
                <EvoDivider />
                <EvoDivider label="OR" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '3rem' }}>
                  <span className="text-slate-400 text-sm">Left</span>
                  <EvoDivider orientation="vertical" />
                  <span className="text-slate-400 text-sm">Right</span>
                </div>
              </div>
            </Section>

            {/* Container */}
            <Section title="Container" description="Max-width wrapper with size presets (sm / md / lg / xl / full)." tag="EvoContainer">
              <div className="space-y-3">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                  <EvoContainer key={s} size={s}>
                    <div className="px-4 py-2 bg-slate-800 border border-dashed border-slate-600 rounded text-xs text-slate-400 text-center">
                      size=&quot;{s}&quot;
                    </div>
                  </EvoContainer>
                ))}
              </div>
            </Section>
          </div>

          {/* ─── NAVIGATION ─────────────────────────────────────────── */}
          <div className="space-y-10">
            <h3 className="text-lg font-semibold text-violet-400 uppercase tracking-widest">Navigation</h3>

            {/* Tabs */}
            <Section title="Tabs" description="Context-driven tab switcher with compound Tabs.List / Tabs.Tab / Tabs.Panel API." tag="EvoTabs">
              <EvoTabs defaultTab="overview">
                <EvoTabs.List>
                  <EvoTabs.Tab id="overview">Overview</EvoTabs.Tab>
                  <EvoTabs.Tab id="stats">Stats</EvoTabs.Tab>
                  <EvoTabs.Tab id="lore">Lore</EvoTabs.Tab>
                  <EvoTabs.Tab id="locked" disabled>Locked</EvoTabs.Tab>
                </EvoTabs.List>
                <EvoTabs.Panel id="overview">
                  Welcome to the Overview panel. This content switches instantly — no page load, no flicker.
                </EvoTabs.Panel>
                <EvoTabs.Panel id="stats">
                  ATK 320 · DEF 180 · SPD 240 · MANA 500
                </EvoTabs.Panel>
                <EvoTabs.Panel id="lore">
                  Forged in the heart of the dying star, this artifact carries memories of a forgotten civilization.
                </EvoTabs.Panel>
              </EvoTabs>
            </Section>

            {/* Breadcrumb */}
            <Section title="Breadcrumb" description="Accessible navigation trail with customisable separator." tag="EvoBreadcrumb">
              <div className="space-y-4">
                <EvoBreadcrumb>
                  <EvoBreadcrumb.Item href="#">Home</EvoBreadcrumb.Item>
                  <EvoBreadcrumb.Item href="#">Inventory</EvoBreadcrumb.Item>
                  <EvoBreadcrumb.Item href="#">Weapons</EvoBreadcrumb.Item>
                  <EvoBreadcrumb.Item current>Void Blade</EvoBreadcrumb.Item>
                </EvoBreadcrumb>
                <EvoBreadcrumb separator="›">
                  <EvoBreadcrumb.Item href="#">Dashboard</EvoBreadcrumb.Item>
                  <EvoBreadcrumb.Item href="#">Settings</EvoBreadcrumb.Item>
                  <EvoBreadcrumb.Item current>Profile</EvoBreadcrumb.Item>
                </EvoBreadcrumb>
              </div>
            </Section>

            {/* Nav */}
            <Section title="Nav" description="Sidebar-ready navigation with active state, icons, and grouped sections." tag="EvoNav">
              <div style={{ maxWidth: '240px' }}>
                <EvoNav>
                  <EvoNav.Item icon={<Icon ch="⚡" />} active={navActive === 'dashboard'} onClick={() => setNavActive('dashboard')}>Dashboard</EvoNav.Item>
                  <EvoNav.Item icon={<Icon ch="🎒" />} active={navActive === 'inventory'} onClick={() => setNavActive('inventory')}>Inventory</EvoNav.Item>
                  <EvoNav.Item icon={<Icon ch="⚔️" />} active={navActive === 'battle'} onClick={() => setNavActive('battle')}>Battle</EvoNav.Item>
                  <EvoNav.Group label="Account">
                    <EvoNav.Item icon={<Icon ch="👤" />} active={navActive === 'profile'} onClick={() => setNavActive('profile')}>Profile</EvoNav.Item>
                    <EvoNav.Item icon={<Icon ch="⚙️" />} active={navActive === 'settings'} onClick={() => setNavActive('settings')}>Settings</EvoNav.Item>
                  </EvoNav.Group>
                </EvoNav>
              </div>
            </Section>

            {/* Pagination */}
            <Section title="Pagination" description="Smart pagination with ellipsis, active page highlight, and prev/next controls." tag="EvoPagination">
              <div className="space-y-4">
                <EvoPagination total={150} page={page} pageSize={10} onChange={setPage} />
                <p className="text-xs text-slate-500">Current page: {page} of 15</p>
              </div>
            </Section>
          </div>

          {/* ─── FORMS & INPUTS ─────────────────────────────────────── */}
          <div className="space-y-10">
            <h3 className="text-lg font-semibold text-emerald-400 uppercase tracking-widest">Forms &amp; Inputs</h3>

            {/* Input */}
            <Section title="Input" description="Text field with label, helper text, error state, and leading/trailing adornments." tag="EvoInput">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <EvoInput label="Character Name" placeholder="Enter name…" value={inputVal} onChange={(e) => setInputVal(e.target.value)} helperText="Must be 3–20 characters." />
                <EvoInput label="Guild Name" placeholder="Search guilds…" leadingAdornment="🔍" />
                <EvoInput label="Level" placeholder="1–100" trailingAdornment="XP" />
                <EvoInput label="Email" type="email" placeholder="player@evo.gg" error="This email is already taken." />
                <EvoInput label="Disabled Field" value="Read-only content" disabled />
              </div>
            </Section>

            {/* Select */}
            <Section title="Select" description="Native select with custom chevron, label, and error state." tag="EvoSelect">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <EvoSelect
                  label="Character Class"
                  placeholder="Choose a class…"
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  options={[
                    { value: 'warrior', label: 'Warrior' },
                    { value: 'mage', label: 'Mage' },
                    { value: 'rogue', label: 'Rogue' },
                    { value: 'paladin', label: 'Paladin' },
                  ]}
                  helperText="Your class determines starting stats."
                />
                <EvoSelect
                  label="Region"
                  options={[
                    { value: 'na', label: 'North America' },
                    { value: 'eu', label: 'Europe' },
                    { value: 'as', label: 'Asia' },
                  ]}
                  error="Please select a valid region."
                />
              </div>
            </Section>

            {/* Checkbox */}
            <Section title="Checkbox" description="Custom styled checkbox with indeterminate state and group support." tag="EvoCheckbox">
              <div className="flex flex-wrap gap-8">
                <EvoCheckbox.Group label="Equipment">
                  <EvoCheckbox
                    label="Void Sword"
                    checked={checks.sword}
                    onChange={(e) => setChecks((c) => ({ ...c, sword: e.target.checked }))}
                  />
                  <EvoCheckbox
                    label="Crystal Shield"
                    checked={checks.shield}
                    onChange={(e) => setChecks((c) => ({ ...c, shield: e.target.checked }))}
                    helperText="Grants +50 magic defense"
                  />
                  <EvoCheckbox
                    label="Shadow Helm"
                    checked={checks.helm}
                    onChange={(e) => setChecks((c) => ({ ...c, helm: e.target.checked }))}
                  />
                </EvoCheckbox.Group>
                <div className="space-y-3">
                  <EvoCheckbox label="Indeterminate state" indeterminate />
                  <EvoCheckbox label="Disabled state" disabled />
                </div>
              </div>
            </Section>

            {/* Radio */}
            <Section title="Radio" description="Radio group with context-driven selection and disabled option support." tag="EvoRadio">
              <EvoRadio.Group name="class" value={radioVal} onChange={setRadioVal} label="Select Class">
                <EvoRadio value="warrior" label="Warrior — High defense, melee combat" />
                <EvoRadio value="mage" label="Mage — High magic damage, low defense" />
                <EvoRadio value="rogue" label="Rogue — High speed, stealth attacks" />
                <EvoRadio value="locked" label="Paladin — Unlocked at Level 20" disabled />
              </EvoRadio.Group>
            </Section>

            {/* Toggle */}
            <Section title="Toggle" description="Switch component with sm / md / lg sizes and animated thumb transition." tag="EvoToggle">
              <div className="flex flex-wrap gap-8">
                <div className="space-y-4">
                  <EvoToggle label="Notifications" checked={toggles.notifications} onChange={(v) => setToggles((t) => ({ ...t, notifications: v }))} />
                  <EvoToggle label="Dark Mode" checked={toggles.darkMode} onChange={(v) => setToggles((t) => ({ ...t, darkMode: v }))} />
                  <EvoToggle label="Sound Effects" checked={toggles.sound} onChange={(v) => setToggles((t) => ({ ...t, sound: v }))} />
                  <EvoToggle label="Disabled" checked disabled />
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sizes</p>
                  <EvoToggle size="sm" label="Small" checked={toggles.sound} onChange={(v) => setToggles((t) => ({ ...t, sound: v }))} />
                  <EvoToggle size="md" label="Medium" checked={toggles.sound} onChange={(v) => setToggles((t) => ({ ...t, sound: v }))} />
                  <EvoToggle size="lg" label="Large" checked={toggles.sound} onChange={(v) => setToggles((t) => ({ ...t, sound: v }))} />
                </div>
              </div>
            </Section>

            {/* Form */}
            <Section title="Form" description="Form context wrapper with EvoForm.Field layout helper and disabled propagation." tag="EvoForm">
              <EvoForm onSubmit={(e) => e.preventDefault()} style={{ maxWidth: '400px' }}>
                <EvoForm.Field>
                  <EvoInput label="Username" placeholder="player_one" fullWidth />
                </EvoForm.Field>
                <EvoForm.Field>
                  <EvoInput label="Password" type="password" placeholder="••••••••" fullWidth />
                </EvoForm.Field>
                <EvoForm.Field>
                  <EvoSelect
                    label="Server"
                    placeholder="Select server…"
                    fullWidth
                    options={[
                      { value: 'us-east', label: 'US East' },
                      { value: 'us-west', label: 'US West' },
                      { value: 'eu', label: 'EU Central' },
                    ]}
                  />
                </EvoForm.Field>
                <EvoButton label="Create Account" variant="solid" severity="primary" />
              </EvoForm>
            </Section>
          </div>

          {/* ─── FEEDBACK & OVERLAYS ─────────────────────────────────── */}
          <div className="space-y-10">
            <h3 className="text-lg font-semibold text-amber-400 uppercase tracking-widest">Feedback &amp; Overlays</h3>

            {/* Modal */}
            <Section title="Modal" description="Portal-based dialog with Header / Body / Footer slots, backdrop click & Escape key close." tag="EvoModal">
              <EvoButton label="Open Modal" onClick={() => setModalOpen(true)} />
              <EvoModal open={modalOpen} onClose={() => setModalOpen(false)} size="md">
                <EvoModal.Header onClose={() => setModalOpen(false)}>
                  Confirm Equip Item
                </EvoModal.Header>
                <EvoModal.Body>
                  <p>Are you sure you want to equip the <strong style={{ color: '#22d3ee' }}>Void Walker Armor</strong>? This will replace your current equipped chest piece.</p>
                  <br />
                  <p>Stats change: DEF +200, EVA +180, HP −50</p>
                </EvoModal.Body>
                <EvoModal.Footer>
                  <EvoButton label="Cancel" variant="outline" severity="secondary" onClick={() => setModalOpen(false)} />
                  <EvoButton label="Confirm Equip" severity="primary" onClick={() => setModalOpen(false)} />
                </EvoModal.Footer>
              </EvoModal>
            </Section>

            {/* Toast */}
            <Section title="Toast" description="Portal-based toast notifications with auto-dismiss, 4 severity variants, and slide-in animation." tag="useToast">
              <ToastDemo />
            </Section>

            {/* Tooltip */}
            <Section title="Tooltip" description="Hover/focus tooltip with 4 placements and fade animation." tag="EvoTooltip">
              <div className="flex flex-wrap gap-8 items-center justify-center py-6">
                {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
                  <EvoTooltip key={p} content={`Tooltip — ${p}`} placement={p}>
                    <EvoButton label={p} variant="outline" severity="secondary" />
                  </EvoTooltip>
                ))}
                <EvoTooltip content="Equip to gain +200 DEF and —50 SPD" placement="top">
                  <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', cursor: 'default', fontSize: '0.875rem', color: '#94a3b8' }}>
                    Hover for item stats
                  </span>
                </EvoTooltip>
              </div>
            </Section>

            {/* Alert */}
            <Section title="Alert" description="Inline feedback banner with 4 severity types and optional dismiss button." tag="EvoAlert">
              <div className="space-y-3">
                <EvoAlert type="success" title="Item Equipped">Void Walker Armor has been equipped. Your defense increased by 200.</EvoAlert>
                <EvoAlert type="error" title="Purchase Failed">Insufficient gold. You need 500 more gold to complete this transaction.</EvoAlert>
                <EvoAlert type="warning" title="Low Durability" dismissible>Your weapon durability is below 10%. Visit the blacksmith soon.</EvoAlert>
                <EvoAlert type="info" title="Season 4 Live">New content is available. Check the event board for limited quests.</EvoAlert>
              </div>
            </Section>
          </div>

          {/* ─── DATA DISPLAY ────────────────────────────────────────── */}
          <div className="space-y-10">
            <h3 className="text-lg font-semibold text-rose-400 uppercase tracking-widest">Data Display</h3>

            {/* Badge */}
            <Section title="Badge" description="Pill badge with solid / outline / subtle variants, 6 severities, dot indicator, and removable chip." tag="EvoBadge">
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Solid</p>
                  <EvoBadge.Group>
                    {(['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const).map((s) => (
                      <EvoBadge key={s} severity={s}>{s}</EvoBadge>
                    ))}
                  </EvoBadge.Group>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Outline</p>
                  <EvoBadge.Group>
                    {(['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const).map((s) => (
                      <EvoBadge key={s} severity={s} variant="outline">{s}</EvoBadge>
                    ))}
                  </EvoBadge.Group>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Subtle + dot + removable</p>
                  <EvoBadge.Group>
                    <EvoBadge severity="primary" variant="subtle" dot>Online</EvoBadge>
                    <EvoBadge severity="success" variant="subtle" dot>Active Quest</EvoBadge>
                    <EvoBadge severity="warning" variant="subtle">Low Durability</EvoBadge>
                    <EvoBadge severity="danger" variant="subtle" removable onRemove={() => {}}>Debuff</EvoBadge>
                    <EvoBadge severity="info" size="lg">Season 4</EvoBadge>
                    <EvoBadge severity="secondary" size="sm">Beta</EvoBadge>
                  </EvoBadge.Group>
                </div>
              </div>
            </Section>

            {/* Skeleton */}
            <Section title="Skeleton" description="Shimmer loading placeholder with Text, Circle, and Box variants." tag="EvoSkeleton">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Card skeleton</p>
                  <div className="flex items-center gap-3">
                    <EvoSkeleton.Circle size={44} />
                    <div style={{ flex: 1 }}>
                      <EvoSkeleton width="60%" height="0.875rem" borderRadius={4} />
                      <div style={{ marginTop: '0.375rem' }}>
                        <EvoSkeleton width="40%" height="0.75rem" borderRadius={4} />
                      </div>
                    </div>
                  </div>
                  <EvoSkeleton.Text lines={3} />
                  <EvoSkeleton width="100%" height="2.25rem" borderRadius={8} />
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">List skeleton</p>
                  {[80, 65, 90, 55].map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <EvoSkeleton.Circle size={32} />
                      <EvoSkeleton width={`${w}%`} height="0.875rem" borderRadius={4} />
                    </div>
                  ))}
                </div>
              </div>
            </Section>
            {/* Table */}
            <Section title="Table" description="Dynamic data table with typed columns, custom cell renderers, and onRowDoubleClick callback." tag="EvoTable">
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Leaderboard — double-click a row to inspect</p>
                  <EvoTable
                    columns={leaderboardColumns}
                    data={leaderboardData}
                    onRowDoubleClick={(row) => setSelectedPlayer(row)}
                  />
                </div>

                {selectedPlayer && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <span>
                      Selected: <strong style={{ color: '#e2e8f0' }}>{selectedPlayer.name}</strong>
                      {' '}— {selectedPlayer.class} · Lv {selectedPlayer.level} · {selectedPlayer.score.toLocaleString()} pts
                    </span>
                    <button
                      onClick={() => setSelectedPlayer(null)}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Empty state</p>
                  <EvoTable columns={leaderboardColumns} data={[]} emptyText="No players on the leaderboard yet." />
                </div>
              </div>
            </Section>
          </div>

          {/* ─── BUTTON SHOWCASE ─────────────────────────────────────── */}
          <div className="space-y-10 border-t border-slate-800 pt-16">
            <h3 className="text-lg font-semibold text-slate-400 uppercase tracking-widest">Buttons (existing)</h3>
            <Section title="EvoButton" description="All variant × severity combinations at every size." tag="EvoButton">
              <div className="space-y-5">
                {(['solid', 'outline', 'ghost', 'rounded'] as const).map((variant) => (
                  <div key={variant}>
                    <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">variant=&quot;{variant}&quot;</p>
                    <EvoStack direction="row" gap="0.5rem" wrap>
                      {(['primary', 'secondary', 'danger', 'warning', 'success', 'info'] as const).map((s) => (
                        <EvoButton key={s} label={s} variant={variant} severity={s} />
                      ))}
                    </EvoStack>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Sizes</p>
                  <EvoStack direction="row" gap="0.5rem" align="center">
                    <EvoButton label="Small" size="sm" />
                    <EvoButton label="Medium" size="md" />
                    <EvoButton label="Large" size="lg" />
                    <EvoButton label="Disabled" disabled />
                  </EvoStack>
                </div>
              </div>
            </Section>
          </div>

          {/* ─── COLOR PALETTE ───────────────────────────────────────── */}
          <section className="space-y-8 border-t border-slate-800 pt-16">
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
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          EvoUI Design System · 23 Components · Built with SCSS Modules &amp; React
        </div>
      </footer>
    </div>
  );
}

export default function Showcase() {
  return (
    <EvoToastProvider>
      <ShowcaseInner />
    </EvoToastProvider>
  );
}
