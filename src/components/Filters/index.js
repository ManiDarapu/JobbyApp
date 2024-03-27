import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

const statusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}
class Filters extends Component {
  state = {status: statusConstants.initial, profile: {}}

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({status: statusConstants.inprogress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const fetchedData = data.profile_details
      const updatedData = {
        name: fetchedData.name,
        profileImageUrl: fetchedData.profile_image_url,
        shortBio: fetchedData.short_bio,
      }
      this.setState({status: statusConstants.success, profile: updatedData})
    } else {
      this.setState({status: statusConstants.failure})
    }
  }

  renderInprogressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="red" height="50" width="50" />
    </div>
  )

  retryApi = () => this.getProfile()

  renderFailureView = () => (
    <div>
      <button type="button" onClick={this.retryApi}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {profile} = this.state
    const {name, profileImageUrl, shortBio} = profile
    return (
      <div className="profileImg">
        <div className="profile2">
          <img src={profileImageUrl} alt="profile" />
          <h1>{name}</h1>
        </div>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfile = () => {
    const {status} = this.state
    switch (status) {
      case statusConstants.failure:
        return this.renderFailureView()
      case statusConstants.inprogress:
        return this.renderInprogressView()
      case statusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  renderEmploymentType = () => {
    const {employmentTypesList} = this.props
    return employmentTypesList.map(each => {
      const {changeEmploymentType} = this.props
      const onClickEmploymentType = () => {
        changeEmploymentType(each.employmentTypeId)
      }
      return (
        <li onClick={onClickEmploymentType} key={each.employmentTypeId}>
          <label>
            <input type="checkbox" name="checkbox" value={each.label} />
            {each.label}
          </label>
        </li>
      )
    })
  }

  renderSalaryRange = () => {
    const {salaryRangesList} = this.props
    return salaryRangesList.map(each => {
      const {changeSalaryRange} = this.props
      const onClickSalaryRange = () => {
        changeSalaryRange(each.salaryRangeId)
      }
      return (
        <li onClick={onClickSalaryRange} key={each.salaryRangeId}>
          <label>
            <input type="radio" name="radio" value={each.label} />
            {each.label}
          </label>
        </li>
      )
    })
  }

  render() {
    const {changeSearchInput, resetFilters} = this.props
    const onChangeSearch = event => {
      changeSearchInput(event.target.value)
    }
    const onClickReset = () => {
      resetFilters()
    }
    return (
      <div className="filtersDiv1">
        {this.renderProfile()}
        <label htmlFor="searchInput" />
        <div className="filtersInput">
          <input
            id="searchInput"
            type="search"
            className="filtersInput2"
            onChange={onChangeSearch}
            placeholder="Search..."
          />
          <button
            type="button"
            data-testid="searchButton"
            aria-label="Search"
            className="filtersInput2"
          >
            <BsSearch />
          </button>
        </div>
        <div>
          <h4>Type of Employment</h4>
          <ul className="filtersUl">{this.renderEmploymentType()}</ul>
        </div>
        <hr />
        <div>
          <h4>Salary Range</h4>
          <ul className="filtersUl">{this.renderSalaryRange()}</ul>
        </div>
        <button type="button" className="reset" onClick={onClickReset}>
          Reset
        </button>
      </div>
    )
  }
}

export default Filters
