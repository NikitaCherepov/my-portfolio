import styles from './Button.module.scss'

export default function Button({link, onClick, style, text, color, icon, background, size, className} : any) {
    if (!link) {
        if (text && icon || text) return (
            <button 
            style={{background: background ? background : undefined}}
            onClick={onClick ? () => onClick() : undefined} className={`${className ? className : ''} ${styles.container} hoverEffect ${size === 'small' ? styles.container_small : size ==='big' ? styles.container_big : ''}`}>
                {icon ? (<img src={icon}></img>) : ''}
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
                <img src={icon}></img>
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
                {icon ? (<img src={icon}></img>) : ''}
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
                <img src={icon}></img>
            </a>
            )
        }
    }
}