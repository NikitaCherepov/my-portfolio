'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import styles from './TranslateButton.module.scss';

interface TranslateButtonProps {
    source: string;
    onTranslated: (text: string) => void;
    from?: string;
    to?: string;
    disabled?: boolean;
}

export default function TranslateButton({ source, onTranslated, from = 'ru', to = 'en', disabled = false }: TranslateButtonProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        const text = source?.trim();
        if (!text) {
            toast.error(t('admin.translate.emptySource'));
            return;
        }

        setIsLoading(true);
        try {
            const token = Cookies.get('token');

            const response = await fetch('/api/admin/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ text, from, to }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok || !data?.translated) {
                throw new Error(data?.error || 'Translation failed');
            }

            onTranslated(data.translated);
        } catch (error: any) {
            console.error('Translation error:', error);
            toast.error(error?.message || t('admin.translate.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isLoading}
            className={styles.button}
        >
            {isLoading ? t('admin.translate.translating') : t('admin.translate.button')}
        </button>
    );
}
