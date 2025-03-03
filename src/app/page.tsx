'use client'
import { useRef, useState } from 'react'
import { motion, useMotionValue, useAnimationFrame, animate, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import styles from './page.module.scss'
import { useInitiateExit } from './hooks/useInitiateExit'

export default function MainPage() {

  const [hoverSites, setHoverSites] = useState(false);
  const [hoverMusic, setHoverMusic] = useState(false);

  const initiateExit = useInitiateExit();

  // Координаты первого блока
  const x1 = useMotionValue(0);
  const y1 = useMotionValue(0);
  // Амплитуда движения первого блока
  const amplitude1 = useMotionValue(10);

  // Координаты второго блока
  const x2 = useMotionValue(0);
  const y2 = useMotionValue(0);
  // Амплитуда движения второго блока
  const amplitude2 = useMotionValue(10);

  // Храним прошедшее время для анимации
  const timeRef = useRef(0);

  // Функция, вызываемая каждый кадр
  useAnimationFrame((t, delta) => {
    // Увеличиваем накопленное время (в секундах)
    timeRef.current += delta / 1500;

    // Первый блок двигается по синусоиде
    x1.set(Math.cos(timeRef.current) * amplitude1.get());
    y1.set(Math.sin(timeRef.current) * amplitude1.get());

    // Второй блок чуть иначе (меняем частоту, фазу и т.д. по желанию)
    x2.set(Math.cos(timeRef.current * 1.3 + 4) * amplitude2.get());
    y2.set(Math.sin(timeRef.current * 1.3 - 3) * amplitude2.get());
  });

  // При наведении мы анимируем амплитуду к 0
  function handleHoverStart1() {
    animate(amplitude1, 0, { duration: 0.4, ease: 'easeOut' });
    setHoverSites(true);
  }
  // При выходе с hover возвращаем её на исходное значение
  function handleHoverEnd1() {
    animate(amplitude1, 20, { duration: 0.4, ease: 'easeOut' });
    setHoverSites(false);
  }

  function handleHoverStart2() {
    animate(amplitude2, 0, { duration: 0.4, ease: 'easeOut' });
    setHoverMusic(true);
  }
  function handleHoverEnd2() {
    animate(amplitude2, 20, { duration: 0.4, ease: 'easeOut' });
    setHoverMusic(false);
  }

  return (
    <div className={styles.container}>
      <h1>
        Привет!<br />
        Меня зовут Никита Черепов.<br />
        Я пишу <em>музыку</em> и занимаюсь <em>разработкой сайтов</em>.<br/>
        На этом сайте собраны все мои работы.
      </h1>
      <h2>Выбери, что интересно:</h2>

      <div className={styles.choices}>

        <motion.div
          style={{ x: x1, y: y1 }}
          onHoverStart={handleHoverStart1}
          onHoverEnd={handleHoverEnd1}
          className={`${styles.choices__choiceButton}  ${hoverSites ? styles.choices__choiceButton_hovered : ''}`}
          onClick={() => initiateExit('/music')}
        >
          <Image
            src='/images/main/allSongs.webp'
            className={styles.choices__choiceButton__image}
            alt={'Музыкальные работы'}
            width={500}
            height={500}
            priority
            quality={100}
          />
          <AnimatePresence>
            {hoverSites ? (
              <>
                <motion.div initial={{opacity:0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.4}} className={styles.choices__choiceButton__fog}></motion.div>
                <motion.div initial={{opacity:0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.4}} className={styles.choices__choiceButton__name}>Музыка</motion.div>
              </>
            ) : ''}

          </AnimatePresence>
        </motion.div>

        <motion.div
          style={{ x: x2, y: y2 }}
          onHoverStart={handleHoverStart2}
          onHoverEnd={handleHoverEnd2}
          className={`${styles.choices__choiceButton}  ${hoverMusic ? styles.choices__choiceButton_hovered : ''}`}
          onClick={() => initiateExit('/sites')}
        >
          <Image
            src='/images/main/sites.png'
            className={`${styles.choices__choiceButton__image}`}
            alt={'Модель сайта'}
            width={500}
            height={500}
            priority
            quality={100}
          />
          <AnimatePresence>
            {hoverMusic ? (
              <>
                <motion.div initial={{opacity:0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.4}} className={styles.choices__choiceButton__fog}></motion.div>
                <motion.div initial={{opacity:0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.4}} className={styles.choices__choiceButton__name}>Сайты</motion.div>
              </>
            ) : ''}

          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  )
}
