import styles from './style.less'

const FormTitle = ({name}) => {
  return(
    <div className={styles.title}>
      <span>{name}</span>
    </div>
  )
}

export default FormTitle