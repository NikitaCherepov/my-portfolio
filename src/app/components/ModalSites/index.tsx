'use client'
import styles from './ModalSites.module.scss'
import Button from '../Cards/SiteCard/Button';
import getEmoji from '@/app/utilities/getEmoji';
import { useTranslation } from 'react-i18next';
import { pickLocale, pickLocaleArray } from '@/app/utilities/pickLocale';

interface ModalSitesProps {
    toggleModal: (id: string | null) => void,
    id: string | null,
    siteData?: any // данные сайта из API
}

export default function ModalSites({toggleModal, id, siteData}: ModalSitesProps) {
    const { t, i18n } = useTranslation();
    const object = siteData;

    const name = pickLocale(object?.name, object?.nameEn, i18n.language);
    const description = pickLocale(object?.description, object?.descriptionEn, i18n.language) ?? '';
    const features = pickLocaleArray(object?.features, object?.featuresEn, i18n.language);

    return (
        <div className={`${styles.container}`} onClick={(e) => e.stopPropagation()}>
            <div onClick={() => toggleModal(null)} className={`${styles.closeButton} hoverEffect`}>
                <img alt={t('modal.closeAlt')} src='images/icons/close.svg'></img>
            </div>

            <h2 className={styles.container__header}>
                {name}
            </h2>

            <div className={styles.content}>
                <div className={styles.content__description}>
                    <p className={styles.content__description__text}>
                        {description.split("\n").map((line, index) => (
                            <span key={index}>
                            {line}
                            <br />
                            </span>
                        ))}
                    </p>
                    <img alt={t('modal.screenshotAlt')} className={styles.content__description__mainImage} src={object?.mainImage}></img>
                    <div style={object?.github === '' || object?.directLink === '' ? {justifyContent: 'center'} : undefined} className={styles.content__description__buttons}>
                        {object?.github != '' && (
                            <Button link={object?.github} className={styles.link} background={'white'} text={'GitHub'} icon={'images/icons/github.svg'}></Button>
                        )}
                        {object?.directLink != '' && (
                            <Button link={object?.directLink} className={styles.link} background={'white'} text={t('modal.go')} icon='images/icons/link.svg'></Button>
                        )}
                    </div>
                </div>

                <div className={`${styles.content__traits}`}>
                    <div className={styles.content__traits__stack}>
                        <h3>{t('modal.stack')}</h3>
                        <div className={styles.content__traits__stack__list}>
                        {object?.stack.map((el: string, index: number) => (
                            <div key={index}>
                                {getEmoji(el)}
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className={styles.content__traits__features}>
                        <h3>{t('modal.features')}</h3>
                        <ul className={styles.content__traits__features__list}>
                        {features.map((el, index) => (
                            <li key={index}>
                                {el}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>


            </div>
        </div>
    )
}
