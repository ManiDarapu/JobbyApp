import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {Link} from 'react-router-dom'
import Filters from '../Filters'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'INPROGRESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    activeEmploymentId: '',
    activeSalaryId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  resetFilters = () => {
    this.setState({activeEmploymentId: '', activeSalaryId: '', searchInput: ''})
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const {activeEmploymentId, activeSalaryId, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentId}&minimum_package=${activeSalaryId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const reqData = data.jobs
      const updatedData = reqData.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failureView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button">Retry</button>
    </div>
  )

  renderInprogressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="red" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {jobsList} = this.state
    return (
      <ul className="jobsUl">
        {jobsList.map(each => (
          <Link to={`/jobs/${each.id}`} key={each.id} className="jobLink">
            <li className="jobsLi">
              <div className="jobLogo">
                <img src={each.companyLogoUrl} alt="company logo" />
                <div className="title">
                  <h1>{each.title}</h1>
                  <div className="shortData">
                    <div className="location">
                      <AiFillStar />
                      <p>{each.rating} star</p>
                    </div>
                    <div className="location">
                      <MdLocationOn />
                      <p>{each.location}</p>
                    </div>
                    <p>Job Type: {each.employmentType}</p>
                    <p>Salary: {each.packagePerAnnum}</p>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <h1>Description</h1>
                <p>{each.jobDescription}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.initial:
        return this.renderInprogressView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderInprogressView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  changeEmploymentType = activeEmploymentId => {
    this.setState({activeEmploymentId}, this.getJobs)
  }

  changeSalaryRange = activeSalaryId => {
    this.setState({activeSalaryId}, this.getJobs)
  }

  changeSearchInput = value => {
    this.setState({searchInput: value}, this.getJobs)
  }

  render() {
    const employmentTypesList = [
      {
        label: 'Full Time',
        employmentTypeId: 'FULLTIME',
      },
      {
        label: 'Part Time',
        employmentTypeId: 'PARTTIME',
      },
      {
        label: 'Freelance',
        employmentTypeId: 'FREELANCE',
      },
      {
        label: 'Internship',
        employmentTypeId: 'INTERNSHIP',
      },
    ]
    const salaryRangesList = [
      {
        salaryRangeId: '1000000',
        label: '10 LPA and above',
      },
      {
        salaryRangeId: '2000000',
        label: '20 LPA and above',
      },
      {
        salaryRangeId: '3000000',
        label: '30 LPA and above',
      },
      {
        salaryRangeId: '4000000',
        label: '40 LPA and above',
      },
    ]
    const {searchInput, activeEmploymentId, activeSalaryId} = this.state
    return (
      <div className="jobsDiv1">
        <Header />
        <div className="jobsDiv2">
          <Filters
            searchInput={searchInput}
            resetFilters={this.resetFilters}
            activeEmploymentId={activeEmploymentId}
            activeSalaryId={activeSalaryId}
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            changeEmploymentType={this.changeEmploymentType}
            changeSalaryRange={this.changeSalaryRange}
            changeSearchInput={this.changeSearchInput}
          />
          {this.renderAll()}
        </div>
      </div>
    )
  }
}

export default Jobs
