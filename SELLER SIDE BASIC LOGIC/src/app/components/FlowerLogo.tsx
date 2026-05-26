export default function FlowerLogo({ className = 'w-8 h-8' }: { className?: string }) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return (
      <circle
        key={i}
        cx={16 + 10 * Math.cos(angle)}
        cy={16 + 10 * Math.sin(angle)}
        r={3.5}
        fill="#ef4d23"
      />
    );
  });
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      {petals}
      <circle cx={16} cy={16} r={3.5} fill="#ef4d23" />
    </svg>
  );
}
