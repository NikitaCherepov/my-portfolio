import styles from './ModalSites.module.scss'
import { useWorkStore } from '@/app/store/useExitStore'
import Button from '../Cards/SiteCard/Button';
import {useRouter} from 'next/navigation'
import getEmoji from '@/app/utilities/getEmoji';

export default function ModalSites({toggleModal, id}: any) {
    const {sites} = useWorkStore();
    const object = sites.find((el) => el.id === id);
    const router = useRouter();
    return (
        <div className={`${styles.container}`} onClick={(e) => e.stopPropagation()}>
            <div onClick={() => toggleModal(null)} className={`${styles.closeButton} hoverEffect`}>
                <img src='images/icons/close.svg'></img>
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
                    <img className={styles.content__description__mainImage} src={object?.mainImage}></img>
                    <div className={styles.content__description__buttons}>
                        <Button link={object?.github} className={styles.link} background={'white'} text={'GitHub'} icon={'images/icons/github.svg'}></Button>
                        <Button className={styles.link} background={'white'} text='Перейти' icon='images/icons/link.svg'></Button>
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