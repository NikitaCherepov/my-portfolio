export default function getEmoji(text: string) {
    const emojiMap: Record<string, string> = {
        'React': '🟣 React',
        'Next.js': '🚀 Next.js',
        'Framer-motion': '🎭 Framer-motion',
        'Zustand': '📦 Zustand',
        'Typescript': '🔷 Typescript',
        'SCSS': '🎨 SCSS',
    };
    return emojiMap[text] || text;
}