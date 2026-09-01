'use client'

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="w-full bg-navy-700 py-4 text-center text-sm font-medium text-white transition hover:bg-[#37475a]"
    >
      Retour en haut
    </button>
  )
}
