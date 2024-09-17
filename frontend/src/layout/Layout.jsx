import styles from './Layout.module.css'
import Navbar from './Navbar'

function Layout(props) {
    return (
        <div className={styles['container']}>
            <div className={styles['Navbar']}>
                <Navbar></Navbar>
            </div>
            <div className={styles['Page-Content'] + ' p-4'}>
                {props.children}
            </div>
        </div>
    )
}

export default Layout
