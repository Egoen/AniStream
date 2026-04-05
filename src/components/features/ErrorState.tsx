import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";

interface Props {
  message?: string;
  onRetry?: () => void;
  type?: "error" | "empty" | "offline";
}

export default function ErrorState({ message, onRetry, type = "error" }: Props) {
  const icons = { error: AlertTriangle, empty: AlertTriangle, offline: WifiOff };
  const Icon = icons[type];

  const defaultMessages = {
    error: "Gagal memuat data. Coba lagi.",
    empty: "Tidak ada data yang tersedia.",
    offline: "Tidak ada koneksi internet.",
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="bg-bg-elevated rounded-full p-5 mb-4 border border-subtle">
        <Icon size={32} className={type === "error" ? "text-red-400" : "text-text-subtle"} />
      </div>
      <p className="text-text-muted text-sm max-w-xs">{message || defaultMessages[type]}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-light rounded-xl text-sm font-semibold text-white transition-colors"
        >
          <RefreshCw size={14} /> Coba Lagi
        </button>
      )}
    </div>
  );
}
