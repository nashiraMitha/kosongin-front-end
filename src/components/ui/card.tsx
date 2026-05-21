export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 pb-0 flex flex-col space-y-1.5">{children}</div>
)

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
)