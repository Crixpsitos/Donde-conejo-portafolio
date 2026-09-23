'use client'

import { ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getSiteCopy } from '@/i18n/site-copy'
import type { SiteSetting } from '@/payload-types'

type Props = {
  locale: Locale
  settings: SiteSetting
}

export function SiteHeader({ locale, settings }: Props) {
  const [open, setOpen] = useState(false)
  const copy = getSiteCopy(locale)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-secondary/25 bg-primary text-surface transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-space-md px-margin-mobile md:px-margin">
        <a
          className="flex items-center gap-space-sm focus-visible:outline-2 focus-visible:outline-secondary"
          href="#inicio"
        >
          <span className="font-headline-md text-2xl font-light uppercase tracking-[0.2em]">
            {settings.siteName}
          </span>
          <span className="hidden size-1.5 rounded-full bg-secondary sm:block" />
          <span className="hidden font-label-technical text-[9px] font-semibold uppercase tracking-[0.25em] text-outline-variant sm:block">
            Barista SCA
          </span>
        </a>

        <nav aria-label="Navegación principal" className="hidden items-center gap-space-lg md:flex">
          {copy.navigation.map((item) => (
            <Link
              className="border-b border-transparent py-1 font-label-interactive text-label-interactive uppercase tracking-[0.15em] text-surface/80 transition-colors hover:border-secondary hover:text-surface"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-space-md">
          <div
            aria-label="Idioma"
            className="hidden items-center gap-space-xs font-label-technical text-label-technical font-semibold uppercase tracking-widest sm:flex"
          >
            {(['es', 'fr', 'en'] as const).map((item) => (
              <Link
                className={item === locale ? 'text-surface' : 'text-surface/45 hover:text-surface'}
                href="/"
                key={item}
                locale={item}
              >
                {item}
              </Link>
            ))}
          </div>
          <Link
            className="hidden items-center gap-space-xs rounded border border-secondary/40 bg-secondary/15 px-space-md py-space-sm font-label-interactive text-label-interactive uppercase tracking-wider transition-all hover:bg-secondary hover:text-primary sm:flex"
            href={copy.primaryAction.href}
          >
            {copy.primaryAction.label}
            <ArrowRight aria-hidden size={15} />
          </Link>
          <button
            aria-expanded={open}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="grid size-10 place-items-center md:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X aria-hidden size={22} /> : <Menu aria-hidden size={22} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          aria-label="Navegación móvil"
          className="border-t border-secondary/20 bg-primary px-margin-mobile pb-space-lg pt-space-xs md:hidden"
        >
          {copy.navigation.map((item) => (
            <Link
              className="block border-b border-secondary/10 py-space-xs font-label-interactive text-label-interactive uppercase tracking-wider text-surface transition-colors hover:text-secondary-fixed-dim"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-space-md flex gap-space-md font-label-technical text-label-technical font-semibold uppercase">
            {(['es', 'fr', 'en'] as const).map((item) => (
              <Link
                className={item === locale ? 'text-secondary-fixed-dim' : 'text-surface/60'}
                href="/"
                key={item}
                locale={item}
              >
                {item}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
