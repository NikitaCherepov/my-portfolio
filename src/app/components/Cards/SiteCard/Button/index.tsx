import styles from './Button.module.scss'

export default function Button({onClick, text, color, icon, background} : any) {
    if (text && icon || text) return (
        <button 
        style={background ? {background: background} : undefined}
        onClick={onClick ? () => onClick() : undefined} className={`${styles.container} hoverEffect`}>
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