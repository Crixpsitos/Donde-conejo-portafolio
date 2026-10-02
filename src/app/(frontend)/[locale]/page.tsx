import {
  ArrowRight,
  Bean,
  Check,
  Droplets,
  FlaskConical,
  MapPin,
  Send,
  Thermometer,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache, Fragment } from 'react'

import { LivePreviewBridge } from '@/components/LivePreviewBridge'
import { SensoryRadar } from '@/components/SensoryRadar'
import { SiteHeader } from '@/components/SiteHeader'
import {
  fallbackHomepage,
  fallbackImages,
  fallbackLocations,
  fallbackSiteSettings,
} from '@/data/fallback-content'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/i18n/routing'
import { getSiteCopy } from '@/i18n/site-copy'
import config from '@/payload.config'
import type { Homepage, Location, Media, SiteSetting } from '@/payload-types'
import { verifyPreviewToken } from '@/utilities/preview-token'

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ preview?: string | string[] }>
}

type DeepRequired<T> = T extends readonly (infer Item)[]
  ? DeepRequired<Item>[]
  : T extends object
    ? { [Key in keyof T]-?: DeepRequired<NonNullable<T[Key]>> }
    : NonNullable<T>

type CompleteHomepage = DeepRequired<Homepage>

const iconMap = {
  bean: Bean,
  droplets: Droplets,
  flask: FlaskConical,
  thermometer: Thermometer,
}

const getMediaUrl = (media: Media | null | string | undefined, fallback: string) =>
  typeof media === 'object' && media?.url ? media.url : fallback

const getLocale = (value: string): Locale => {
  if (!routing.locales.includes(value as Locale)) notFound()
  return value as Locale
}

const isTransientDatabaseError = (error: unknown) =>
  error instanceof Error &&
  (error.name === 'MongoNetworkError' ||
    (error.message.includes('connection') && error.message.includes('closed')) ||
    error.message.includes('ECONNRESET'))

const withDatabaseRetry = async <Value,>(operation: () => Promise<Value>): Promise<Value> => {
  const retryDelays = [200, 600]

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      const delay = retryDelays[attempt]
      if (delay === undefined || !isTransientDatabaseError(error)) throw error
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

const mergeWithFallback = <Value,>(fallback: Value, value: unknown): Value => {
  if (value === null || value === undefined) return fallback

  if (Array.isArray(fallback)) {
    if (!Array.isArray(value) || value.length === 0) return fallback
    return value.map((item, index) => mergeWithFallback(fallback[index] ?? {}, item)) as Value
  }

  if (
    typeof fallback === 'object' &&
    fallback &&
    typeof value === 'object' &&
    !Array.isArray(value)
  ) {
    const fallbackRecord = fallback as Record<string, unknown>
    const valueRecord = value as Record<string, unknown>
    const keys = new Set([...Object.keys(fallbackRecord), ...Object.keys(valueRecord)])

    return Object.fromEntries(
      Array.from(keys, (key) => [key, mergeWithFallback(fallbackRecord[key], valueRecord[key])]),
    ) as Value
  }

  return value as Value
}

const getPageContent = cache(async (locale: Locale, draft = false) => {
  const payload = await getPayload({ config })
  try {
    const [homepage, settings] = await withDatabaseRetry(() =>
      Promise.all([
        payload.findGlobal({
          slug: 'homepage',
          locale,
          fallbackLocale: 'es',
          depth: 2,
          draft,
        }),
        payload.findGlobal({
          slug: 'site-settings',
          locale,
          fallbackLocale: 'es',
          depth: 1,
        }),
      ]),
    )

    const hasSettings = Boolean(settings?.siteName && settings?.defaultMetaTitle)

    return {
      homepage: mergeWithFallback(fallbackHomepage, homepage) as CompleteHomepage,
      settings: (hasSettings ? settings : fallbackSiteSettings) as SiteSetting,
    }
  } catch (error) {
    if (draft || !isTransientDatabaseError(error)) throw error

    payload.logger.warn({
      err: error,
      msg: `Firestore no respondió después de los reintentos; se usará el contenido de respaldo para ${locale}`,
    })

    return {
      homepage: fallbackHomepage as CompleteHomepage,
      settings: fallbackSiteSettings as SiteSetting,
    }
  }
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getLocale(localeParam)
  const { homepage, settings } = await getPageContent(locale)
  const title = homepage.seo?.metaTitle || settings.defaultMetaTitle
  const description = homepage.seo?.metaDescription || settings.defaultMetaDescription
  const image = getMediaUrl(homepage.seo?.shareImage, getMediaUrl(settings.defaultShareImage, ''))
  const allowIndexing =
    homepage.seo?.indexing === 'index' ||
    (homepage.seo?.indexing !== 'noindex' && settings.allowIndexing !== false)

  return {
    title,
    description,
    alternates: {
      canonical: `${settings.siteUrl}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((item) => [item, `${settings.siteUrl}/${item}`]),
      ),
    },
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
      locale,
      type: 'website',
    },
    robots: allowIndexing ? undefined : { follow: false, index: false },
  }
}

function SectionHeading({
  description,
  eyebrow,
  previewPath,
  title,
}: {
  description?: null | string
  eyebrow: string
  previewPath: string
  title: string
}) {
  return (
    <div className="grid gap-gutter border-b border-outline-variant pb-space-sm md:grid-cols-[1fr_0.7fr] md:items-end">
      <div>
        <p className="mb-space-xs font-label-technical text-label-technical font-semibold uppercase tracking-widest text-secondary">
          {eyebrow}
        </p>
        <h2
          className="max-w-3xl font-headline-xl text-headline-xl font-normal text-primary"
          data-preview-field={`${previewPath}.title`}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p
          className="max-w-xl font-body-md text-body-md text-on-surface-variant"
          data-preview-field={`${previewPath}.description`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default async function HomePage({ params, searchParams }: PageProps) {
  const { locale: localeParam } = await params
  const locale = getLocale(localeParam)
  const { preview } = await searchParams
  const isPreview = verifyPreviewToken(typeof preview === 'string' ? preview : undefined, locale)
  const { homepage, settings } = await getPageContent(locale, isPreview)
  const copy = getSiteCopy(locale)
  const locations = (homepage.entrepreneurship.locations || []).filter(
    (location) => typeof location === 'object',
  ) as Location[]
  const visibleLocations = locations.length ? locations : fallbackLocations
  const heroImage = getMediaUrl(homepage.hero.portrait, fallbackImages.hero)
  const heroImageAlt =
    typeof homepage.hero.portrait === 'object' && homepage.hero.portrait?.alt
      ? homepage.hero.portrait.alt
      : homepage.hero.name
  const filterImage = getMediaUrl(homepage.craft.pillars?.[1]?.image, fallbackImages.filter)

  return (
    <>
      {isPreview ? <LivePreviewBridge /> : null}
      <SiteHeader locale={locale} settings={settings} />

      <main className="overflow-hidden bg-background pt-20 text-on-surface">
        <section className="editorial-hero" id="inicio">
          <div className="editorial-hero__layout">
            <div className="editorial-hero__portrait" data-preview-field="hero.portrait">
              <Image
                alt={heroImageAlt}
                className="editorial-hero__image"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 56vw"
                src={heroImage}
              />
              <div aria-hidden className="editorial-hero__image-grade" />
            </div>

            <div className="editorial-hero__content">
              <p className="editorial-hero__eyebrow">{copy.sections.hero}</p>
              <p className="editorial-hero__person" data-preview-field="hero.title">
                {homepage.hero.title}
              </p>
              <h1 className="editorial-hero__title" data-preview-field="hero.name">
                {homepage.hero.name}
              </h1>
              <div className="editorial-hero__roles">
                {homepage.hero.roles?.map((role, index) => (
                  <span
                    className="editorial-hero__role"
                    data-preview-field={`hero.roles.${index}.label`}
                    key={role.id || role.label}
                  >
                    {index ? <span aria-hidden className="editorial-hero__role-divider" /> : null}
                    {role.label}
                  </span>
                ))}
              </div>
              <blockquote className="editorial-hero__quote" data-preview-field="hero.quote">
                “{homepage.hero.quote}”
              </blockquote>
              <p className="editorial-hero__description" data-preview-field="hero.description">
                {homepage.hero.description}
              </p>
              <div className="editorial-hero__actions">
                {copy.heroActions.map((action, index) => (
                  <Link
                    className={`editorial-hero__action ${
                      index === 0
                        ? 'editorial-hero__action--primary'
                        : 'editorial-hero__action--secondary'
                    }`}
                    href={action.href}
                    key={action.href}
                  >
                    {action.label}
                    <ArrowRight aria-hidden size={16} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="editorial-hero__metrics">
              {homepage.hero.metrics?.map((metric, index) => (
                <div
                  className={`editorial-hero__metric ${metric.accent ? 'editorial-hero__metric--accent' : ''}`}
                  data-preview-field={`hero.metrics.${index}.accent`}
                  key={metric.id || metric.label}
                >
                  <strong
                    className="editorial-hero__metric-value"
                    data-preview-field={`hero.metrics.${index}.value`}
                  >
                    {metric.value}
                  </strong>
                  <span
                    className="editorial-hero__metric-label"
                    data-preview-field={`hero.metrics.${index}.label`}
                  >
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="manifesto-editorial" id="historia">
          <div className="manifesto-editorial__layout">
            <p className="manifesto-editorial__marker">{copy.sections.manifesto}</p>

            <blockquote className="manifesto-editorial__quote" data-preview-field="manifesto.quote">
              “{homepage.manifesto.quote}”
            </blockquote>

            <div className="manifesto-editorial__composition">
              {Array.from({
                length: Math.max(
                  homepage.manifesto.principles?.length || 0,
                  homepage.manifesto.facts?.length || 0,
                ),
              }).map((_, index) => {
                const principle = homepage.manifesto.principles?.[index]
                const fact = homepage.manifesto.facts?.[index]

                return (
                  <Fragment key={principle?.id || fact?.id || index}>
                    {principle ? (
                      <p
                        className="manifesto-editorial__principle"
                        data-preview-field={`manifesto.principles.${index}.text`}
                      >
                        {principle.text}
                      </p>
                    ) : null}
                    {fact ? (
                      <article className="manifesto-editorial__fact">
                        <span
                          className="manifesto-editorial__fact-label"
                          data-preview-field={`manifesto.facts.${index}.label`}
                        >
                          {fact.label}
                        </span>
                        <strong
                          className="manifesto-editorial__fact-value"
                          data-preview-field={`manifesto.facts.${index}.value`}
                        >
                          {fact.value}
                        </strong>
                        <span
                          className="manifesto-editorial__fact-detail"
                          data-preview-field={`manifesto.facts.${index}.detail`}
                        >
                          {fact.detail}
                        </span>
                      </article>
                    ) : null}
                  </Fragment>
                )
              })}
            </div>
          </div>
        </section>

        <section
          className="bg-surface-container-lowest px-margin-mobile py-space-xl md:px-margin"
          id="experiencia"
        >
          <div className="mx-auto max-w-[1440px]">
            <SectionHeading {...homepage.craft} eyebrow={copy.sections.craft} previewPath="craft" />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {homepage.craft.pillars?.map((pillar, index) => (
                <article
                  className="flex min-h-[32.5rem] flex-col justify-between rounded bg-surface-container p-space-lg shadow-sm"
                  key={pillar.id || pillar.title}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className="font-label-technical text-label-technical font-semibold uppercase tracking-widest text-secondary"
                        data-preview-field={`craft.pillars.${index}.eyebrow`}
                      >
                        {pillar.eyebrow}
                      </span>
                      {pillar.badge ? (
                        <span
                          className="rounded bg-surface px-space-sm py-1 font-label-technical text-label-technical font-semibold uppercase"
                          data-preview-field={`craft.pillars.${index}.badge`}
                        >
                          {pillar.badge}
                        </span>
                      ) : null}
                    </div>
                    <h3
                      className="mt-space-md font-headline-lg text-headline-lg font-light text-primary"
                      data-preview-field={`craft.pillars.${index}.title`}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      className="mt-space-md font-body-lg text-body-lg text-on-surface-variant"
                      data-preview-field={`craft.pillars.${index}.description`}
                    >
                      {pillar.description}
                    </p>
                  </div>
                  {index === 1 ? (
                    <div
                      className="relative my-space-lg aspect-16/7 overflow-hidden rounded bg-primary"
                      data-preview-field={`craft.pillars.${index}.image`}
                    >
                      <Image
                        alt="Preparación manual de café filtrado"
                        className="object-cover"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        src={filterImage}
                      />
                    </div>
                  ) : null}
                  <div className="mt-7 grid grid-cols-3 gap-2">
                    {pillar.parameters?.map((parameter, parameterIndex) => (
                      <div
                        className="rounded bg-surface p-space-sm text-center"
                        key={parameter.id || parameter.label}
                      >
                        <span
                          className="block font-label-technical text-label-technical font-semibold uppercase text-outline"
                          data-preview-field={`craft.pillars.${index}.parameters.${parameterIndex}.label`}
                        >
                          {parameter.label}
                        </span>
                        <strong
                          className="mt-space-xs block font-label-numeric text-headline-sm text-primary"
                          data-preview-field={`craft.pillars.${index}.parameters.${parameterIndex}.value`}
                        >
                          {parameter.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low px-margin-mobile py-space-xl md:px-margin">
          <div className="mx-auto grid max-w-[1440px] gap-gutter lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="font-label-technical text-label-technical font-semibold uppercase tracking-widest text-secondary">
                {copy.sections.research}
              </p>
              <h2
                className="mt-space-md text-balance font-headline-xl text-headline-xl italic text-primary"
                data-preview-field="research.title"
              >
                “{homepage.research.title}”
              </h2>
              <p
                className="mt-space-md font-body-lg text-body-lg text-on-surface-variant"
                data-preview-field="research.description"
              >
                {homepage.research.description}
              </p>
              <div className="mt-space-md space-y-space-sm">
                {homepage.research.topics?.map((topic, index) => {
                  const Icon = iconMap[topic.icon]
                  return (
                    <div className="flex gap-space-sm" key={topic.id || topic.title}>
                      <Icon
                        aria-hidden
                        className="mt-1 shrink-0 text-secondary"
                        data-preview-field={`research.topics.${index}.icon`}
                        size={22}
                      />
                      <div>
                        <h3
                          className="font-headline-sm text-headline-sm text-primary"
                          data-preview-field={`research.topics.${index}.title`}
                        >
                          {topic.title}
                        </h3>
                        <p
                          className="mt-space-xs font-body-md text-body-md text-on-surface-variant"
                          data-preview-field={`research.topics.${index}.description`}
                        >
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="rounded bg-surface p-space-lg shadow-md lg:col-span-7">
              <div className="flex flex-wrap items-start justify-between gap-space-md pb-space-sm">
                <div>
                  <span className="font-label-technical text-label-technical font-semibold uppercase tracking-widest text-secondary">
                    {copy.sections.sensoryProfile}
                  </span>
                  <h3
                    className="mt-space-xs font-headline-md text-headline-md text-primary"
                    data-preview-field="research.sensoryProfile.title"
                  >
                    {homepage.research.sensoryProfile.title}
                  </h3>
                </div>
                <strong
                  className="rounded bg-surface-container px-space-sm py-1 font-label-technical text-label-technical uppercase text-primary"
                  data-preview-field="research.sensoryProfile.score"
                >
                  SCA {homepage.research.sensoryProfile.score} pts
                </strong>
              </div>
              <div className="mt-space-sm grid items-center gap-space-md md:grid-cols-2">
                <div>
                  <SensoryRadar
                    attributes={homepage.research.sensoryProfile.attributes || []}
                    previewPath="research.sensoryProfile.attributes"
                  />
                  <p
                    className="mt-space-sm text-center font-label-technical text-label-technical font-semibold uppercase tracking-widest text-outline"
                    data-preview-field="research.sensoryProfile.flavorNotes"
                  >
                    {homepage.research.sensoryProfile.flavorNotes}
                  </p>
                </div>
                <dl className="space-y-space-sm">
                  {homepage.research.sensoryProfile.measurements?.map((measurement, index) => (
                    <div
                      className="flex items-center justify-between rounded bg-surface-container-lowest p-space-sm"
                      key={measurement.id || measurement.label}
                    >
                      <dt
                        className="font-body-md text-body-md text-on-surface"
                        data-preview-field={`research.sensoryProfile.measurements.${index}.label`}
                      >
                        {measurement.label}
                      </dt>
                      <dd
                        className="font-label-numeric text-label-numeric font-bold text-secondary"
                        data-preview-field={`research.sensoryProfile.measurements.${index}.value`}
                      >
                        {measurement.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-margin-mobile py-space-xl md:px-margin" id="donde-conejo">
          <div className="mx-auto max-w-[1440px]">
            <SectionHeading
              {...homepage.entrepreneurship}
              eyebrow={copy.sections.entrepreneurship}
              previewPath="entrepreneurship"
            />
            {homepage.entrepreneurship.quote ? (
              <blockquote
                className="mt-space-md font-display-hero text-headline-md italic font-light text-secondary"
                data-preview-field="entrepreneurship.quote"
              >
                “{homepage.entrepreneurship.quote}”
              </blockquote>
            ) : null}
            <div
              className="mt-space-xl grid gap-gutter md:grid-cols-2"
              data-preview-field="entrepreneurship.locations"
              id="sedes"
            >
              {visibleLocations.map((location) => (
                <article
                  className="rounded bg-surface-container p-space-lg shadow-sm transition-colors hover:bg-surface-container-high"
                  key={location.id}
                >
                  <div className="flex items-center justify-between gap-space-md">
                    <span className="font-label-technical text-label-technical uppercase tracking-widest text-outline">
                      {location.code}
                    </span>
                    <span className="rounded bg-tertiary-fixed px-space-sm py-0.5 font-label-technical text-label-technical font-bold uppercase text-on-tertiary-fixed">
                      {location.status === 'open' ? 'Abierta' : 'Próximamente'}
                    </span>
                  </div>
                  <h3 className="mt-space-md font-headline-lg text-headline-lg text-primary">
                    {location.name}
                  </h3>
                  <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">
                    {location.description}
                  </p>
                  <div className="mt-space-md flex flex-wrap justify-between gap-space-sm pt-space-md font-label-technical text-label-technical font-semibold uppercase tracking-wider text-on-surface-variant">
                    <span className="flex items-center gap-space-xs">
                      <MapPin aria-hidden className="text-secondary" size={15} />
                      {location.city}
                    </span>
                    <span>{location.schedule}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="bg-surface-container-high px-margin-mobile py-space-xl md:px-margin"
          id="comunidad"
        >
          <div className="mx-auto grid max-w-[1440px] gap-gutter lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <p className="font-label-technical text-label-technical font-semibold uppercase tracking-widest text-secondary">
                {copy.sections.community}
              </p>
              <h2
                className="mt-space-md font-headline-xl text-headline-xl text-primary"
                data-preview-field="community.title"
              >
                {homepage.community.title}
              </h2>
              <p
                className="mt-space-md font-body-xl text-body-xl text-on-surface-variant"
                data-preview-field="community.description"
              >
                {homepage.community.description}
              </p>
              <div className="mt-space-md rounded bg-surface p-space-md shadow-sm">
                <h3
                  className="font-headline-sm text-headline-sm text-primary"
                  data-preview-field="community.initiative.title"
                >
                  {homepage.community.initiative.title}
                </h3>
                <p
                  className="mt-space-xs font-body-md text-body-md text-on-surface-variant"
                  data-preview-field="community.initiative.description"
                >
                  {homepage.community.initiative.description}
                </p>
              </div>
            </div>
            <div className="grid gap-space-md sm:grid-cols-2 lg:col-span-6">
              {homepage.community.metrics?.map((metric, index) => (
                <article
                  className="rounded bg-surface p-space-lg shadow-sm"
                  key={metric.id || metric.label}
                >
                  <strong
                    className="block font-display-hero text-display-hero font-light text-secondary"
                    data-preview-field={`community.metrics.${index}.value`}
                  >
                    {metric.value}
                  </strong>
                  <h3
                    className="mt-space-xs font-headline-sm text-headline-sm text-primary"
                    data-preview-field={`community.metrics.${index}.label`}
                  >
                    {metric.label}
                  </h3>
                  <p
                    className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant"
                    data-preview-field={`community.metrics.${index}.description`}
                  >
                    {metric.description}
                  </p>
                </article>
              ))}
              {homepage.community.quote ? (
                <blockquote
                  className="rounded bg-primary p-space-lg font-headline-md text-headline-md italic text-surface-container-low shadow-md sm:col-span-2"
                  data-preview-field="community.quote"
                >
                  “{homepage.community.quote}”
                </blockquote>
              ) : null}
            </div>
          </div>
        </section>

        <section
          className="bg-surface-container-lowest px-margin-mobile py-space-xl md:px-margin"
          id="francia"
        >
          <div className="mx-auto grid max-w-[1440px] gap-gutter rounded bg-surface-container p-space-lg shadow-md md:p-space-xl lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-label-technical text-label-technical font-semibold uppercase tracking-widest text-secondary">
                {copy.sections.journey}
              </p>
              <h2
                className="mt-space-md font-headline-xl text-headline-xl text-primary"
                data-preview-field="journey.title"
              >
                {homepage.journey.title}
              </h2>
              <p
                className="mt-space-md font-body-lg text-body-lg text-on-surface-variant"
                data-preview-field="journey.description"
              >
                {homepage.journey.description}
              </p>
              <Link
                className="mt-space-md inline-flex items-center gap-space-xs font-label-interactive text-label-interactive font-semibold uppercase tracking-wider text-primary transition-colors hover:text-secondary"
                href={copy.journeyAction.href}
              >
                {copy.journeyAction.label}
                <ArrowRight aria-hidden size={16} />
              </Link>
            </div>
            <ol className="space-y-0 lg:col-span-5">
              {homepage.journey.chapters?.map((chapter, index) => (
                <li
                  className="relative border-l border-secondary pb-space-lg pl-space-lg last:pb-0"
                  key={chapter.id || chapter.title}
                >
                  <span className="absolute -left-2 top-0 grid size-4 place-items-center rounded-full bg-secondary text-[8px] font-bold text-surface">
                    {index + 1}
                  </span>
                  <span
                    className="font-label-technical text-label-technical font-semibold uppercase tracking-widest text-secondary"
                    data-preview-field={`journey.chapters.${index}.period`}
                  >
                    {chapter.period}
                  </span>
                  <h3
                    className="mt-space-xs font-headline-sm text-headline-sm text-primary"
                    data-preview-field={`journey.chapters.${index}.title`}
                  >
                    {chapter.title}
                  </h3>
                  <p
                    className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant"
                    data-preview-field={`journey.chapters.${index}.description`}
                  >
                    {chapter.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-surface px-margin-mobile py-space-xl md:px-margin" id="contacto">
          <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-xl bg-primary p-space-lg text-surface shadow-xl md:p-space-xl">
            <div className="relative z-10 max-w-4xl">
              <p className="font-label-technical text-label-technical font-semibold uppercase tracking-widest text-secondary-fixed-dim">
                {copy.sections.contact}
              </p>
              <h2
                className="mt-space-md font-display-hero text-headline-xl font-light md:text-display-hero"
                data-preview-field="contact.title"
              >
                {homepage.contact.title}
              </h2>
              <p
                className="mt-space-md max-w-3xl font-body-xl text-body-xl text-surface-container-high"
                data-preview-field="contact.description"
              >
                {homepage.contact.description}
              </p>
              <div className="mt-space-md grid gap-space-sm font-label-technical text-label-technical uppercase tracking-wider text-outline-variant sm:grid-cols-3">
                {homepage.contact.services?.map((service, index) => (
                  <span
                    className="flex items-center gap-space-xs"
                    data-preview-field={`contact.services.${index}.label`}
                    key={service.id || service.label}
                  >
                    <Check aria-hidden className="text-secondary-fixed-dim" size={16} />
                    {service.label}
                  </span>
                ))}
              </div>
              <div className="mt-space-md flex flex-wrap items-center gap-space-md">
                <Link
                  className="inline-flex items-center gap-space-sm rounded bg-secondary px-space-lg py-space-sm font-label-interactive text-label-interactive uppercase tracking-wider text-surface transition hover:bg-secondary-container hover:text-on-secondary-container"
                  href={copy.primaryAction.href}
                >
                  {copy.primaryAction.label}
                  <Send aria-hidden size={15} />
                </Link>
                {settings.contact?.email ? (
                  <a
                    className="font-body-md text-body-md text-surface hover:text-secondary-fixed-dim"
                    href={`mailto:${settings.contact.email}`}
                  >
                    {settings.contact.email}
                  </a>
                ) : null}
              </div>
            </div>
            <span
              aria-hidden
              className="absolute -bottom-10 right-0 hidden font-display-hero text-[12rem] uppercase leading-none text-surface/5 lg:block"
            >
              Conejo
            </span>
          </div>
        </section>
      </main>

      <footer className="border-t border-secondary/25 bg-primary px-margin-mobile pb-space-lg pt-space-xl text-surface md:px-margin">
        <div className="mx-auto grid max-w-[1440px] gap-gutter md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-label-technical text-label-technical uppercase tracking-widest text-on-primary-container">
              Registro editorial y manifiesto
            </p>
            <h2 className="mt-space-sm font-headline-md text-headline-md">
              {settings.siteName} · Juan David Conejo Acuña
            </h2>
            <p className="mt-space-sm font-display-hero text-headline-sm italic text-secondary-fixed-dim">
              “{settings.footer?.quote}”
            </p>
            <p className="mt-space-md max-w-lg font-body-md text-body-md text-outline-variant">
              {settings.footer?.descriptor}
            </p>
          </div>
          <div className="md:col-span-4">
            <h3 className="font-label-technical text-label-technical uppercase tracking-widest text-secondary-fixed-dim">
              Índice
            </h3>
            <nav className="mt-space-md grid grid-cols-2 gap-space-sm font-label-interactive text-label-interactive uppercase tracking-wider text-outline-variant">
              {copy.footerNavigation.map((item) => (
                <Link
                  className="transition-colors hover:text-surface"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-label-technical text-label-technical uppercase tracking-widest text-secondary-fixed-dim">
              Canales
            </h3>
            <div className="mt-space-md space-y-space-xs font-body-md text-body-md text-outline-variant">
              {settings.socialLinks?.map((social) => (
                <a
                  className="block transition-colors hover:text-surface"
                  href={social.url}
                  key={social.id || social.platform}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="mr-space-xs font-label-technical text-label-technical uppercase text-on-primary-container">
                    {social.platform}
                  </span>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-secondary/20 pt-space-md font-body-sm text-body-sm text-on-primary-container md:col-span-12 md:flex md:justify-between">
            <p>{settings.contact?.location}</p>
            <p className="mt-space-sm md:mt-0">{settings.footer?.legal}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
