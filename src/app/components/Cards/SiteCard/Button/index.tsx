import styles from './Button.module.scss'

export default function Button({onClick, style, text, color, icon, background, size} : any) {
    if (text && icon || text) return (
        <button 
        style={{background: background ? background : undefined}}
        onClick={onClick ? () => onClick() : undefined} className={`${styles.container} hoverEffect ${size === 'small' ? styles.container_small : size ==='big' ? styles.container_big : ''}`}>
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
        onClick={onClick ? () => onClick() : undefined} className={`${styles.container_onlyIcon}`}>
            <img src={icon}></img>
        </button>
        )
    }
}