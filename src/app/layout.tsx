import './global.css'
import PageTransition from './components/PageTransition'
import ReactQueryProvider from './providers/ReactQueryProvider'
import I18nProvider from './providers/I18nProvider'
import { getServerLocale } from '@/i18n/server'
import ru from '@/i18n/locales/ru/translation.json'
import en from '@/i18n/locales/en/translation.json'

export async function generateMetadata() {
  const lang = await getServerLocale();
  const meta = lang === 'en' ? en.metadata.root : ru.metadata.root;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: 'https://ncherepov.com',
      siteName: meta.ogSiteName,
      images: [
        {
          url: 'https://ncherepov.ru/favicon.ico',
          width: 64,
          height: 64,
          alt: meta.ogImageAlt,
        },
      ],
      type: 'website',
    },
  };
}



export default function RootLayout({children} : {children: React.ReactNode}) {

  return (
    <ReactQueryProvider>
      <I18nProvider>
        <PageTransition>{children}</PageTransition>
      </I18nProvider>
    </ReactQueryProvider>
  )
}
