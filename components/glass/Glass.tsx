"use client";

interface GlassProps {
  children: React.ReactNode;
  selected?: boolean;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function Glass({ children, selected, color = "rgba(255,255,255,0.05)", className, onClick }: GlassProps) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        background: selected
          ? `linear-gradient(135deg, ${color}12, ${color}05)`
          : "linear-gradient(135deg, rgba(255,255,255,0.038), rgba(255,255,255,0.012))",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: `1px solid ${selected ? color + "42" : "rgba(255,255,255,0.07)"}`,
        boxShadow: selected
          ? `0 0 0 1px ${color}18, 0 8px 40px ${color}20, inset 0 1px 0 rgba(255,255,255,0.07)`
          : "0 4px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Reflet interne — signature Liquid Glass */}
      <div style={{
        position: "absolute", top: 0, left: "12%", right: "30%",
        height: 1, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent)",
      }} />
      {children}
    </div>
  );
}
