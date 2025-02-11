import styles from './SortingContainer.module.scss'
import { useViewStore } from '@/app/store/useExitStore'
import { useSortSitesStore } from '@/app/store/useExitStore'
import {motion, useAnimate} from 'framer-motion'
import {useState, useEffect, useRef} from 'react'


export default function SortingComponent() {

    const [scope, animate] = useAnimate();

    const [showModal, setShowModal] = useState(false);

    const firstOptionRef = useRef(null);

    const [sortingOptions, setSortingOptions] = useState([
        {
            name: 'По дате',
            type: 'newest',
            rotate: true,
            position: 1,
            initialPosition:1
        },
        {
            name: 'По дате',
            type: 'oldest',
            rotate: false,
            position: 2,
            initialPosition:2
        },
        {
            name: 'По названию',
            type: 'nameFromA',
            rotate: true,
            position: 3,
            initialPosition:3
        },
        {
            name: 'По названию',
            type: 'nameFromZ',
            rotate: false,
            position: 4,
            initialPosition:4
        },
        {
            name: 'По стеку',
            type: 'complex',
            rotate: true,
            position: 5,
            initialPosition:5
        },
        {
            name: 'По стеку',
            type: 'easiest',
            rotate: false,
            position: 6,
            initialPosition:6
        }
    ])

    const {sortBy, setSortBy} = useSortSitesStore();

    const handleChange = (element) => {

        if (element.type != sortBy) {
            setSortBy(element.type);
            
            setSortingOptions((prev) => {
                let elementPosition = element.position;
                return prev.map((object) => {
                    if (object.type != element.type && object.position === 1) {
                        return {...object, position: element.position}
                    }
                    else if (object.type === element.type) {
                        return {...object, position: 1}
                    }
                    else {
                        return object;
                    }
                })
            })
            setTimeout(() => {
                hide();
            }, 400)
            console.log(element.type);
        }
        else {
            hide();
        }

    }

    useEffect(() => {
        console.log(sortingOptions);
    }, [sortingOptions])

    const hide = async () => {
        await animate(scope.current, {height: 0}, {type: 'tween', stiffness: 150, damping: 20, duration: 0.4});
    }
    const show = async () => {
        await animate(scope.current, {height: 'auto'}, {type: 'tween', stiffness: 150, damping: 20, duration: 0.4});
    }



    return (
        <div className={styles.container}>
            <div onClick={() => show()} className={styles.container__option}>
                <img className={`${sortingOptions.find((element) => element.type === sortBy).rotate ? 'rotate-180' : ''}`} src='/images/icons/arrow.svg'></img>
                <p>{sortingOptions.find((element) => element.type === sortBy).name}</p>
            </div>


            <motion.div
                ref={scope}
                className={styles.container__modal}
            >
                {sortingOptions
                .sort((a,b) => a.position - b.position)
                .map((object, index) => (
                    <motion.div transition={{ type: "spring", stiffness: 150, damping: 20 }} layout onClick={() => handleChange(object)} key={object.type} className={`${styles.container__option} ${object.position === 6 ? 'mb-[13px]' : ''}`}>
                        <img className={`${object.rotate ? 'rotate-180' : ''}`} src='/images/icons/arrow.svg'></img>
                        <p>{object.name}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}