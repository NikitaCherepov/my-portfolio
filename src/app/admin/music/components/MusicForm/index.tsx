'use client';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useCreateMusic, useUpdateMusic, useDeleteMusic } from '@/app/hooks/useMusicMutations';
import { useRouter } from 'next/navigation';
import { useGenres } from '@/app/hooks/useGenres';
import { CreateMusicData, UpdateMusicData, Music } from '@/app/hooks/useMusicMutations';
import AudioTrimmer from '@/app/components/AudioTrimmer';
import styles from './MusicForm.module.scss';

const formatDateInput = (value?: string) => {
    if (!value) return new Date().toISOString().split('T')[0];
    return new Date(value).toISOString().split('T')[0];
};

interface MusicFormProps {
    mode: 'create' | 'edit';
    initialData?: Music;
    musicId?: string;
}

export default function MusicForm({ mode, initialData, musicId }: MusicFormProps) {
    const router = useRouter();
    const createMusicMutation = useCreateMusic();
    const updateMusicMutation = useUpdateMusic();
    const deleteMusicMutation = useDeleteMusic();
    const { data: genres } = useGenres();

    // Интерфейс для данных формы
    interface MusicFormData {
        name: string;
        genreId: string;
        youtube: string;
        spotify: string;
        vkmusic: string;
        ymusic: string;
        preview: {
            current?: string;
            file?: File | Blob;
            url?: string;
            isChanged: boolean;
            mode: 'file' | 'url';
        };
        date: string;
        mainImage: {
            current?: string;
            file?: File;
            isChanged: boolean;
        };
    }

    // Форма данные
    const [formData, setFormData] = useState<MusicFormData>({
        name: initialData?.name || '',
        genreId: initialData?.genreId || '',
        youtube: initialData?.youtube || '',
        spotify: initialData?.spotify || '',
        vkmusic: initialData?.vkmusic || '',
        ymusic: initialData?.ymusic || '',
        preview: {
            current: initialData?.preview,
            file: undefined,
            url: initialData?.preview || '',
            isChanged: false,
            mode: initialData?.preview ? 'url' : 'file'
        },
        date: formatDateInput(initialData?.date),
        mainImage: {
            current: initialData?.mainImage,
            file: undefined,
            isChanged: false
        }
    });

    // Drag&Drop состояния
    const [isMainImageDragging, setIsMainImageDragging] = useState(false);

    // Ошибки
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, genreId: value }));
        if (errors.genreId) {
            setErrors(prev => ({ ...prev, genreId: '' }));
        }
    };

    const handlePreviewModeChange = (mode: 'file' | 'url') => {
        setFormData(prev => ({
            ...prev,
            preview: {
                ...prev.preview,
                mode,
                isChanged: true
            }
        }));
    };

    const handlePreviewUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            preview: {
                ...prev.preview,
                url: value,
                isChanged: true
            }
        }));
    };

    // Обработчики для main image
    const handleMainImageFileSelect = (file: File) => {
        if (file) {
            setFormData(prev => ({
                ...prev,
                mainImage: {
                    ...prev.mainImage,
                    file,
                    isChanged: true
                }
            }));
            if (errors.mainImage) {
                setErrors(prev => ({ ...prev, mainImage: '' }));
            }
        }
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleMainImageFileSelect(file);
        }
    };

    // Drag&Drop обработчики для main image
    const handleMainImageDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMainImageDragging(true);
    };

    const handleMainImageDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMainImageDragging(true);
    };

    const handleMainImageDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget === e.target) {
            setIsMainImageDragging(false);
        }
    };

    const handleMainImageDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMainImageDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            // Проверяем что это изображение
            if (file.type.startsWith('image/')) {
                handleMainImageFileSelect(file);
            } else {
                toast.error('Можно загружать только изображения');
            }
        }
    };

    const removeMainImage = () => {
        setFormData(prev => ({
            ...prev,
            mainImage: {
                current: undefined,
                file: undefined,
                isChanged: true
            }
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Название обязательно';
        }

        if (!formData.genreId) {
            newErrors.genreId = 'Жанр обязателен';
        }

        if (mode === 'create' && !formData.mainImage.file) {
            newErrors.mainImage = 'Обложка обязательна';
        }

        if (!formData.date) {
            newErrors.date = 'Дата обязательна';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const submitData = {
                name: formData.name,
                genreId: formData.genreId,
                youtube: formData.youtube,
                spotify: formData.spotify,
                vkmusic: formData.vkmusic,
                ymusic: formData.ymusic,
                date: formData.date,
            };

            if (mode === 'create') {
                if (!formData.mainImage.file) {
                    toast.error('Обложка обязательна');
                    return;
                }

                const createData: CreateMusicData = {
                    ...submitData,
                    mainImage: formData.mainImage.file!,
                };

                // Обработка preview в зависимости от режима
                if (formData.preview.mode === 'file' && formData.preview.file) {
                    createData.preview = formData.preview.file;
                } else if (formData.preview.mode === 'url' && formData.preview.url) {
                    createData.preview = formData.preview.url;
                }

                await createMusicMutation.mutateAsync(createData);

                router.push('/admin/music');
            } else {
                const updateData: UpdateMusicData = { ...submitData };

                if (formData.mainImage.file) {
                    updateData.mainImage = formData.mainImage.file;
                }

                // Обработка preview в зависимости от режима
                if (formData.preview.mode === 'file' && formData.preview.file) {
                    updateData.preview = formData.preview.file;
                } else if (formData.preview.mode === 'url' && formData.preview.isChanged && formData.preview.url) {
                    updateData.preview = formData.preview.url;
                } else if (formData.preview.current && !formData.preview.isChanged) {
                    // Если пользователь не менял preview, оставляем текущее значение
                    updateData.preview = formData.preview.current;
                }

                await updateMusicMutation.mutateAsync({
                    id: musicId!,
                    data: updateData
                });

                router.push('/admin/music');
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleDelete = async () => {
        if (!musicId) return;

        const confirmDelete = window.confirm(
            `Вы уверены, что хотите удалить трек "${formData.name}"?`
        );

        if (!confirmDelete) return;

        try {
            await deleteMusicMutation.mutateAsync(musicId);
            router.push('/admin/music');
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const isLoading = createMusicMutation.isPending || updateMusicMutation.isPending || deleteMusicMutation.isPending;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.form__content}>
                {/* Левый блок */}
                <div className={styles.form__left}>
                    {/* Main Image Upload */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            Обложка <span className={styles.field__required}>*</span>
                        </label>
                        <div
                            className={`${styles.field__input} ${errors.mainImage ? styles.field__input_error : ''} ${isMainImageDragging ? styles.field__input_dragging : ''}`}
                            onDragOver={handleMainImageDragOver}
                            onDragEnter={handleMainImageDragEnter}
                            onDragLeave={handleMainImageDragLeave}
                            onDrop={handleMainImageDrop}
                            style={{
                                border: '2px dashed var(--button-darkest)',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            {formData.mainImage.current || formData.mainImage.file ? (
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={formData.mainImage.file ? URL.createObjectURL(formData.mainImage.file) : formData.mainImage.current}
                                        alt="Обложка"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            borderRadius: 'var(--default-border-radius-small)'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeMainImage();
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            background: 'rgba(220, 53, 69, 0.9)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div>📁 Перетащите обложку сюда или кликните для выбора</div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMainImageChange}
                                        style={{ display: 'none' }}
                                        id="mainImageInput"
                                    />
                                    <label
                                        htmlFor="mainImageInput"
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '10px',
                                            padding: '8px 16px',
                                            background: 'var(--foreground)',
                                            color: 'var(--header-name-color)',
                                            borderRadius: 'var(--default-border-radius-small)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Выбрать файл
                                    </label>
                                </div>
                            )}
                        </div>
                        {errors.mainImage && <div className={styles.field__error}>{errors.mainImage}</div>}
                    </div>

                    {/* Genre */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            Жанр <span className={styles.field__required}>*</span>
                        </label>
                        <select
                            name="genreId"
                            value={formData.genreId}
                            onChange={handleGenreChange}
                            className={`${styles.field__input} ${errors.genreId ? styles.field__input_error : ''}`}
                        >
                            <option value="">Выберите жанр</option>
                            {genres?.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                        {errors.genreId && <div className={styles.field__error}>{errors.genreId}</div>}
                    </div>

                    {/* Date */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            Дата релиза <span className={styles.field__required}>*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={`${styles.field__input} ${errors.date ? styles.field__input_error : ''}`}
                        />
                        {errors.date && <div className={styles.field__error}>{errors.date}</div>}
                    </div>
                </div>

                {/* Правый блок */}
                <div className={styles.form__right}>
                    {/* Name */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            Название трека <span className={styles.field__required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Название трека"
                            className={`${styles.field__input} ${errors.name ? styles.field__input_error : ''}`}
                        />
                        {errors.name && <div className={styles.field__error}>{errors.name}</div>}
                    </div>

                    {/* YouTube */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            YouTube ссылка
                        </label>
                        <input
                            type="url"
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleInputChange}
                            placeholder="https://youtube.com/watch?v=..."
                            className={styles.field__input}
                        />
                    </div>

                    {/* Spotify */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            Spotify ссылка
                        </label>
                        <input
                            type="url"
                            name="spotify"
                            value={formData.spotify}
                            onChange={handleInputChange}
                            placeholder="https://open.spotify.com/track/..."
                            className={styles.field__input}
                        />
                    </div>

                    {/* VK Music */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            VK Музыка ссылка
                        </label>
                        <input
                            type="url"
                            name="vkmusic"
                            value={formData.vkmusic}
                            onChange={handleInputChange}
                            placeholder="https://vk.com/audio..."
                            className={styles.field__input}
                        />
                    </div>

                    {/* Yandex Music */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            Yandex Музыка ссылка
                        </label>
                        <input
                            type="url"
                            name="ymusic"
                            value={formData.ymusic}
                            onChange={handleInputChange}
                            placeholder="https://music.yandex.ru/..."
                            className={styles.field__input}
                        />
                    </div>

                    {/* Preview */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            Превью (аудио файл)
                        </label>

                        {/* Переключатель режима */}
                        <div className={styles.field__toggle}>
                            <button
                                type="button"
                                className={`${styles.field__toggle__option} ${formData.preview.mode === 'file' ? styles.field__toggle__option_active : ''}`}
                                onClick={() => handlePreviewModeChange('file')}
                            >
                                Загрузить файл
                            </button>
                            <button
                                type="button"
                                className={`${styles.field__toggle__option} ${formData.preview.mode === 'url' ? styles.field__toggle__option_active : ''}`}
                                onClick={() => handlePreviewModeChange('url')}
                            >
                                Ввести URL
                            </button>
                        </div>

                        {/* Контент в зависимости от режима */}
                        {formData.preview.mode === 'file' ? (
                            <AudioTrimmer
                                value={formData.preview.current}
                                onChange={(file) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        preview: {
                                            ...prev.preview,
                                            current: undefined, // Будет установлено после сохранения
                                            file,
                                            isChanged: true
                                        }
                                    }));
                                }}
                            />
                        ) : (
                            <input
                                type="text"
                                value={formData.preview.url || ''}
                                onChange={handlePreviewUrlChange}
                                placeholder="https://example.com/audio.mp3"
                                className={`${styles.field__input} ${errors.preview ? styles.field__input_error : ''}`}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Кнопки действий */}
            <div className={styles.form__actions}>
                <button
                    type="button"
                    onClick={() => router.push('/admin/music')}
                    className={`${styles.form__button} ${styles.form__button_cancel}`}
                    disabled={isLoading}
                >
                    Отмена
                </button>

                {mode === 'edit' && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className={`${styles.form__button} ${styles.form__button_delete}`}
                        disabled={isLoading}
                    >
                        {deleteMusicMutation.isPending ? 'Удаление...' : 'Удалить'}
                    </button>
                )}

                <button
                    type="submit"
                    className={`${styles.form__button} ${styles.form__button_submit}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        mode === 'create' ? 'Создание...' : 'Сохранение...'
                    ) : (
                        mode === 'create' ? 'Создать трек' : 'Сохранить изменения'
                    )}
                </button>
            </div>
        </form>
    );
}
