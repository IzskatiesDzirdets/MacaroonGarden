export default function ContactSection() {
  return (
    <section id="contact" className="relative z-10 bg-espresso px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">Kontakti</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] text-ivory">
            Sazinies ar <em className="italic text-blush">mums</em>
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Contact Details Grid */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl shadow-md">
                📱
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-gold">WhatsApp un Tālrunis</h3>
                <a
                  href="https://wa.me/37129999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-ivory-dim transition-colors hover:text-blush font-semibold"
                >
                  +371 29999999 (Sazinies WhatsApp) ↗
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl shadow-md">
                📧
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-gold">E-pasts</h3>
                <a
                  href="mailto:info@macaroongarden.lv"
                  className="mt-1 block text-sm text-ivory-dim transition-colors hover:text-blush font-semibold"
                >
                  info@macaroongarden.lv
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl shadow-md">
                📍
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-gold">Atrašanās vieta un Salons</h3>
                <p className="mt-1 text-sm text-ivory-dim leading-relaxed">
                  Kalnciema iela 40, Rīga, LV-1046 <br />
                  <span className="text-xs text-ivory-dim/60">Piegāde visā Rīgas teritorijā tieši līdz durvīm vai saņemšana uz vietas salonā.</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl shadow-md">
                ⏰
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-gold">Darba laiks</h3>
                <p className="mt-1 text-sm text-ivory-dim leading-relaxed">
                  P–Sk 9:00–20:00 <br />
                  <span className="text-xs text-ivory-dim/60">Tiešsaistes pasūtījumus un dāvanu komplektu pieteikumus pieņemam 24/7.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Instagram Promo box */}
          <div className="rounded-3xl border border-white/10 bg-espresso-3 p-8 text-center shadow-2xl ring-1 ring-gold/15 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-purple-500/5" />
            <div className="relative z-10 space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#E1306C] to-[#833AB4] text-3xl shadow-lg text-white">
                📸
              </div>
              <h3 className="font-display text-xl font-bold text-ivory">Sekojiet dāvanu ateljē ceļojumam</h3>
              <p className="text-sm leading-relaxed text-ivory-dim">
                Skatiet mūsu jaunākos darbus, iedvesmu un gardos aizkulišu stāstus mūsu Instagram profilā. Svinēsim un radīsim saldus, ekskluzīvus un neizmirstamus mirkļus kopā!
              </p>
              <div className="flex flex-col gap-2.5 items-center">
                <a
                  href="https://www.instagram.com/macarongardenlv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E1306C] to-[#833AB4] px-6 py-3 font-mono text-xs uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105"
                >
                  @macarongardenlv ↗
                </a>
                <a
                  href="https://www.facebook.com/macarongardenlv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ivory-dim/70 hover:text-gold transition-colors font-mono uppercase tracking-wider"
                >
                  Mūsu Facebook lapa ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
