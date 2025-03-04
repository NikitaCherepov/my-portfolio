import './global.css'
import PageTransition from './components/PageTransition'

export const metadata = {
  title: "Портфолио Никиты Черепова | Музыка и сайты",
  description: "Официальный сайт-портфолио Никиты Черепова. Написание музыки и создание веб-приложений на заказ.",
  keywords: ["Никита Черепов", "музыка", "сайты", "разработка", "Next.js", "React", "создание красивых сайтов"],
  openGraph: {
    title: "Портфолио Никиты Черепова",
    description: "Создание музыки и веб-приложений на заказ",
    url: "https://ncherepov.com",
    siteName: "Портфолио Никиты Черепова",
    images: [
      {
        url: "https://ncherepov.ru/preview.png",
        width: 64,
        height: 64,
        alt: "Описание изображения",
      },
    ],
    type: "website",
  }
};



export default function RootLayout({children} : {children: React.ReactNode}) {
  
  return (
    <PageTransition>{children}</PageTransition>
  )
}