export function TopicCardSkeleton() {
  return (
    <div className="rounded-2xl p-4 border border-gray-200 bg-white/60 animate-pulse h-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded-md" />
            <div className="space-y-1">
              <div className="h-3 w-full bg-gray-200 rounded-md" />
              <div className="h-3 w-2/3 bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-3 py-2 rounded-lg bg-gray-100">
              <div className="h-3 w-14 mx-auto bg-gray-200 rounded-md mb-1" />
              <div className="h-4 w-8 mx-auto bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-gray-200 rounded-md" />
            <div className="h-4 w-4 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
