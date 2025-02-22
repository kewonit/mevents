import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isLoading: boolean
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  return (
    <div className={cn(
      "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300",
      isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
        <span className="text-gray-600 font-medium">Loading...</span>
      </div>
    </div>
  )
}
