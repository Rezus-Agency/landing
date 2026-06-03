/**
 * Toutes les icônes SVG de l'outil ICP Discovery.
 * Port du IC.* object de icp2/app.js en composants React.
 * Tous strokeWidth/strokeLinecap/strokeLinejoin sont définis sur l'élément SVG racine
 * pour rester compact. Les composants n'acceptent qu'un className optionnel.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function GridIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={2} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.7} {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={2} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={2} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={2.4} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={2} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function DotsIcon(props: IconProps) {
  return (
    <svg {...baseProps} fill="currentColor" stroke="none" {...props}>
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.9} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={2} {...props}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={2.2} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={2.4} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={2} {...props}>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

export function StopRecIcon(props: IconProps) {
  return (
    <svg {...baseProps} fill="currentColor" stroke="none" {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2.5" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M10 4H7v16h3zM17 4h-3v16h3z" />
    </svg>
  );
}

export function PanelIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M14 4v16" />
    </svg>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 8v4l3 2" />
    </svg>
  );
}

export function SplitIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M12 3v18M5 8 9 12l-4 4M19 8l-4 4 4 4" />
    </svg>
  );
}

export function PlugIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0zM12 16v6" />
    </svg>
  );
}

export function MagnetIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M5 4v8a7 7 0 0 0 14 0V4M5 9h4M15 9h4" />
    </svg>
  );
}

export function BooksIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M4 5v15M4 5a2 2 0 0 1 2-2h4v17H6a2 2 0 0 0-2 2M20 5v15M20 5a2 2 0 0 0-2-2h-4v17h4a2 2 0 0 1 2 2" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function Doc2Icon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M4 4v16h16M8 16v-4M12 16V8M16 16v-6" />
    </svg>
  );
}

export function Warn2Icon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.7} {...props}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </svg>
  );
}

export function FlagIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M5 21V4M5 4h11l-1.5 4L16 12H5" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.7} {...props}>
      <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M8 8h3M8 12h3M8 16h3" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.7} {...props}>
      <path d="M12 21s7-5.7 7-11a7 7 0 0 0-14 0c0 5.3 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.7} {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5M16 5.2a3.2 3.2 0 0 1 0 6M21 20c0-2.5-1.3-4-3.5-4.6" />
    </svg>
  );
}

export function PdfIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.8} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function BrainIcon(props: IconProps) {
  return (
    <svg {...baseProps} strokeWidth={1.7} {...props}>
      <path d="M9 4a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 4 9a2.5 2.5 0 0 0 1 2 2.5 2.5 0 0 0 1 4.5 2.5 2.5 0 0 0 5 .5V4.5A2.5 2.5 0 0 0 9 4zM15 4a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 20 9a2.5 2.5 0 0 1-1 2 2.5 2.5 0 0 1-1 4.5 2.5 2.5 0 0 1-5 .5" />
    </svg>
  );
}

/** Map iconName (utilisé dans COMING_SOON) → composant icône. */
export const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  history: HistoryIcon,
  split: SplitIcon,
  plug: PlugIcon,
  magnet: MagnetIcon,
  mic: MicIcon,
  books: BooksIcon,
  spark: SparkIcon,
  target: TargetIcon,
  brain: BrainIcon,
  grid: GridIcon,
};
