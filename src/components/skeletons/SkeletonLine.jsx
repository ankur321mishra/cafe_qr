export default function SkeletonLine({ width = "100%", height = "1rem", className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-stone-800 rounded ${className}`}
      style={{ width, height }}
    />
  );
}
