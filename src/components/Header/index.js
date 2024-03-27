import './index.css'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {FaHome} from 'react-icons/fa'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="navUl">
        <Link to="/">
          <li className="navLi">
            {' '}
            <FaHome />
            Home
          </li>
        </Link>
        <Link to="/jobs">
          <li className="navLi">Jobs</li>
        </Link>
      </ul>
      <button type="button" onClick={onClickLogout} className="logout">
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
