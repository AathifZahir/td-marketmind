export default function LoadingDots() {
  return (
    <div className="flex space-x-1.5 items-center">
      <span
        className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"
        style={{ animationDelay: "0ms" }}
      ></span>
      <span
        className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
        style={{ animationDelay: "300ms" }}
      ></span>
      <span
        className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
        style={{ animationDelay: "600ms" }}
      ></span>
    </div>
  );
}
