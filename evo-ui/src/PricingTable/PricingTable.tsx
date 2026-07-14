import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactNode,
} from 'react';
import styles from '../css/pricingtable.module.scss';
import { EvoBadge } from '../Badge/Badge';

// ============================================================
// EvoPricingTable
// ------------------------------------------------------------
// Researched against Radix (no primitive exists — pricing grids
// are always hand-rolled) and Mantine/shadcn "pricing" recipes,
// which are uniformly a `<Grid><Card>…</Card></Grid>` — each
// tier sizes to its own content, so column 2's price line rarely
// lands at the same height as column 1's, and the whole point of
// the contrast-effect psychology principle (anchor price next to
// real price, recommended tier visually raised) is undercut: a
// user can't scan *across* a ragged grid.
//
// The one distinctive move: tiers aren't independent cards laid
// out in a plain grid — `EvoPricingTable` computes the tier count
// and (desktop-only, ≥768px) uses CSS Grid `subgrid` to give every
// tier's name/price/description/divider row the *same* height as
// its siblings, and stretches the feature+CTA area so every CTA
// lands on one shared baseline. That row-for-row alignment is what
// makes a price actually readable "in context" (对比效应) instead
// of as an isolated card. Below 768px tiers stack to one column and
// the subgrid math is moot, so it's skipped entirely. Everything
// else — colour, spacing, motion — stays as quiet as EvoCard.
// ============================================================

export type EvoPricingTableSize = 'sm' | 'md' | 'lg';

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ');
}

interface PricingTableContextValue {
  recommendedId?: string;
  size: EvoPricingTableSize;
  alignFeatures: boolean;
}

const PricingTableContext = createContext<PricingTableContextValue>({
  size: 'md',
  alignFeatures: true,
});

// ----- Root ---------------------------------------------------

export interface EvoPricingTableProps extends HTMLAttributes<HTMLDivElement> {
  /** id of the `Tier` to visually elevate as the recommended pick. */
  recommended?: string;
  /** @default 'md' */
  size?: EvoPricingTableSize;
  /**
   * Grid-align each tier's name/price/description/feature rows across
   * columns (desktop only) so the set reads as one comparable table
   * instead of a ragged row of independently-sized cards.
   * @default true
   */
  alignFeatures?: boolean;
  /** Billing-cadence switcher (e.g. monthly/yearly toggle) rendered above the tiers. */
  cadence?: ReactNode;
  children: ReactNode;
}

export const EvoPricingTableRoot = forwardRef<HTMLDivElement, EvoPricingTableProps>(
  function EvoPricingTableRoot(
    {
      recommended,
      size = 'md',
      alignFeatures = true,
      cadence,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const tierCount = useMemo(
      () => Children.toArray(children).filter(isValidElement).length,
      [children],
    );

    const ctxValue = useMemo<PricingTableContextValue>(
      () => ({ recommendedId: recommended, size, alignFeatures }),
      [recommended, size, alignFeatures],
    );

    const mergedStyle = {
      '--evo-pricing-cols': tierCount || 1,
      ...style,
    } as CSSProperties;

    return (
      <PricingTableContext.Provider value={ctxValue}>
        <div ref={ref} className={cx(styles.root, styles[size], className)} style={mergedStyle} {...rest}>
          {cadence && <div className={styles.cadence}>{cadence}</div>}
          <div className={cx(styles.tiers, !alignFeatures && styles.noAlign)}>{children}</div>
        </div>
      </PricingTableContext.Provider>
    );
  },
);
EvoPricingTableRoot.displayName = 'EvoPricingTableRoot';

// ----- Tier -----------------------------------------------------

export interface EvoPricingTableTierProps extends HTMLAttributes<HTMLDivElement> {
  /** Stable identifier — match against `EvoPricingTable`'s `recommended` prop. Also used as the DOM `id`. */
  id: string;
  name: ReactNode;
  /** Current price, e.g. `'$29'`. */
  price: ReactNode;
  /** Original price rendered struck-through beside `price` (discount / contrast anchor). */
  anchorPrice?: ReactNode;
  /** Marks this as the high flagship tier that anchors the comparison — rendered with quieter, receded chrome. */
  anchor?: boolean;
  /** Visually elevates this tier. Equivalent to matching `EvoPricingTable`'s `recommended` id. */
  recommended?: boolean;
  /** Ribbon content. A string is wrapped in `EvoBadge` automatically. */
  badge?: ReactNode;
  description?: ReactNode;
  /** Billing period suffix, e.g. `'/mo'`. */
  period?: ReactNode;
}

export const EvoPricingTableTier = forwardRef<HTMLDivElement, EvoPricingTableTierProps>(
  function EvoPricingTableTier(
    {
      id,
      name,
      price,
      anchorPrice,
      anchor = false,
      recommended = false,
      badge,
      description,
      period,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const ctx = useContext(PricingTableContext);
    const isRecommended = recommended || (ctx.recommendedId != null && ctx.recommendedId === id);

    const resolvedBadge =
      badge != null ? (
        typeof badge === 'string' ? (
          <EvoBadge severity="primary" variant="solid" size="sm">
            {badge}
          </EvoBadge>
        ) : (
          badge
        )
      ) : isRecommended ? (
        <EvoBadge severity="primary" variant="solid" size="sm">
          Recommended
        </EvoBadge>
      ) : null;

    return (
      <div
        ref={ref}
        id={id}
        role="group"
        aria-labelledby={`${id}-name`}
        className={cx(
          styles.tier,
          anchor && styles.anchor,
          isRecommended && styles.recommended,
          className,
        )}
        {...rest}
      >
        <div className={styles.tierHeader}>
          <span id={`${id}-name`} className={styles.tierName}>{name}</span>
          {resolvedBadge && <span className={styles.tierBadge}>{resolvedBadge}</span>}
        </div>

        <EvoPricingTablePrice className={styles.tierPrice} value={price} anchor={anchorPrice} period={period} />

        <div className={styles.tierDescription}>{description}</div>

        <div className={styles.tierDivider} aria-hidden="true" />

        <div className={styles.tierBody}>{children}</div>
      </div>
    );
  },
);
EvoPricingTableTier.displayName = 'EvoPricingTableTier';

// ----- Price ------------------------------------------------

export interface EvoPricingTablePriceProps extends HTMLAttributes<HTMLDivElement> {
  value: ReactNode;
  /** Original price rendered struck-through. Announced to screen readers as "Original price". */
  anchor?: ReactNode;
  period?: ReactNode;
}

export const EvoPricingTablePrice = forwardRef<HTMLDivElement, EvoPricingTablePriceProps>(
  function EvoPricingTablePrice({ value, anchor, period, className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx(styles.price, className)} {...rest}>
        {anchor != null && (
          <span className={styles.priceAnchor}>
            <span className={styles.srOnly}>Original price </span>
            <del>{anchor}</del>
          </span>
        )}
        <span className={styles.priceValue}>{value}</span>
        {period != null && <span className={styles.pricePeriod}>{period}</span>}
      </div>
    );
  },
);
EvoPricingTablePrice.displayName = 'EvoPricingTablePrice';

// ----- FeatureList --------------------------------------------

export type EvoPricingTableFeatureListProps = HTMLAttributes<HTMLUListElement>;

export const EvoPricingTableFeatureList = forwardRef<HTMLUListElement, EvoPricingTableFeatureListProps>(
  function EvoPricingTableFeatureList({ className, ...rest }, ref) {
    return <ul ref={ref} className={cx(styles.featureList, className)} {...rest} />;
  },
);
EvoPricingTableFeatureList.displayName = 'EvoPricingTableFeatureList';

// ----- Feature --------------------------------------------------

export interface EvoPricingTableFeatureProps extends LiHTMLAttributes<HTMLLIElement> {
  /** @default true */
  included?: boolean;
}

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const EvoPricingTableFeature = forwardRef<HTMLLIElement, EvoPricingTableFeatureProps>(
  function EvoPricingTableFeature({ included = true, className, children, ...rest }, ref) {
    return (
      <li ref={ref} className={cx(styles.feature, !included && styles.excluded, className)} {...rest}>
        <span className={styles.featureIcon}>{included ? <CheckIcon /> : <MinusIcon />}</span>
        {!included && <span className={styles.srOnly}>Not included: </span>}
        <span className={styles.featureText}>{children}</span>
      </li>
    );
  },
);
EvoPricingTableFeature.displayName = 'EvoPricingTableFeature';

// ----- Cta --------------------------------------------------

export type EvoPricingTableCtaProps = HTMLAttributes<HTMLDivElement>;

export const EvoPricingTableCta = forwardRef<HTMLDivElement, EvoPricingTableCtaProps>(
  function EvoPricingTableCta({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(styles.cta, className)} {...rest} />;
  },
);
EvoPricingTableCta.displayName = 'EvoPricingTableCta';

// ----- Compound export -----

type EvoPricingTableComponent = typeof EvoPricingTableRoot & {
  Root: typeof EvoPricingTableRoot;
  Tier: typeof EvoPricingTableTier;
  Price: typeof EvoPricingTablePrice;
  FeatureList: typeof EvoPricingTableFeatureList;
  Feature: typeof EvoPricingTableFeature;
  Cta: typeof EvoPricingTableCta;
};

export const EvoPricingTable = EvoPricingTableRoot as EvoPricingTableComponent;
EvoPricingTable.Root = EvoPricingTableRoot;
EvoPricingTable.Tier = EvoPricingTableTier;
EvoPricingTable.Price = EvoPricingTablePrice;
EvoPricingTable.FeatureList = EvoPricingTableFeatureList;
EvoPricingTable.Feature = EvoPricingTableFeature;
EvoPricingTable.Cta = EvoPricingTableCta;
