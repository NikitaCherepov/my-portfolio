'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateGenre, useUpdateGenre } from '@/app/hooks/useGenreMutations';
import { useRouter } from 'next/navigation';
import { Genre } from '@/app/services/genresService';
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

    // Интерфейс для данных формы
    interface GenreFormData {
        name: string;
        description: string;
    }

    // Форма данные
    const [formData, setFormData] = useState<GenreFormData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
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
            newErrors.name = 'Название жанра обязательно';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        try {
            if (mode === 'create') {
                await createGenreMutation.mutateAsync({
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                });
            } else {
                if (!genreId) {
                    toast.error('ID жанра не указан');
                    return;
                }

                await updateGenreMutation.mutateAsync({
                    id: genreId,
                    data: {
                        name: formData.name.trim(),
                        description: formData.description.trim() || null,
                    }
                });
            }

            // Переходим на страницу со списком жанров
            router.push('/admin/genres');
        } catch (error: any) {
            console.error('Error saving genre:', error);
            toast.error(error.error || `Ошибка при ${mode === 'create' ? 'создании' : 'обновлении'} жанра`);
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
                            Название жанра <span className={styles.field__required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Введите название жанра"
                            className={`${styles.field__input} ${errors.name ? styles.field__input_error : ''}`}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <span className={styles.field__error}>{errors.name}</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            Описание
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Введите описание жанра (необязательно)"
                            className={`${styles.field__input} ${styles.field__input_textarea}`}
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className={styles.form__right}>
                    {/* Здесь можно добавить дополнительную информацию или превью */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            Предпросмотр
                        </label>
                        <div className={styles.preview}>
                            <h3>{formData.name || 'Название жанра'}</h3>
                            <p>{formData.description || 'Описание жанра'}</p>
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
                    Отмена
                </button>
                <button
                    type="submit"
                    className={`${styles.form__button} ${styles.form__button_submit}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Сохранение...' : mode === 'create' ? 'Создать жанр' : 'Сохранить изменения'}
                </button>
            </div>
        </form>
    );
}