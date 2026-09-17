import logo from "@/assets/ranta-logo-r.png";
import { cn } from "@/lib/utils";

export interface BrandWordmarkProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  textClassName?: string;
  logoClassName?: string;
}

const SIZE_VARIANTS = {
  xs: {
    container: "text-sm",
    logo: "h-[1.14em] -translate-y-[0.03em] mr-[1px]",
  },
  sm: {
    container: "text-base",
    logo: "h-[1.15em] -translate-y-[0.04em] mr-[1px]",
  },
  md: {
    container: "text-lg",
    logo: "h-[1.16em] -translate-y-[0.04em] mr-[1px]",
  },
  lg: {
    container: "text-xl",
    logo: "h-[1.16em] -translate-y-[0.04em] mr-[1.5px]",
  },
  xl: {
    container: "text-2xl",
    logo: "h-[1.18em] -translate-y-[0.04em] mr-[1.5px]",
  },
};

/**
 * BrandWordmark renders the unified RantaPay logo wordmark where the iconic stylized
 * logo glyph serves as the initial capital "R", followed seamlessly by "antaPay".
 */
export function BrandWordmark({
  className,
  size = "md",
  textClassName,
  logoClassName,
}: BrandWordmarkProps) {
  const variant = SIZE_VARIANTS[size] || SIZE_VARIANTS.md;

  return (
    <span
      className={cn(
        "inline-flex items-center select-none font-black tracking-tight leading-none",
        variant.container,
        className
      )}
    >
      <img
        src={logo}
        alt="R"
        className={cn(
          "w-auto object-contain inline-block shrink-0 transition-transform duration-200 group-hover:scale-105",
          variant.logo,
          logoClassName
        )}
      />
      <span className={cn("text-slate-900 tracking-tight", textClassName)}>
        anta<span className="text-[#FFB21D]">Pay</span>
      </span>
    </span>
  );
}

export interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  textClassName?: string;
  logoClassName?: string;
}

/**
 * BrandLogo renders either the standalone icon or the full unified wordmark (when showText=true).
 */
export function BrandLogo({
  className,
  showText = false,
  size = "md",
  textClassName,
  logoClassName,
}: BrandLogoProps) {
  if (showText) {
    return (
      <BrandWordmark
        className={className}
        size={size}
        textClassName={textClassName}
        logoClassName={logoClassName}
      />
    );
  }

  return (
    <img
      src={logo}
      alt="RantaPay"
      className={cn("h-8 w-8 object-contain shrink-0", className)}
    />
  );
}
