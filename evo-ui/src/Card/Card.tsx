import {
  forwardRef,
  createElement,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import styles from '../css/card.module.scss';

// ============================================================
// EvoCard
// ------------------------------------------------------------
// Compose-based card primitive. The API takes after Radix:
// <EvoCard.Root> is the documented surface; <EvoCard> is kept
// as an ergonomic alias that forwards to Root.
//
// Visual axes are deliberately minimal — three structural
// variants (elevated / outlined / ghost). All colour comes
// from semantic theme tokens, so dark mode is automatic.
//
// When `interactive` is set the root is rendered as a real
// <button type="button"> or, if `href` is provided, a real
// <a>. We never use <div onClick> — keyboard users and screen
// readers get first-class treatment.
// ============================================================

export type EvoCardVariant = 'elevated' | 'outlined' | 'ghost';
export type EvoCardOrientation = 'vertical' | 'horizontal' | 'responsive';
export type EvoCardHeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface EvoCardRootBase {
  variant?: EvoCardVariant;
  orientation?: EvoCardOrientation;
  children: ReactNode;
}

interface EvoCardRootStaticProps
  extends EvoCardRootBase,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  interactive?: false;
  href?: never;
}

interface EvoCardRootButtonProps
  extends EvoCardRootBase,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  interactive: true;
  href?: never;
  /** @default 'button' (never auto-submits) */
  type?: 'button' | 'submit' | 'reset';
}

interface EvoCardRootAnchorProps
  extends EvoCardRootBase,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> {
  interactive: true;
  href: string;
}

export type EvoCardRootProps =
  | EvoCardRootStaticProps
  | EvoCardRootButtonProps
  | EvoCardRootAnchorProps;

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ');
}

function rootClasses(
  variant: EvoCardVariant,
  orientation: EvoCardOrientation,
  interactive: boolean,
  className?: string,
) {
  return cx(
    styles.root,
    styles[variant],
    styles[`orient-${orientation}`],
    interactive && styles.interactive,
    className,
  );
}

export const EvoCardRoot = forwardRef<HTMLElement, EvoCardRootProps>(
  function EvoCardRoot(props, ref) {
    const {
      variant = 'elevated',
      orientation = 'vertical',
      interactive,
      className,
      children,
      ...rest
    } = props as EvoCardRootStaticProps &
      Partial<EvoCardRootAnchorProps> &
      Partial<EvoCardRootButtonProps> & { interactive?: boolean };

    const isInteractive = interactive === true;
    const classes = rootClasses(variant, orientation, isInteractive, className);

    if (isInteractive && typeof (rest as { href?: string }).href === 'string') {
      const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a ref={ref as Ref<HTMLAnchorElement>} className={classes} {...anchorRest}>
          {children}
        </a>
      );
    }

    if (isInteractive) {
      const { type = 'button', ...buttonRest } =
        rest as ButtonHTMLAttributes<HTMLButtonElement>;
      return (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type={type}
          className={classes}
          {...buttonRest}
        >
          {children}
        </button>
      );
    }

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={classes}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);
EvoCardRoot.displayName = 'EvoCardRoot';

// ----- Section slots -----

export type EvoCardHeaderProps = HTMLAttributes<HTMLDivElement>;
export type EvoCardBodyProps = HTMLAttributes<HTMLDivElement>;
export type EvoCardFooterProps = HTMLAttributes<HTMLDivElement>;

export const EvoCardHeader = forwardRef<HTMLDivElement, EvoCardHeaderProps>(
  function EvoCardHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(styles.header, className)} {...rest} />;
  },
);
EvoCardHeader.displayName = 'EvoCardHeader';

export const EvoCardBody = forwardRef<HTMLDivElement, EvoCardBodyProps>(
  function EvoCardBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(styles.body, className)} {...rest} />;
  },
);
EvoCardBody.displayName = 'EvoCardBody';

export const EvoCardFooter = forwardRef<HTMLDivElement, EvoCardFooterProps>(
  function EvoCardFooter({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(styles.footer, className)} {...rest} />;
  },
);
EvoCardFooter.displayName = 'EvoCardFooter';

// ----- Title (configurable heading level) -----

export interface EvoCardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level. Visual size is fixed by the stylesheet. @default 'h3' */
  as?: EvoCardHeadingLevel;
  children: ReactNode;
}

export const EvoCardTitle = forwardRef<HTMLHeadingElement, EvoCardTitleProps>(
  function EvoCardTitle({ as = 'h3', className, children, ...rest }, ref) {
    return createElement(
      as,
      { ref, className: cx(styles.title, className), ...rest },
      children,
    );
  },
);
EvoCardTitle.displayName = 'EvoCardTitle';

// ----- Description -----

export type EvoCardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const EvoCardDescription = forwardRef<
  HTMLParagraphElement,
  EvoCardDescriptionProps
>(function EvoCardDescription({ className, ...rest }, ref) {
  return <p ref={ref} className={cx(styles.description, className)} {...rest} />;
});
EvoCardDescription.displayName = 'EvoCardDescription';

// ----- Media -----

export interface EvoCardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** Convenience: renders an <img>. Omit and pass children for custom media. */
  src?: string;
  /** Required when `src` is set. Empty string marks the image as decorative. */
  alt?: string;
  /** e.g. 16/9 or '4/3'. Applied when no explicit dimensions are given. */
  aspectRatio?: number | string;
  children?: ReactNode;
}

export const EvoCardMedia = forwardRef<HTMLDivElement, EvoCardMediaProps>(
  function EvoCardMedia(
    { src, alt, aspectRatio, className, style, children, ...rest },
    ref,
  ) {
    const mediaStyle: CSSProperties | undefined =
      aspectRatio != null
        ? { aspectRatio: aspectRatio as CSSProperties['aspectRatio'], ...style }
        : style;
    return (
      <div
        ref={ref}
        className={cx(styles.media, className)}
        style={mediaStyle}
        {...rest}
      >
        {src ? <img src={src} alt={alt ?? ''} className={styles.mediaImg} /> : children}
      </div>
    );
  },
);
EvoCardMedia.displayName = 'EvoCardMedia';

// ----- Compound export -----
//
// `EvoCard` is callable (forwards to Root) AND carries the sub-components
// as static properties so consumers can write either:
//   <EvoCard variant="outlined">…</EvoCard>
//   <EvoCard.Root variant="outlined">…</EvoCard.Root>

type EvoCardComponent = typeof EvoCardRoot & {
  Root: typeof EvoCardRoot;
  Header: typeof EvoCardHeader;
  Title: typeof EvoCardTitle;
  Description: typeof EvoCardDescription;
  Body: typeof EvoCardBody;
  Footer: typeof EvoCardFooter;
  Media: typeof EvoCardMedia;
};

export const EvoCard = EvoCardRoot as EvoCardComponent;
EvoCard.Root = EvoCardRoot;
EvoCard.Header = EvoCardHeader;
EvoCard.Title = EvoCardTitle;
EvoCard.Description = EvoCardDescription;
EvoCard.Body = EvoCardBody;
EvoCard.Footer = EvoCardFooter;
EvoCard.Media = EvoCardMedia;
