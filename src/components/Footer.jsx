export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-espresso px-6 py-12 text-center">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
        <img src="/logo.webp" alt="Macaroon Garden - ekskluzīvu franču makarūnu salons Rīgā" className="h-8 w-8 rounded-full object-cover" />
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivory">
          Macaroon Garden · Rīga · © {new Date().getFullYear()}
        </p>
        <p className="text-xs text-ivory-dim max-w-md">
          Kalnciema iela 40, Rīga, LV-1046 · Tālr. <a href="tel:+37129999999" className="text-gold font-bold hover:underline">+371 29999999</a>
        </p>
        <div className="flex gap-4 text-xs font-mono uppercase tracking-wider mt-1 text-ivory-dim">
          <a href="https://www.facebook.com/macarongardenlv" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Facebook</a>
          <span>·</span>
          <a href="https://www.instagram.com/macarongardenlv" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  )
}
