import styles from './SortingComponentForList.module.scss'
import { useSortSitesStore } from '@/app/store/useExitStore'
import { usePathname } from 'next/navigation';
import {motion, AnimatePresence} from 'framer-motion'

export default function SortingComponentForList() {
    const {sortBy, setSortBy, sortingOptions, setSortingOptions} = useSortSitesStore();
    const pathname = usePathname();

    const pageKey = pathname.slice(1) as "sites" | "music";

    const handleChange = (element: any) => {
            if (sortBy[pageKey] === element.ascending ||sortBy[pageKey] === element.descending) {
                if (sortBy[pageKey] === element.ascending) {
                    setSortBy(pageKey, element.descending);
                    changeArrayOrder(sortingOptions[pageKey].find((el) => el.type === element.descending));
                }
                else {
                    setSortBy(pageKey, element.ascending);
                    changeArrayOrder(sortingOptions[pageKey].find((el) => el.type === element.ascending));
                }
            }
            else {
                setSortBy(pageKey, element.ascending);
                changeArrayOrder(sortingOptions[pageKey].find((el) => el.type === element.ascending));
            }
    }

    const changeArrayOrder = (element:any) => {
        const currentOptions = sortingOptions[pageKey];  
        if (!currentOptions) return;
      
        const selectedOption = currentOptions.find((obj) => obj.type === element?.type);
        if (!selectedOption) return;
      
        const alternateOption = currentOptions.find(
          (obj) => obj.name === selectedOption.name && obj.type !== selectedOption.type
        );
      
        const otherOptions = currentOptions.filter(
          (obj) => obj.name !== selectedOption.name
        );
      
        otherOptions.sort((a, b) => a.initialPosition - b.initialPosition);
      
        const newOptions = [];
        newOptions.push({ ...selectedOption, position: 1, active: true });
        if (alternateOption) {
          newOptions.push({ ...alternateOption, position: 2, active: false });
        }
        otherOptions.forEach((obj, idx) => {
          newOptions.push({ ...obj, position: idx + 3, active: false });
        });
      
        setSortingOptions(pageKey, newOptions);
    }

    const sortingGroups = {
        sites: [
            {
                label: "Название",
                ascending: "nameFromA",
                descending: "nameFromZ"
            },
            {
                label: "Стек",
                descending: "complex",
                ascending: "easiest"
            },
            {
                label: "Дата",
                ascending: "newest",
                descending: "oldest"
            }
        ],
        music: [
            {
                label: "Название",
                descending: "nameFromA",
                ascending: "nameFromZ"
            },
            {
                label: "Жанр",
                descending: "genreFromA",
                ascending: "genreFromZ"
            },
            {
                label: "Дата выхода",
                ascending: "newest",
                descending: "oldest"
            }
        ]
    };

    return (
        <motion.div className={styles.container}>

            {sortingGroups[pageKey].map ((el, index) => (
            <div onClick={() => handleChange(el)} key={index} className={`${el.ascending === sortBy[pageKey] || el.descending === sortBy[pageKey] ? styles.chosen : ''}`}>
                <motion.img
                animate={{transform: el.ascending === sortBy[pageKey] ? 'rotate(180deg)' : 'rotate(0deg)'}}
                transition={{duration: 0.3}}
                src='/images/icons/arrow.svg'/>
                <p>
                    {el.label}
                </p>
            </div>
            ))}


    </motion.div>
    )
}