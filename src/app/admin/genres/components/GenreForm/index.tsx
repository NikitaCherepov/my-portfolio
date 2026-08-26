'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateGenre, useUpdateGenre } from '@/app/hooks/useGenreMutations';
import { useRouter } from 'next/navigation';
import { Genre } from '@/app/services/genresService';
import { useTranslation } from 'react-i18next';
import TranslateButton from '@/app/admin/components/TranslateButton';
import styles from './GenreForm.module.scss';

interface GenreFormProps {
    mode: 'create' | 'edit';
    initialData?: Genre;
    genreId?: string;
}

export default function GenreForm({ mode, initialData, genreId }: GenreFormProps) {
    const router = useRouter();
    const createGenreMutation = useCreateGenre();
    const updateGenreMutation = useUpdateGenre();
    const { t } = useTranslation();

    // Интерфейс для данных формы
    interface GenreFormData {
        name: string;
        description: string;
        nameEn: string;
        descriptionEn: string;
    }

    // Форма данные
    const [formData, setFormData] = useState<GenreFormData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        nameEn: initialData?.nameEn || '',
        descriptionEn: initialData?.descriptionEn || '',
    });

    // Ошибки валидации
    const [errors, setErrors] = useState<Partial<GenreFormData>>({});

    // Обработчик изменения полей
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Сбрасываем ошибку для этого поля при изменении
        if (errors[name as keyof GenreFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Валидация формы
    const validateForm = (): boolean => {
        const newErrors: Partial<GenreFormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = t('admin.genreForm.nameRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error(t('admin.genreForm.fixErrors'));
            return;
        }

        try {
            if (mode === 'create') {
                await createGenreMutation.mutateAsync({
                    name: formData.name.trim(),
                    description: formData.description.trim() || undefined,
                    nameEn: formData.nameEn.trim() || undefined,
                    descriptionEn: formData.descriptionEn.trim() || undefined,
                });
            } else {
                if (!genreId) {
                    toast.error(t('admin.genreForm.idMissing'));
                    return;
                }

                await updateGenreMutation.mutateAsync({
                    id: genreId,
                    data: {
                        name: formData.name.trim(),
                        description: formData.description.trim() || undefined,
                        nameEn: formData.nameEn.trim() || undefined,
                        descriptionEn: formData.descriptionEn.trim() || undefined,
                    }
                });
            }

            // Переходим на страницу со списком жанров
            router.push('/admin/genres');
        } catch (error: any) {
            console.error('Error saving genre:', error);
            toast.error(error.error || (mode === 'create' ? t('admin.genreForm.createError') : t('admin.genreForm.updateError')));
        }
    };

    // Обработчик отмены
    const handleCancel = () => {
        router.push('/admin/genres');
    };

    // Проверяем, идет ли сохранение
    const isSubmitting = createGenreMutation.isPending || updateGenreMutation.isPending;

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.form__content}>
                <div className={styles.form__left}>
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.genreForm.nameLabel')} <span className={styles.field__required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={t('admin.genreForm.namePlaceholder')}
                            className={`${styles.field__input} ${errors.name ? styles.field__input_error : ''}`}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <span className={styles.field__error}>{errors.name}</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.genreForm.nameEnLabel')}
                        </label>
                        <div style={{display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
                            <input
                                type="text"
                                name="nameEn"
                                value={formData.nameEn}
                                onChange={handleInputChange}
                                placeholder={t('admin.genreForm.nameEnPlaceholder')}
                                className={`${styles.field__input} ${errors.name ? styles.field__input_error : ''}`}
                                style={{flex: 1}}
                                disabled={isSubmitting}
                            />
                            <TranslateButton
                                source={formData.name}
                                disabled={isSubmitting}
                                onTranslated={(text) => setFormData(prev => ({ ...prev, nameEn: text }))}
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.genreForm.descriptionLabel')}
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder={t('admin.genreForm.descriptionPlaceholder')}
                            className={`${styles.field__input} ${styles.field__input_textarea}`}
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.genreForm.descriptionEnLabel')}
                        </label>
                        <textarea
                            name="descriptionEn"
                            value={formData.descriptionEn}
                            onChange={handleInputChange}
                            placeholder={t('admin.genreForm.descriptionEnPlaceholder')}
                            className={`${styles.field__input} ${styles.field__input_textarea}`}
                            rows={4}
                            disabled={isSubmitting}
                        />
                        <div style={{marginTop: '8px'}}>
                            <TranslateButton
                                source={formData.description}
                                disabled={isSubmitting}
                                onTranslated={(text) => setFormData(prev => ({ ...prev, descriptionEn: text }))}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.form__right}>
                    {/* Здесь можно добавить дополнительную информацию или превью */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.genreForm.preview')}
                        </label>
                        <div className={styles.preview}>
                            <h3>{formData.name || t('admin.genreForm.previewName')}</h3>
                            <p>{formData.description || t('admin.genreForm.previewDescription')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.form__actions}>
                <button
                    type="button"
                    onClick={handleCancel}
                    className={`${styles.form__button} ${styles.form__button_cancel}`}
                    disabled={isSubmitting}
                >
                    {t('common.cancel')}
                </button>
                <button
                    type="submit"
                    className={`${styles.form__button} ${styles.form__button_submit}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('common.saving') : t('common.save')}
                </button>
            </div>
        </form>
    );
}