import HomepagePage, {
  generateHomepageMetadata,
  type HomepagePageProps,
} from '@/components/homepage/HomepagePage'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-static'
export const revalidate = 3600

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const generateMetadata = generateHomepageMetadata

export default function HomePage({ params }: Pick<HomepagePageProps, 'params'>) {
  return <HomepagePage params={params} searchParams={Promise.resolve({})} />
}
