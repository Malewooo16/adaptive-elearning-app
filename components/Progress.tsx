

interface ProgressProps {
  value: number; // Mastery percentage (0 - 100)
}

export default function Progress({ value }: ProgressProps) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        
      <div
        className={`h-full transition-all duration-500 ease-in-out ${
          value === 100 ? "bg-green-500" : value > 50 ? "bg-yellow-400" : "bg-red-400"
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
