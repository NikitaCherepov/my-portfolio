export default function getEmoji(text: string) {
    const emojiMap: Record<string, string> = {
        'React': '🟣 React',
        'Next.js': '🚀 Next.js',
        'Framer-motion': '🎭 Framer-motion',
        'Zustand': '📦 Zustand',
        'Typescript': '🔷 Typescript',
        'SCSS': '🎨 SCSS',
        'dnd-kit': '🔀 dnd-kit',
        'Bubble': '🟦 Bubble'
    };
    return emojiMap[text] || text;
}