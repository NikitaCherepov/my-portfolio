import styles from './Button.module.scss'

interface ButtonProps {
    link?: string;
    onClick?: () => void;
    text?: string;
    icon?: string;
    background?: string;
    size?: 'small' | 'big';
    className?: string;
}

export default function Button({link, onClick, text, icon, background, size, className} : ButtonProps) {
    if (!link) {
        if (text && icon || text) return (
            <button 
            style={{background: background ? background : undefined}}
            onClick={onClick ? () => onClick() : undefined} className={`${className ? className : ''} ${styles.container} hoverEffect ${size === 'small' ? styles.container_small : size ==='big' ? styles.container_big : ''}`}>
                {icon ? (<img alt='Иконка' src={icon}></img>) : ''}
                {text ? (
                    <p>
                        {text}
                    </p>  
                )
                :
                ''}
            </button>
        )
        else if (icon && !text) {
            return (
            <button
            style={background ? {background: background} : undefined}
            onClick={onClick ? () => onClick() : undefined} className={`${className ? className : ''} ${styles.container_onlyIcon}`}>
                <img alt='Кликабельная иконка' src={icon}></img>
            </button>
            )
        }
    }
    else {
        if (text && icon || text) return (
            <a
            target="_blank"
            href={link}
            style={{background: background ? background : undefined}}
            onClick={onClick ? () => onClick() : undefined} className={`${className ? className : ''} ${styles.container} hoverEffect ${size === 'small' ? styles.container_small : size ==='big' ? styles.container_big : ''}`}>
                {icon ? (<img alt='Иконка' src={icon}></img>) : ''}
                {text ? (
                    <p>
                        {text}
                    </p>  
                )
                :
                ''}
            </a>
        )
        else if (icon && !text) {
            return (
            <a
            target="_blank"
            href={link}
            style={background ? {background: background} : undefined}
            onClick={onClick ? () => onClick() : undefined} className={`${className ? className : ''} ${styles.container_onlyIcon}`}>
                <img alt='Иконка' src={icon}></img>
            </a>
            )
        }
    }
}