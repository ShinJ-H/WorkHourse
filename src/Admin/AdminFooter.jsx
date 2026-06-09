export default function AdminFooter() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-violet-700/30 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-16 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-2xl" />
      <svg className="hidden" aria-hidden="true" focusable="false">
        <symbol id="admin-icon-arrow-right" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M13.5 5.5a1 1 0 0 1 1.4 0l6.1 6.1a1 1 0 0 1 0 1.4l-6.1 6.1a1 1 0 1 1-1.4-1.4L18.2 13H3.8a1 1 0 1 1 0-2h14.4l-4.7-4.7a1 1 0 0 1 0-1.4Z"
          />
        </symbol>
        <symbol id="admin-icon-chevron-up-right" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M7.5 20a1 1 0 0 1-1-1V6.5A1 1 0 0 1 7.5 5H20a1 1 0 1 1 0 2h-11v12A1 1 0 0 1 7.5 20Zm11-11a1 1 0 0 1 0 1.4l-8.6 8.6a1 1 0 0 1-1.4-1.4l8.6-8.6a1 1 0 0 1 1.4 0Z"
          />
        </symbol>
        <symbol id="admin-icon-dot" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill="currentColor" />
        </symbol>
      </svg>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr,1fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full bg-violet-500/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-violet-200 ring-1 ring-white/10">
              <svg className="h-2.5 w-2.5 shrink-0 text-violet-300" aria-hidden="true">
                <use href="#admin-icon-dot" />
              </svg>
              Admin dashboard
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Work<span className="text-fuchsia-400">House</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">
                A premium admin footer design with soft glow accents, clean sections, and stylish icon details built for today&apos;s modern dashboards.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
                <p className="mt-2 text-lg font-semibold text-white">Teams ready</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Operations</p>
                <p className="mt-2 text-lg font-semibold text-white">Secure sync</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-semibold text-white">Short Link</p>
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-violet-200">
                pure no links
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                "Tasks",
                "Projects",
                "Chats",
                "Profile",
              ].map((item) => (
                <div
                  key={item}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-slate-900"
                >
                  <span>{item}</span>
                  <svg className="h-4 w-4 text-violet-300 transition duration-200 group-hover:translate-x-1" aria-hidden="true">
                    <use href="#admin-icon-arrow-right" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/10 text-violet-300">
              ©
            </span>
            WorkHouse, all rights reserved.
          </div>
          <span className="text-xs text-slate-500">{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
