/* eslint-disable jsx-a11y/img-redundant-alt */
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'INPROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getItem()
  }

  getItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const {match} = this.props
    const {id} = match.params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedJob = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const updatedSkills = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const updatedLife = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      const updatedSimilar = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedJob,
        skills: updatedSkills,
        lifeAtCompany: updatedLife,
        similarJobs: updatedSimilar,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderInprogressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="red" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failureView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button">Retry</button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, skills, lifeAtCompany, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <div className="jobDiv1">
        <Header />
        <div className="jobDiv2">
          <div className="jobDiv3">
            <div className="logoDiv">
              <img src={companyLogoUrl} alt="job details company logo" />
              <div className="titleDiv">
                <h1>{title}</h1>
                <div className="starsData">
                  <p>
                    Rating: {rating}
                    <AiFillStar />{' '}
                  </p>
                  <p>Location: {location}</p>
                  <p>Type: {employmentType}</p>
                  <p>Salary: {packagePerAnnum}</p>
                  <a href={companyWebsiteUrl}>Website</a>
                </div>
              </div>
            </div>
            <hr />
            <h1>Description</h1>
            <p>{jobDescription}</p>
            <h1>Skills</h1>
            <ul className="skillsUl">
              {skills.map(each => (
                <li className="skillsli" key={each.name}>
                  <img src={each.imageUrl} alt="skill image" />
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>

            <div className="lifeDiv">
              <div>
                <h1>Life at Company</h1>
                <p>{lifeAtCompany.description}</p>
              </div>
              <img src={lifeAtCompany.imageUrl} alt="lifeAtCompany Image" />
            </div>
          </div>
          <h1>Similar Jobs</h1>
          <ul className="jobUl">
            {similarJobs.map(each => (
              <li className="jobLi" key={each.id}>
                <Link to={`/jobs/${each.id}`} className="jobLink">
                  <div className="similarLi">
                    <img
                      src={each.companyLogoUrl}
                      alt="similarJobUrl"
                      className="similarLogo"
                    />
                    <div>
                      <h1>{each.title}</h1>
                      <p>Rating: {each.rating}</p>
                    </div>
                  </div>
                  <h1>Description</h1>
                  <p>{each.jobDescription}</p>
                  <div>
                    <p>Location: {each.location}</p>
                    <p>Employment Type: {each.employmentType}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
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
}

export default withRouter(JobItemDetails)
