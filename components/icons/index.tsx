interface IconProps {
  className?: string;
}

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor" as const,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": "true" as const,
  focusable: "false" as const,
};

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg className={className} {...baseProps}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg className={className} {...baseProps}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...baseProps} strokeWidth={2.2}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg className={className} {...baseProps} strokeWidth={2.2}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} {...baseProps}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function BreadcrumbIcon({ className }: IconProps) {
  return (
    <svg className={className} {...baseProps}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}
