export const Avatar = ({ src, fallback }: { src?: string, fallback: string }) => (
  <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
    {src ? (
      <img src={src} className="aspect-square h-full w-full" alt="avatar" />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-white">
        {fallback}
      </div>
    )}
  </div>
)