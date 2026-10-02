import type { Metadata } from 'next'

import HomepagePage from '@/components/homepage/HomepagePage'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
}

export default HomepagePage