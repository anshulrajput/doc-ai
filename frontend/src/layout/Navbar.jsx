import styles from './Navbar.module.css'
import { Fragment, useState, useEffect, useContext } from 'react'
import AuthContext from '../store/auth-context'
import { FaUser, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const [navDropdown, setNavDropdown] = useState(false)

  const { userLogout } = useContext(AuthContext)

  const showDD = () => {
    console.log('showDD')
    setNavDropdown((previousState) => !previousState)
  }
  // close nav dropdown if clicked outside
  useEffect(() => {
    window.addEventListener('click', closeSidemenu)

    return function cleanup() {
      window.removeEventListener('click', closeSidemenu)
    }
  }, [])
  let closeSidemenu = (e) => {
    // console.log(e.target.id)
    // console.log(e.target.parentNode.id)
    // console.log(e.target.parentNode.parentNode.id)
    if (
      e &&
      e.target?.id !== 'profileImgBtn' &&
      e.target?.parentNode.id !== 'profileImgBtn' &&
      e.target?.parentNode?.parentNode?.id !== 'profileImgBtn'
    ) {
      setNavDropdown(false)
    }
  }

  function logoutHandler() {
    userLogout()
  }

  return (
    <Fragment>
      <nav className={styles['navbar'] + ' navbar-expand-xl'}>
        <div
          style={{ maxWidth: '1920px' }}
          className="w-100 m-auto d-flex px-3 px-sm-2 px-md-3 justify-content-between"
        >
          <div className="d-flex flex-row">
            <div className={styles['navbar-brand']}>
            </div>
          </div>

          <div className="d-flex flex-row">
            <h4 className={styles['center-text'] + ' mb-1'}>
              Doc AI
            </h4>
          </div>

          <div className="d-flex flex-row">


            <span
              onClick={showDD}
              id="profileImgBtn"
              className={"me-2- "+styles['profile-icon']}
            >
              <FaUser style={{ color: 'var(--neutral-fill)' }} />
            </span>
            <div className={styles['dropdown']}>
              <div
                className={
                  navDropdown === true
                    ? styles['dropdown-content'] + ' ' + styles['show']
                    : styles['dropdown-content']
                }
                id="myDropdown"
              >
                <span
                  onClick={logoutHandler}
                  className={styles['dropdown-item']}
                >
                  <FaSignOutAlt />
                  <span style={{ marginLeft: '1em' }}>Logout</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  )
}

export default Navbar
