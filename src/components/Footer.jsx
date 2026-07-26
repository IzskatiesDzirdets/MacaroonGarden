export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-espresso px-6 py-10 text-center">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3">
        <img src="/logo.webp" alt="Macaroon Garden" className="h-8 w-8 rounded-full object-cover" />
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivory-dim/60">
          Macaroon Garden · Rīga · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
