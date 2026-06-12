import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-violet-700/30 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-28 w-28 rounded-full bg-fuchsia-600/20 blur-2xl" />

      <svg className="hidden" aria-hidden="true" focusable="false">
        <symbol id="icon-arrow-right" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M13.5 5.5a1 1 0 0 1 1.4 0l6.1 6.1a1 1 0 0 1 0 1.4l-6.1 6.1a1 1 0 1 1-1.4-1.4L18.2 13H3.8a1 1 0 1 1 0-2h14.4l-4.7-4.7a1 1 0 0 1 0-1.4Z"
          />
        </symbol>
        <symbol id="icon-chevron-up-right" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M7.5 20a1 1 0 0 1-1-1V6.5A1 1 0 0 1 7.5 5H20a1 1 0 1 1 0 2h-11v12A1 1 0 0 1 7.5 20Zm11-11a1 1 0 0 1 0 1.4l-8.6 8.6a1 1 0 0 1-1.4-1.4l8.6-8.6a1 1 0 0 1 1.4 0Z"
          />
        </symbol>
        <symbol id="icon-mail" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm2 .5v.01L12 12.5l6-6V6.5l-6 5.25L6 6.5ZM18 8.5v-1l-6 5-6-5v1l6 5 6-5Z"
          />
        </symbol>
        <symbol id="icon-dot" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill="currentColor" />
        </symbol>
      </svg>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr,1fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-violet-200 shadow-sm shadow-violet-500/10 ring-1 ring-white/10">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-violet-400" />
              WorkHouse: modern team productivity.
            </div>
            <div>
              <Link
                to="/"
                className="inline-flex items-baseline gap-2 text-3xl font-extrabold tracking-tight text-white"
              >
                <span className="text-violet-300">Work</span>
                <span className="text-fuchsia-400">House</span>
              </Link>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Build better workflows, assign teams, and keep every project on track with a beautiful dashboard experience designed for today.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Live support", value: "24/7" },
                { label: "Secure sync", value: "Cloud" },
                { label: "Fast setup", value: "Minutes" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 ring-1 ring-white/10"
                >
                  <svg className="h-2.5 w-2.5 shrink-0 text-violet-300" aria-hidden="true">
                    <use href="#icon-dot" />
                  </svg>
                  <span>{item.value}</span>
                  <span className="text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">Quick links</h3>
              <div className="mt-5 space-y-3">
                {[
                  { href: "/aboutus", label: "About us" },
                  { href: "/contactus", label: "Contact us" },
                  { href: "/myprojects", label: "Projects" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group inline-flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-slate-900"
                  >
                    <span>{item.label}</span>
                    <svg className="h-4 w-4 text-violet-300 transition duration-200 group-hover:translate-x-1" aria-hidden="true">
                      <use href="#icon-arrow-right" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-slate-400">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/10 text-violet-300">
              ©
            </span>
            {new Date().getFullYear()} WorkHouse — Designed for modern teams.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-violet-300" />
              Live chat
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

