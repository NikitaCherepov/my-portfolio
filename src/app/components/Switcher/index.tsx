import styles from './Switcher.module.scss'
import {motion, useAnimate} from 'framer-motion'
import { useViewStore } from '../../store/useExitStore';

export default function Switcher() {


    const {view, toggleView} = useViewStore();

    const handleAnimation = () => {
        if (view === 'list') {
            handleRight();
        }
        else {
            handleLeft();
        }
    }

    const [scope, animate] = useAnimate();


    const handleRight = async () => {
        await animate(scope.current, {x: 0, width: '45px', height: '45px'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 0.1});
        await animate(scope.current, {x: 50, width: '80px', height: '35px'}, {ease: 'linear', type: 'tween', duration: 0.1});
        toggleView();
        await animate(scope.current, {x: 100, width: '45px', height: '45px'}, {type: 'spring', stiffness: 150, duration: 0.1});
    }
    const handleLeft = async () => {
        await animate(scope.current, {x: 100, width: '45px', height: '45px'}, {ease: 'linear', type: 'tween', stiffness: 150, duration: 0.1});
        await animate(scope.current, {x: 50, width: '80px', height: '35px'}, {ease: 'linear', type: 'tween', duration: 0.1});
        toggleView();
        await animate(scope.current, {x: 0, width: '45px', height: '45px'}, {type: 'spring', stiffness: 150, duration: 0.1});
    }

    return (
        <div onClick ={() => handleAnimation()} className={`${styles.container} hoverEffect`}>
            <motion.img 
                src={'/images/menu/list.svg'}
                animate={{
                    opacity: view === 'list' ? 0 : 1,
                }}
                transition={{type:"string", stiffness: 300, damping: 20}}
                style={{opacity: view === 'list' ? 0 : 1}}
            ></motion.img>
            <motion.img 
                src={'/images/menu/block.svg'}
                animate={{
                    opacity: view === 'grid' ? 0 : 1,
                }}
                transition={{type:"string", stiffness: 300, damping: 20}}
                style={{opacity: view === 'grid' ? 0 : 1}}
            ></motion.img>

            <motion.div style={{x: view === 'list' ? 0 : 100}} ref={scope} id="target" className={styles.container__switcher}
            ></motion.div>
        </div>
    )
}