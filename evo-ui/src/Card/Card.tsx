'use client';

import React, { Children, ReactElement, useRef, useState } from 'react';
import styles from '../css/card.module.scss';

type CardColor = 'cyan' | 'rose' | 'emerald' | 'amber' | 'violet';
type CardVariant = 'normal' | 'playable' | 'glass' | 'neon' | 'holo' | 'pulse' | 'tilt';

interface EvoCardProps {
  variant?: CardVariant;
  color?: CardColor;
  children: React.ReactNode;
  className?: string;
}

export const EvoCard = ({ 
  variant = 'normal', 
  color = 'cyan', 
  children,
  className = ''
}: EvoCardProps) => {
  const childrenArray = Children.toArray(children) as ReactElement[];
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({});

  // Find Front and Back slots (for Playable variant)
  const frontContent = childrenArray.find(child => child.type === EvoCardFront) || children;
  const backContent = childrenArray.find(child => child.type === EvoCardBack);

  // 3D Tilt effect handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (variant !== 'tilt' || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    });
  };

  const handleMouseLeave = () => {
    if (variant !== 'tilt') return;
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    });
  };

  // --- NORMAL CARD ---
  if (variant === 'normal') {
    return (
      <div className={`${styles.normalCard} ${className}`} data-color={color}>
        {children}
      </div>
    );
  }

  // --- PLAYABLE FLIP CARD ---
  if (variant === 'playable') {
    return (
      <div className={`${styles.playableContainer} ${className}`} data-color={color}>
        <div className={styles.flipper}>
          <div className={styles.front}>
            {frontContent}
            <div className={styles.hologram} />
          </div>
          <div className={styles.back}>
            {backContent}
          </div>
        </div>
      </div>
    );
  }

  // --- GLASS CARD ---
  if (variant === 'glass') {
    return (
      <div className={`${styles.glassCard} ${className}`} data-color={color}>
        {children}
      </div>
    );
  }

  // --- NEON CARD ---
  if (variant === 'neon') {
    return (
      <div className={`${styles.neonCard} ${className}`} data-color={color}>
        {children}
      </div>
    );
  }

  // --- HOLOGRAPHIC CARD ---
  if (variant === 'holo') {
    return (
      <div className={`${styles.holoCard} ${className}`} data-color={color}>
        {children}
      </div>
    );
  }

  // --- PULSE CARD ---
  if (variant === 'pulse') {
    return (
      <div className={`${styles.pulseCard} ${className}`} data-color={color}>
        {children}
      </div>
    );
  }

  // --- 3D TILT CARD ---
  if (variant === 'tilt') {
    return (
      <div 
        ref={cardRef}
        className={`${styles.tiltCard} ${className}`} 
        data-color={color}
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.cardInner}>
          {children}
        </div>
      </div>
    );
  }

  return null;
};

// Sub-components for slot mapping
export const EvoCardFront = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const EvoCardBack = ({ children }: { children: React.ReactNode }) => <>{children}</>;

EvoCard.Front = EvoCardFront;
EvoCard.Back = EvoCardBack;

// Export style classes for external use
export const cardStyles = styles;
