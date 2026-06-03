"use client";

import Link from "next/link";
import { MenuIcon, PlusIcon } from "@/components/icp-tool/ui/icons";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <div className="topbar">
      <button type="button" className="iconbtn" onClick={onMenuClick} aria-label="Ouvrir le menu">
        <MenuIcon />
      </button>
      <Link className="topbar__brand" href="/icp/tool/dashboard">
        <span className="logo__mark">Rezus</span>
      </Link>
      <Link className="iconbtn" href="/icp/tool/new" aria-label="Nouvelle session">
        <PlusIcon />
      </Link>
    </div>
  );
}
