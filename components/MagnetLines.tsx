
import React, { useRef, useEffect } from "react";

interface MagnetLinesProps {
  rows?: number;
  cols?: number;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  baseAngle?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const MagnetLines: React.FC<MagnetLinesProps> = ({ 
  rows = 9, 
  cols = 9, 
  lineColor = "rgba(100, 116, 139, 0.3)", // slate-500 with opacity
  lineWidth = "2px", 
  lineHeight = "20px", 
  baseAngle = 0, 
  className = "",
  style = {} 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll("span");
    
    // We use a simple grid calculation to make them point at the mouse
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      // Mouse position relative to the container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        // Center of the specific line segment
        const itemCenterX = itemRect.left + itemRect.width / 2 - rect.left;
        const itemCenterY = itemRect.top + itemRect.height / 2 - rect.top;

        const deltaX = mouseX - itemCenterX;
        const deltaY = mouseY - itemCenterY;
        
        // Calculate angle
        const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        
        // Apply rotation
        (item as HTMLElement).style.transform = `rotate(${angle + 90}deg)`;
      });
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`grid place-items-center ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: "100%",
        height: "100%",
        ...style
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span
          key={i}
          className="block transition-transform duration-200 ease-out will-change-transform"
          style={{
            width: lineWidth,
            height: lineHeight,
            backgroundColor: lineColor,
            transform: `rotate(${baseAngle}deg)`,
          }}
        />
      ))}
    </div>
  );
};
