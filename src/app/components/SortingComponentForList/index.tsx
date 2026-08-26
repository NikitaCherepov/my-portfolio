import styles from './SortingComponentForList.module.scss'
import { useSortSitesStore } from '@/app/store/useExitStore'
import { usePathname } from 'next/navigation';
import {motion} from 'framer-motion'
import { SortingOption } from '@/app/store/useExitStore';
import { useTranslation } from 'react-i18next'

interface elementSort {
    label: string,
    descending:string,
    ascending: string
}

export default function SortingComponentForList() {
    const {sortBy, setSortBy, sortingOptions, setSortingOptions} = useSortSitesStore();
    const pathname = usePathname();
    const { t } = useTranslation();

    const pageKey = pathname.slice(1) as "sites" | "music";

    const handleChange = (element: elementSort) => {
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

    const changeArrayOrder = (element:SortingOption | undefined) => {
        const currentOptions = sortingOptions[pageKey];  
        if (!currentOptions) return;
        console.log(element);
      
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
                label: t('sorting.name'),
                ascending: "nameFromA",
                descending: "nameFromZ"
            },
            {
                label: t('sorting.stack'),
                descending: "complex",
                ascending: "easiest"
            },
            {
                label: t('sorting.date'),
                ascending: "newest",
                descending: "oldest"
            }
        ],
        music: [
            {
                label: t('sorting.name'),
                descending: "nameFromA",
                ascending: "nameFromZ"
            },
            {
                label: t('sorting.genre'),
                descending: "genreFromA",
                ascending: "genreFromZ"
            },
            {
                label: t('sorting.releaseDate'),
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