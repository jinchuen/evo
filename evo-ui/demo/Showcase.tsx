import React from 'react';
import { EvoButton } from '../src/Button/Button';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 40 }}>
    <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 16 }}>
      {title}
    </h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {children}
    </div>
  </section>
);

export function buttonOnClick() {
  console.log('btn Click')
}

export const Showcase = () => (
    <Section title="Default">
      <EvoButton variant='ghost' label='Hi' onClick={()=> buttonOnClick()}/>
      <EvoButton label='' />
      <EvoButton label="Learn more" />
    </Section>
);
