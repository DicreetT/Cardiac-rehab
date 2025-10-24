import { useState, useEffect } from "react";

interface BubbleBackgroundProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  minAnimationDuration?: number;
  maxAnimationDuration?: number;
  maxDelaySeconds?: number;
  opacity?: string;
}

export default function BubbleBackground({
  count = 8,
  minSize = 40,
  maxSize = 80,
  minAnimationDuration = 6,
  maxAnimationDuration = 16,
  maxDelaySeconds = 5,
  opacity = "bg-white/30"
}: BubbleBackgroundProps) {
  const [bubbleStyles, setBubbleStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = Array(count).fill(0).map(() => ({
      width: `${Math.random() * (maxSize - minSize) + minSize}px`,
      height: `${Math.random() * (maxSize - minSize) + minSize}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * (maxAnimationDuration - minAnimationDuration) + minAnimationDuration}s`,
      animationDelay: `${Math.random() * maxDelaySeconds}s`,
    }));

    setBubbleStyles(styles);
  }, [count, minSize, maxSize, minAnimationDuration, maxAnimationDuration, maxDelaySeconds]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbleStyles.map((style, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${opacity} animate-float`}
          style={style}
        />
      ))}
    </div>
  );
}
