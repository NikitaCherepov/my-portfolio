'use client';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useCreateSite, useUpdateSite, useDeleteSite } from '@/app/hooks/useSiteMutations';
import { useRouter } from 'next/navigation';
import { CreateSiteData, UpdateSiteData } from '@/app/hooks/useSiteMutations';
import { Site } from '@/app/hooks/useSiteMutations';
import TranslateButton from '@/app/admin/components/TranslateButton';
import { useTranslation } from 'react-i18next';
import styles from './SiteForm.module.scss';

const formatDateInput = (value?: string) => {
    if (!value) return new Date().toISOString().split('T')[0];
    return new Date(value).toISOString().split('T')[0];
};

interface SiteFormProps {
    mode: 'create' | 'edit';
    initialData?: Site;
    siteId?: string;
}

export default function SiteForm({ mode, initialData, siteId }: SiteFormProps) {
    const router = useRouter();
    const createSiteMutation = useCreateSite();
    const updateSiteMutation = useUpdateSite();
    const deleteSiteMutation = useDeleteSite();
    const { t } = useTranslation();

    // Интерфейс для данных формы
    interface SiteFormData {
        name: string;
        nameEn: string;
        directLink: string;
        github: string;
        description: string;
        descriptionEn: string;
        date: string;
        companyName: string;
        companyUrl: string;
        companyNameEn: string;
        stack: string[];
        features: string[];
        featuresEn: string[];
        mainImage: {
            current?: string;
            file?: File;
            isChanged: boolean;
        };
        gallery: {
            current: string[];
            files: File[];
            removed: string[];
            isChanged: boolean;
        };
    }

    // Форма данные
    const [formData, setFormData] = useState<SiteFormData>({
        name: initialData?.name || '',
        nameEn: initialData?.nameEn || '',
        directLink: initialData?.directLink || '',
        github: initialData?.github || '',
        description: initialData?.description || '',
        descriptionEn: initialData?.descriptionEn || '',
        date: formatDateInput(initialData?.date),
        companyName: initialData?.companyName || '',
        companyUrl: initialData?.companyUrl || '',
        companyNameEn: initialData?.companyNameEn || '',
        stack: initialData?.stack || [],
        features: initialData?.features || [],
        featuresEn: initialData?.featuresEn || [],
        mainImage: {
            current: initialData?.mainImage,
            file: undefined,
            isChanged: false
        },
        gallery: {
            current: initialData?.gallery || [],
            files: [],
            removed: [],
            isChanged: false
        }
    });

    const [newTag, setNewTag] = useState('');
    const [newFeature, setNewFeature] = useState('');
    const [featuresEnText, setFeaturesEnText] = useState((initialData?.featuresEn || []).join('\n'));

    // Drag&Drop состояния
    const [isMainImageDragging, setIsMainImageDragging] = useState(false);
    const [isGalleryDragging, setIsGalleryDragging] = useState(false);

    // Ошибки
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.stack.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                stack: [...prev.stack, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            stack: prev.stack.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleAddFeature = () => {
        if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (featureToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter(feature => feature !== featureToRemove)
        }));
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                mainImage: {
                    ...prev.mainImage,
                    file,
                    isChanged: true
                }
            }));
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

    // Drag&Drop обработчики для mainImage
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
        // Проверяем что действительно уходим за пределы контейнера
        if (e.currentTarget === e.target) {
            setIsMainImageDragging(false);
        }
    };

    const handleMainImageDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMainImageDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            setFormData(prev => ({
                ...prev,
                mainImage: {
                    ...prev.mainImage,
                    file: files[0],
                    isChanged: true
                }
            }));
            toast.success(t('admin.siteForm.coverAdded'));
        } else {
            toast.error(t('admin.siteForm.chooseImage'));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const totalFiles = formData.gallery.current.length + formData.gallery.files.length + newFiles.length;

            if (totalFiles > 10) {
                toast.error(t('admin.siteForm.maxPhotos'));
                return;
            }

            setFormData(prev => ({
                ...prev,
                gallery: {
                    ...prev.gallery,
                    files: [...prev.gallery.files, ...newFiles],
                    isChanged: true
                }
            }));
        }
    };

    const removeGalleryImage = (imageUrl: string, index?: number) => {
        if (index !== undefined) {
            // Удаление нового файла
            setFormData(prev => ({
                ...prev,
                gallery: {
                    ...prev.gallery,
                    files: prev.gallery.files.filter((_, i) => i !== index),
                    isChanged: true
                }
            }));
        } else {
            // Удаление текущего изображения
            setFormData(prev => ({
                ...prev,
                gallery: {
                    ...prev.gallery,
                    current: prev.gallery.current.filter(url => url !== imageUrl),
                    removed: [...prev.gallery.removed, imageUrl],
                    isChanged: true
                }
            }));
        }
    };

    // Drag&Drop обработчики для gallery
    const handleGalleryDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsGalleryDragging(true);
    };

    const handleGalleryDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsGalleryDragging(true);
    };

    const handleGalleryDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Проверяем что действительно уходим за пределы контейнера
        if (e.currentTarget === e.target) {
            setIsGalleryDragging(false);
        }
    };

    const handleGalleryDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsGalleryDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length === 0) {
            toast.error(t('admin.siteForm.chooseImages'));
            return;
        }

        const totalFiles = formData.gallery.current.length + formData.gallery.files.length + imageFiles.length;

        if (totalFiles > 10) {
            toast.error(t('admin.siteForm.maxPhotosDetailed', {
                count: imageFiles.length,
                available: 10 - (formData.gallery.current.length + formData.gallery.files.length)
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            gallery: {
                ...prev.gallery,
                files: [...prev.gallery.files, ...imageFiles],
                isChanged: true
            }
        }));

        toast.success(t('admin.siteForm.imagesAdded', { count: imageFiles.length }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = t('admin.siteForm.nameRequired');
        }

        if (!formData.directLink.trim()) {
            newErrors.directLink = t('admin.siteForm.directLinkRequired');
        }

        if (!formData.description.trim()) {
            newErrors.description = t('admin.siteForm.descriptionRequired');
        }

        if (mode === 'create' && !formData.mainImage.file) {
            newErrors.mainImage = t('admin.siteForm.coverRequired');
        }

        if (!formData.date) {
            newErrors.date = t('admin.siteForm.dateRequired');
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
                nameEn: formData.nameEn.trim(),
                directLink: formData.directLink,
                github: formData.github,
                description: formData.description,
                descriptionEn: formData.descriptionEn.trim(),
                date: formData.date,
                companyName: formData.companyName,
                companyUrl: formData.companyUrl,
                companyNameEn: formData.companyNameEn.trim(),
                stack: formData.stack.filter(tag => tag.trim()),
                features: formData.features.filter(feature => feature.trim()),
                featuresEn: featuresEnText
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line),
            };

            if (mode === 'create') {
                if (!formData.mainImage.file) {
                    toast.error(t('admin.siteForm.coverRequired'));
                    return;
                }

                await createSiteMutation.mutateAsync({
                    ...submitData,
                    mainImage: formData.mainImage.file!,
                    gallery: formData.gallery.files.length > 0 ? formData.gallery.files : undefined,
                } as CreateSiteData);

                router.push('/admin/sites');
            } else {
                const updateData: UpdateSiteData = { ...submitData };

                if (formData.mainImage.file) {
                    updateData.mainImage = formData.mainImage.file;
                }

                if (formData.gallery.files.length > 0) {
                    updateData.gallery = formData.gallery.files;
                }

                if (formData.gallery.removed.length > 0) {
                    updateData.removeGallery = formData.gallery.removed;
                }

                await updateSiteMutation.mutateAsync({
                    id: siteId!,
                    data: updateData
                });

                router.push('/admin/sites');
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleDelete = async () => {
        if (!siteId) return;

        const confirmDelete = window.confirm(
            t('toasts.deleteConfirmSite', { name: formData.name })
        );

        if (!confirmDelete) return;

        try {
            await deleteSiteMutation.mutateAsync(siteId);
            router.push('/admin/sites');
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const isLoading = createSiteMutation.isPending || updateSiteMutation.isPending || deleteSiteMutation.isPending;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.form__content}>
                {/* Левый блок */}
                <div className={styles.form__left}>
                    {/* Main Image Upload */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.siteForm.coverLabel')} <span className={styles.field__required}>*</span>
                        </label>
                        <div
                            className={`${styles.field__input} ${errors.mainImage ? styles.field__input_error : ''} ${isMainImageDragging ? styles.field__input_dragging : ''}`}
                            style={{
                                border: '2px dashed var(--button-darkest)',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                minHeight: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={() => document.getElementById('mainImage')?.click()}
                            onDragOver={handleMainImageDragOver}
                            onDragEnter={handleMainImageDragEnter}
                            onDragLeave={handleMainImageDragLeave}
                            onDrop={handleMainImageDrop}
                        >
                            <input
                                id="mainImage"
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageChange}
                                style={{ display: 'none' }}
                            />

                            {/* Drag&Drop оверлей */}
                            {isMainImageDragging && (
                                <div className={styles.field__input__dragOverlay}>
                                    {t('admin.siteForm.dropHere')}
                                </div>
                            )}

                            {formData.mainImage.file ? (
                                <div>
                                    <img
                                        src={URL.createObjectURL(formData.mainImage.file)}
                                        alt="Main preview"
                                        style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain' }}
                                    />
                                    <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem' }}>
                                        {formData.mainImage.file.name}
                                    </p>
                                </div>
                            ) : formData.mainImage.current ? (
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={formData.mainImage.current}
                                        alt="Current main image"
                                        style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain' }}
                                    />
                                    {mode === 'edit' && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeMainImage();
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                background: 'rgba(220, 53, 69, 0.9)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p>{t('admin.siteForm.clickOrDrop')}</p>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                                        {t('admin.siteForm.fileFormats')}
                                    </p>
                                </div>
                            )}
                        </div>
                        {errors.mainImage && <div className={styles.field__error}>{errors.mainImage}</div>}
                    </div>

                    {/* Gallery Upload */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.siteForm.galleryLabel')}
                        </label>
                        <div
                            className={`${styles.field__input} ${isGalleryDragging ? styles.field__input_dragging : ''}`}
                            style={{
                                border: '2px dashed var(--button-darkest)',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                minHeight: '150px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={() => document.getElementById('gallery')?.click()}
                            onDragOver={handleGalleryDragOver}
                            onDragEnter={handleGalleryDragEnter}
                            onDragLeave={handleGalleryDragLeave}
                            onDrop={handleGalleryDrop}
                        >
                            <input
                                id="gallery"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryChange}
                                style={{ display: 'none' }}
                            />

                            {/* Drag&Drop оверлей для галереи */}
                            {isGalleryDragging && (
                                <div className={styles.field__input__dragOverlay}>
                                    {t('admin.siteForm.dropPhotosHere')}
                                </div>
                            )}

                            <p>{t('admin.siteForm.addGalleryPhoto')}</p>
                            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                                {t('admin.siteForm.photosCount', { count: formData.gallery.current.length + formData.gallery.files.length })}
                            </p>
                        </div>

                        {/* Gallery Preview Grid */}
                        {(formData.gallery.current.length > 0 || formData.gallery.files.length > 0) && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                gap: '8px',
                                marginTop: '12px'
                            }}>
                                {/* Текущие изображения */}
                                {formData.gallery.current.map((url, index) => (
                                    <div key={`current-${index}`} style={{
                                        position: 'relative',
                                        aspectRatio: '1',
                                        border: '1px solid var(--button-darkest)',
                                        borderRadius: 'var(--default-border-radius-small)',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={url}
                                            alt={`Gallery ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeGalleryImage(url);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                background: 'rgba(220, 53, 69, 0.9)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                {/* Новые файлы */}
                                {formData.gallery.files.map((file, index) => (
                                    <div key={`new-${index}`} style={{
                                        position: 'relative',
                                        aspectRatio: '1',
                                        border: '1px solid var(--button-darkest)',
                                        borderRadius: 'var(--default-border-radius-small)',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`New gallery ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeGalleryImage('', index);
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                background: 'rgba(220, 53, 69, 0.9)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Правый блок */}
                <div className={styles.form__right}>
                    {/* Name */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.siteForm.nameLabel')} <span className={styles.field__required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`${styles.field__input} ${errors.name ? styles.field__input_error : ''}`}
                            placeholder={t('admin.siteForm.namePlaceholder')}
                        />
                        {errors.name && <div className={styles.field__error}>{errors.name}</div>}
                    </div>

                    {/* Name EN */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.siteForm.nameEnLabel')}
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <input
                                type="text"
                                name="nameEn"
                                value={formData.nameEn}
                                onChange={handleInputChange}
                                placeholder={t('admin.siteForm.nameEnPlaceholder')}
                                className={styles.field__input}
                                style={{ flex: 1 }}
                            />
                            <TranslateButton
                                source={formData.name}
                                onTranslated={(text) => setFormData(prev => ({ ...prev, nameEn: text }))}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.siteForm.descriptionLabel')} <span className={styles.field__required}>*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`${styles.field__input} ${styles.field__input__textarea} ${errors.description ? styles.field__input_error : ''}`}
                            placeholder={t('admin.siteForm.descriptionPlaceholder')}
                            rows={4}
                        />
                        {errors.description && <div className={styles.field__error}>{errors.description}</div>}
                    </div>

                    {/* Description EN */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.siteForm.descriptionEnLabel')}
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <textarea
                                name="descriptionEn"
                                value={formData.descriptionEn}
                                onChange={handleInputChange}
                                className={`${styles.field__input} ${styles.field__input__textarea}`}
                                placeholder={t('admin.siteForm.descriptionEnPlaceholder')}
                                rows={4}
                                style={{ flex: 1 }}
                            />
                            <TranslateButton
                                source={formData.description}
                                onTranslated={(text) => setFormData(prev => ({ ...prev, descriptionEn: text }))}
                            />
                        </div>
                    </div>

                    {/* Direct Link */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.siteForm.directLinkLabel')} <span className={styles.field__required}>*</span>
                        </label>
                        <input
                            type="url"
                            name="directLink"
                            value={formData.directLink}
                            onChange={handleInputChange}
                            className={`${styles.field__input} ${errors.directLink ? styles.field__input_error : ''}`}
                            placeholder="https://example.com"
                        />
                        {errors.directLink && <div className={styles.field__error}>{errors.directLink}</div>}
                    </div>

                    {/* GitHub */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>GitHub</label>
                        <input
                            type="url"
                            name="github"
                            value={formData.github}
                            onChange={handleInputChange}
                            className={styles.field__input}
                            placeholder="https://github.com/username/repo"
                        />
                    </div>

                    {/* Date */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>
                            {t('admin.siteForm.dateLabel')} <span className={styles.field__required}>*</span>
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

                    {/* Company Name */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>{t('admin.siteForm.companyNameLabel')}</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className={styles.field__input}
                            placeholder={t('admin.siteForm.companyNamePlaceholder')}
                        />
                    </div>

                    {/* Company Name EN */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>{t('admin.siteForm.companyNameEnLabel')}</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <input
                                type="text"
                                name="companyNameEn"
                                value={formData.companyNameEn}
                                onChange={handleInputChange}
                                className={styles.field__input}
                                placeholder={t('admin.siteForm.companyNameEnPlaceholder')}
                                style={{ flex: 1 }}
                            />
                            <TranslateButton
                                source={formData.companyName}
                                onTranslated={(text) => setFormData(prev => ({ ...prev, companyNameEn: text }))}
                            />
                        </div>
                    </div>

                    {/* Company URL */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>{t('admin.siteForm.companyUrlLabel')}</label>
                        <input
                            type="url"
                            name="companyUrl"
                            value={formData.companyUrl}
                            onChange={handleInputChange}
                            className={styles.field__input}
                            placeholder="https://..."
                        />
                    </div>

                    {/* Stack */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>{t('admin.siteForm.stackLabel')}</label>
                        <div className={styles.tags}>
                            <div className={styles.tags__input}>
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder={t('admin.siteForm.addTagPlaceholder')}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    className={styles.field__input}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className={styles.tags__add}
                                >
                                    {t('admin.siteForm.addButton')}
                                </button>
                            </div>
                            <div className={styles.tags__list}>
                                {formData.stack.map((tag, index) => (
                                    <span key={index} className={styles.tags__tag}>
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className={styles.tags__remove}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>{t('admin.siteForm.featuresLabel')}</label>
                        <div className={styles.tags}>
                            <div className={styles.tags__input}>
                                <input
                                    type="text"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder={t('admin.siteForm.addFeaturePlaceholder')}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                                    className={styles.field__input}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className={styles.tags__add}
                                >
                                    {t('admin.siteForm.addButton')}
                                </button>
                            </div>
                            <div className={styles.tags__list}>
                                {formData.features.map((feature, index) => (
                                    <span key={index} className={styles.tags__tag}>
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(feature)}
                                            className={styles.tags__remove}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Features EN */}
                    <div className={styles.field}>
                        <label className={styles.field__label}>{t('admin.siteForm.featuresEnLabel')}</label>
                        <textarea
                            value={featuresEnText}
                            onChange={(e) => setFeaturesEnText(e.target.value)}
                            className={`${styles.field__input} ${styles.field__input__textarea}`}
                            placeholder={t('admin.siteForm.addFeatureEnPlaceholder')}
                            rows={4}
                        />
                        <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>
                            {t('admin.siteForm.featuresEnHint')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Кнопки */}
            <div className={styles.form__actions}>
                {mode === 'edit' && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className={`${styles.form__button} ${styles.form__button_delete}`}
                    >
                        {deleteSiteMutation.isPending ? t('common.deleting') : t('common.delete')}
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => router.push('/admin/sites')}
                    className={`${styles.form__button} ${styles.form__button_cancel}`}
                    disabled={isLoading}
                >
                    {t('common.cancel')}
                </button>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`${styles.form__button} ${styles.form__button_submit}`}
                >
                    {mode === 'create'
                        ? (createSiteMutation.isPending ? t('common.creating') : t('admin.siteForm.submitCreate'))
                        : (updateSiteMutation.isPending ? t('common.saving') : t('common.save'))
                    }
                </button>
            </div>
        </form>
    );
}
