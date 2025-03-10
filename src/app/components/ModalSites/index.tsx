import styles from './ModalSites.module.scss'
import { useWorkStore } from '@/app/store/useExitStore'
import Button from '../Cards/SiteCard/Button';
import getEmoji from '@/app/utilities/getEmoji';

interface ModalSitesProps {
    toggleModal: (id: string | null) => void,
    id: string | null
}



export default function ModalSites({toggleModal, id}: ModalSitesProps) {
    const {sites} = useWorkStore();
    const object = sites.find((el) => el.id === id);
    return (
        <div className={`${styles.container}`} onClick={(e) => e.stopPropagation()}>
            <div onClick={() => toggleModal(null)} className={`${styles.closeButton} hoverEffect`}>
                <img alt='Иконка закрытия' src='images/icons/close.svg'></img>
            </div>

            <h2 className={styles.container__header}>
                {object?.name}
            </h2>

            <div className={styles.content}>
                <div className={styles.content__description}>
                    <p className={styles.content__description__text}>
                        {object?.description.split("\n").map((line, index) => (
                            <span key={index}>
                            {line}
                            <br />
                            </span>
                        ))}
                    </p>
                    <img alt='Скриншот сайта' className={styles.content__description__mainImage} src={object?.mainImage}></img>
                    <div style={object?.github === '' || object?.directLink === '' ? {justifyContent: 'center'} : undefined} className={styles.content__description__buttons}>
                        {object?.github != '' && (
                            <Button link={object?.github} className={styles.link} background={'white'} text={'GitHub'} icon={'images/icons/github.svg'}></Button>
                        )}
                        {object?.directLink != '' && (
                            <Button link={object?.directLink} className={styles.link} background={'white'} text='Перейти' icon='images/icons/link.svg'></Button>
                        )}
                    </div>
                </div>

                <div className={`${styles.content__traits}`}>
                    <div className={styles.content__traits__stack}>
                        <h3>Стек</h3>
                        <div className={styles.content__traits__stack__list}>
                        {object?.stack.map((el, index) => (
                            <div key={index}>
                                {getEmoji(el)}
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className={styles.content__traits__features}>
                        <h3>Особенности</h3>
                        <ul className={styles.content__traits__features__list}>
                        {object?.features.map((el, index) => (
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