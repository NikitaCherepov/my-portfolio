import MusicPage from "./musicpage";
import { getServerLocale } from '@/i18n/server';
import ru from '@/i18n/locales/ru/translation.json';
import en from '@/i18n/locales/en/translation.json';

export async function generateMetadata() {
    const lang = await getServerLocale();
    const meta = lang === 'en' ? en.metadata.music : ru.metadata.music;

    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        openGraph: {
            title: meta.ogTitle,
            description: meta.ogDescription,
        },
    };
}



export default function Music() {
    return <MusicPage/>
}
