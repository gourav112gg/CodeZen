import React from 'react';

/**
 * Premium Dashboard Skeleton Loader matching the exact columns and sizes of Dashboard.tsx
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 py-2 animate-pulse" id="dashboard-skeleton">
      {/* Top Banner Stats Grid */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Profile Card Left */}
        <div className="md:col-span-4 rounded-2xl border border-slate-900 bg-slate-950/40 p-6 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-2xl bg-slate-900/80 mb-4" />
          <div className="h-5 w-32 rounded bg-slate-900/80 mb-2" />
          <div className="h-3 w-24 rounded bg-emerald-500/10 mb-4" />
          <div className="h-3 w-52 rounded bg-slate-900/60 mb-1" />
          <div className="h-3 w-40 rounded bg-slate-900/60 mb-4" />
          
          {/* Skill List Pills */}
          <div className="flex flex-wrap justify-center gap-1.5 pt-2 w-full">
            <div className="h-5 w-14 rounded bg-slate-900/80" />
            <div className="h-5 w-16 rounded bg-slate-900/80" />
            <div className="h-5 w-12 rounded bg-slate-900/80" />
            <div className="h-5 w-18 rounded bg-slate-900/80" />
          </div>
          <div className="flex gap-3 mt-6 border-t border-slate-900/60 pt-4 w-full justify-center">
            <div className="h-4.5 w-4.5 rounded-full bg-slate-900/80" />
            <div className="h-4.5 w-4.5 rounded-full bg-slate-900/80" />
          </div>
        </div>

        {/* 3 Analytics Metrics Grid Right */}
        <div className="md:col-span-8 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="rounded-2xl border border-slate-905 bg-slate-900/10 p-6 flex flex-col justify-between h-44">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-3 w-28 rounded bg-slate-900/80" />
                  <div className="h-8 w-16 rounded bg-slate-900/60" />
                </div>
                <div className="h-5 w-5 rounded-md bg-slate-900/80" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 w-full rounded bg-slate-900/60" />
                <div className="h-2 w-5/6 rounded bg-slate-900/60" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main split: Left Projects Showroom, Right Member Leaderboard */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Projects Showroom Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-56 rounded bg-slate-900/80" />
              <div className="h-3.5 w-72 rounded bg-slate-900/60" />
            </div>
            <div className="h-8 w-24 rounded-xl bg-slate-900/80" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="rounded-2xl border border-slate-900 bg-slate-900/10 p-5 flex flex-col justify-between h-48">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6.5 w-6.5 rounded bg-slate-900/80" />
                      <div className="h-3 w-16 rounded bg-slate-900/60" />
                    </div>
                    <div className="h-5 w-10 rounded bg-slate-900/80" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4.5 w-32 rounded bg-slate-900/80" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full rounded bg-slate-900/65" />
                      <div className="h-3 w-11/12 rounded bg-slate-900/65" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 pt-4 border-t border-slate-900/60 mt-4">
                  <div className="h-4 w-10 rounded bg-slate-900/80" />
                  <div className="h-4 w-12 rounded bg-slate-900/80" />
                  <div className="h-4 w-10 rounded bg-slate-900/80" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Leaderboard Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-slate-900/80" />
            <div className="h-3.5 w-64 rounded bg-slate-900/60" />
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden">
            <div className="h-10 bg-slate-900/25 border-b border-slate-900 px-5 flex items-center">
              <div className="h-3 w-44 rounded bg-slate-900/60" />
            </div>
            <div className="divide-y divide-slate-900">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded bg-slate-900/80" />
                    <div className="h-8 w-8 rounded-lg bg-slate-900/80" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-24 rounded bg-slate-900/80" />
                      <div className="h-2.5 w-20 rounded bg-slate-900/60" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="h-3 w-12 rounded bg-slate-900/80 ml-auto" />
                    <div className="h-2.5 w-16 rounded bg-slate-900/60 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Logger Skeleton */}
      <div className="space-y-2 pt-2">
        <div className="h-3.5 w-44 rounded bg-slate-900/60" />
        <div className="h-32 rounded-2xl border border-slate-900 bg-slate-950 p-4 space-y-2">
          <div className="h-3 w-2/3 rounded bg-slate-900/60" />
          <div className="h-3 w-1/2 rounded bg-slate-900/60" />
          <div className="h-3 w-3/4 rounded bg-slate-900/60" />
        </div>
      </div>
    </div>
  );
}

/**
 * Premium Events List Skeleton Loader matching the columns and tickets layout of EventsList.tsx
 */
export function EventsListSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 py-2 animate-pulse" id="events-skeleton">
      {/* Event Listings - Left Col */}
      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-slate-900/80" />
          <div className="h-3.5 w-80 rounded bg-slate-900/60" />
        </div>

        {/* Filters and Search Bar Skeleton */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 h-10 rounded-xl bg-slate-950 border border-slate-905" />
          <div className="h-10 w-64 rounded-xl bg-slate-950 border border-slate-905" />
        </div>

        {/* Events Cards Lists */}
        <div className="space-y-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="rounded-2xl border border-slate-900 bg-slate-900/10 p-5 flex flex-col md:flex-row gap-5">
              {/* Cover view */}
              <div className="w-full md:w-36 h-28 shrink-0 rounded-xl bg-slate-900/80" />

              {/* Text metadata details */}
              <div className="flex-1 space-y-3">
                <div className="space-y-1.5">
                  <div className="h-5 w-48 rounded bg-slate-900/80" />
                  <div className="flex gap-4">
                    <div className="h-3 w-20 rounded bg-slate-900/60" />
                    <div className="h-3 w-24 rounded bg-slate-900/60" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-slate-900/65" />
                  <div className="h-3 w-5/6 rounded bg-slate-900/65" />
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-900/60 pt-2">
                  <div className="h-3 w-28 rounded bg-slate-900/60" />
                  <div className="h-7 w-28 rounded-lg bg-slate-900/80" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Wallet Pass - Right Col */}
      <div className="lg:col-span-5 space-y-4">
        <div>
          <div className="h-3.5 w-32 rounded bg-slate-900/60 mb-1" />
          <div className="h-3 w-64 rounded bg-slate-900/60" />
        </div>

        <div className="rounded-3xl border border-slate-900 bg-slate-950 p-6 flex flex-col h-[400px] justify-between relative overflow-hidden">
          {/* Header dots */}
          <div className="flex justify-between items-center">
            <div className="h-6 w-24 rounded bg-slate-900/80" />
            <div className="h-5 w-16 rounded bg-emerald-500/10" />
          </div>

          {/* Ticket body details */}
          <div className="space-y-6 my-auto pt-6">
            <div className="h-14 w-full rounded-2xl bg-slate-900/20" />
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-slate-900/60" />
              <div className="h-6 w-3/4 rounded bg-slate-900/80" />
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-900 pt-4">
              <div className="space-y-1.5">
                <div className="h-3 w-12 rounded bg-slate-900/60" />
                <div className="h-4 w-20 rounded bg-slate-900/80" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-12 rounded bg-slate-900/60" />
                <div className="h-4 w-20 rounded bg-slate-900/80" />
              </div>
            </div>
          </div>

          {/* Core barcode style */}
          <div className="border-t border-dashed border-slate-900 pt-6 space-y-3">
            <div className="h-10 w-full rounded bg-slate-900/50 flex items-center justify-center" />
            <div className="h-3 w-40 rounded bg-slate-900/40 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
