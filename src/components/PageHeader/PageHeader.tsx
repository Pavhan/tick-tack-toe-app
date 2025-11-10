import { cn } from "@/lib/utils";

const PageHeader = () => {
  // just a visual indicator of the backend type
  const backendType = import.meta.env.VITE_BACKEND_TYPE || 'node';
  const isRust = backendType.toLowerCase() === 'rust';

  return (
    <header className="flex w-full flex-col pr-24 md:pr-0 items-start gap-1">
      <h1>Tic Tac Toe Game</h1>
      <div
        className={cn("text-xs font-semibold text-blue-800", { 
            'text-orange-800': isRust,
        })}
      >
        with {isRust ? 'Rust Backend' : 'Node Backend'}
      </div>
    </header>
  );
};

export default PageHeader;
