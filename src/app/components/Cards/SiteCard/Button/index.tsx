import styles from './Button.module.scss'

export default function Button({onClick, text, color, icon} : any) {
    if (text && icon || text) return (
        <button className={`${styles.container} hoverEffect`}>
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
        <button className={`${styles.container_onlyIcon}`}>
            <img src={icon}></img>
        </button>
        )
    }
}