import './index.css'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Header from '../Header'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div className="homeDiv1">
      <Header />
      <div className="homeDiv2">
        <img
          src="https://i.pinimg.com/originals/75/e7/ef/75e7ef7aa27009befb076509382b86b8.gif"
          alt="jobs gif"
          className="homeImg"
        />
        <div className="homeDiv3">
          <h1>Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button type="button" className="findJobs">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
