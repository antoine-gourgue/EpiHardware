import { Container, Skeleton } from '@epihardware/ui'

export default function ProductsLoading() {
  return (
    <Container className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-[16rem_1fr]">
      <div className="hidden space-y-6 lg:block">
        <Skeleton className="h-6 w-24" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
      <div>
        <Skeleton className="mb-6 h-11 w-48" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <Skeleton className="aspect-[4/3] rounded-b-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
