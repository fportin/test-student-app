import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkUpdateIssue, thunkGetOneIssue, thunkGetAllPhasesIssues, cleanState } from "../../../store/issue";
import { loadAllUsers } from '../../../store/session';
import "../../CSS/UpdateIssues.css"

const UpdateIssueForm = ({currIssue, currPhase}) => {
  const dispatch = useDispatch();
  const currUser = useSelector(state => state.session.user)
  const allUsersArr = useSelector(state => state.session.AllUsers?.users)
  const allPhases = useSelector(state => state.issues.AllPhases)
  const allPhasesArr = Object.values(allPhases)
  const singleIssue = useSelector(state => state.issues.singleIssue)
  const issueId = currIssue.issueId;
  const phaseTitle = currPhase.title

  const currSummary = singleIssue.summary;
  const currDescription = singleIssue.description;
  const currPhaseId = singleIssue.phaseId;
  const currAssigneeId = singleIssue.ownerId;

  const [summary, setSummary] = useState(currSummary);
  const [summaryInput, setSummaryInput] = useState(false);
  const [summaryErrors, setSummaryErrors] = useState([]);
  const [description, setDescription] = useState(currDescription);
  const [descriptionInput, setDescriptionInput] = useState(false);
  const [descriptionErrors, setDescriptionErrors] = useState([]);
  const [phaseId, setPhaseId] = useState();
  const [assigneeId, setAssigneeId] = useState(currIssue.ownerId)
  const [errors, setErrors] = useState([]);

  // console.log("UPDATE ISSUE- currPhase:", currPhase)
  console.log("UPDATE ISSUE- currIssue:", currIssue)

  useEffect(() => {
    dispatch(thunkGetOneIssue(parseInt(issueId)))
    dispatch(loadAllUsers())
    dispatch(thunkGetAllPhasesIssues())
    return () => {
      dispatch(cleanState())
    }
  }, [dispatch, issueId])


  const showSummary = async (e) => {
    setSummary(currIssue.summary)
    setDescription(currIssue.description)
    setSummaryInput(true)
  }

  const handleSummary = async (e) => {
    e.preventDefault()
    setSummaryErrors([])

    const issue = {
      summary,
      description: currDescription,
      phaseId: currPhaseId,
      assigneeId: currAssigneeId
    }

    // console.log("UPDATE ISSUE handleSummary-issue:", issue)

    const response = await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
    // console.log("UPDATE ISSUE handleSummary-response:", response)
    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      setSummaryErrors(errorsArr)
    }

    if (response.issueId) {
      setSummaryInput(false)
      dispatch(thunkGetAllPhasesIssues())
    }
  }

  const handleDescription = async (e) => {
    e.preventDefault()
    setDescriptionErrors([])
    const issue = {
      summary: currSummary,
      description,
      phaseId: currPhaseId,
      assigneeId: currAssigneeId
    }
    // console.log("UPDATE ISSUE handleDescription-issue:", issue)
    const response = await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
    // console.log("UPDATE ISSUE-response:", response)
    let errorsArr = []
    if(response.errors) {
      let errorMsg = response.errors[0].slice(response.errors[0].indexOf(':')+1, response.errors[0].length)
      errorsArr.push(errorMsg)
      setDescriptionErrors(errorsArr)
    }

    if (response.issueId) {
      setDescriptionInput(false)
    }
  }

  // let phaseNameOnStage = currIssue.Phase?.title

  // const handleSubmit = async (e) => {
  //   e.preventDefault()

  //   const issue = {
  //     summary: currSummary,
  //     description: currDescription,
  //     phaseId: phaseId ? phaseId : currPhaseId,
  //     assigneeId
  //   }
  //   console.log("UPDATE ISSUE-handleSubmit-issue:", issue)
  //   dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
    // .then(res => phaseNameOnStage = res.Phase.title)
    // console.log("UPDATE ISSUE-response:", response)
    // history.push('/projects')
    // setShowModal(false)
  // }

  const handleAssigneeId = async (e) => {
    e.preventDefault()
    console.log("UPDATE ISSUE-handleAssigneeId-e.target.value:", e.target.value)
    // setAssigneeId(e.target.value)
    const issue = {
      summary: currSummary,
      description: currDescription,
      phaseId: phaseId ? phaseId : currPhaseId,
      assigneeId: Number(e.target.value)
    }
    console.log("UPDATE ISSUE-handleAssigneeId-issue:", issue)
    const response = await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
    dispatch(thunkGetAllPhasesIssues())
  }

  const handlePhaseId = async (e) => {
    e.preventDefault()
    const issue = {
      summary: currSummary,
      description: currDescription,
      phaseId: Number(e.target.value),
      assigneeId: currAssigneeId
    }
    console.log("UPDATE ISSUE-handleAssigneeId-issue:", issue)
    const response = await dispatch(thunkUpdateIssue(issueId, issue, currPhaseId))
    if (response.issueId) {
      // dispatch(thunkGetAllPhasesIssues())
      setDescriptionInput(false)
    }
  }

  return (
    <div className="update-issue-main-container">
      <div className="update-issue-left-container">
        <div className="update-issue-title">{phaseTitle}<span>{" / "}</span><span>Issue #{issueId}</span></div>

        <div className="update-issue-summary-errors">
          {
          summaryErrors &&
          summaryErrors.map((error)=>(<div key={error}>{error}</div>))
          }
        </div>
        {!summaryInput
        ? <div className="update-issue-summary" onClick={showSummary}><span>{currSummary}</span></div>
        : <div className="update-issue-summary-input-container">
          <form onSubmit={handleSummary} id="summary-form">
            <div>
              <input
                type="text"
                value={summary}
                required
                onChange={(e) => setSummary(e.target.value)}
                className="update-issue-summary-input"
              />
            </div>
            <div className="update-issue-summary-button-container">
              <button type="submit" className="update-issue-summary-button"><i className="fa-sharp fa-solid fa-check"></i></button>
              <button  className="update-issue-summary-button" onClick={() =>{
                setSummaryErrors([])
                setSummary(currSummary)
                setSummaryInput(false)
                }}>
                <i className="fa-sharp fa-solid fa-xmark"></i></button>
            </div>
          </form>
          </div>
        }

        <div className="update-issue-description">
          <label className="update-issue-description-label">Description</label>
          <div className="update-issue-description-errors">
            {
            descriptionErrors &&
            descriptionErrors.map((error)=>(<div key={error}>{error}</div>))
            }
          </div>
          {!descriptionInput &&
            <div onClick={() => setDescriptionInput(true)} className="update-issue-description-placeholder">
              {currDescription
              ? <div>{currDescription}</div>
              : <div>Add a description...</div>}
            </div>}
          {descriptionInput && <form className="update-issue-description-input-container" onSubmit={handleDescription}>
            <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="update-issue-description-input"
            />
            <div className="update-issue-description-button-container">
              <button className="update-issue-description-save">Save</button>
              <div className="update-issue-description-cancel" onClick={() =>{
                setDescriptionErrors([])
                setDescription(currDescription)
                setDescriptionInput(false)
                }}>Cancel</div>
            </div>
          </form>}
        </div>

        <div className="update-issue-time-container">
          <div className="update-issue-time-inner">Created at: {new Date(currIssue.createdAt).toString().slice(3,-33)}</div>
          <div className="update-issue-time-inner">Updated at: {new Date(currIssue.updatedAt).toString().slice(3,-33)}</div>
        </div>
      </div>

      <div className="update-issue-right-container">
          <div>
            <select
              name="phaseId"
              value={phaseId}
              onChange={handlePhaseId}
              className="update-issue-right-phase-selector"
            >
            {allPhasesArr?.map((phase, i) => phase.id === currPhaseId ? <option value={currPhaseId} selected key={i}>{phase.title}</option> : <option value={Number(phase.id)} key={i}>{phase.title}</option>)}
            </select>
          </div>

          <div className="update-issue-right-assignee-reporter">
            <div className="update-issue-assignee">
              <div className="update-issue-label-container">
                <label>Assignee</label>
              </div>
              <div>
                <select
                  name="assigneeId"
                  value={assigneeId}
                  className="update-issue-assignee-select"
                  onChange={handleAssigneeId}
                >
                <option disabled selected value={Number(assigneeId)}>
                  {currIssue?.user?.first_name[0].toUpperCase() +currIssue?.user?.first_name.slice(1) + " " + currIssue?.user?.last_name[0].toUpperCase() +currIssue?.user?.last_name.slice(1)}
                </option>
                {allUsersArr?.map((user, i) => {
                  return (
                    user.id !== currIssue.ownerId &&
                    <option value={Number(user.id)} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>
                    )
                  })}
                </select>
              </div>
            </div>

            <div className="update-issue-reporter">
              <div className="update-issue-label-container">
                <label>Reporter</label><i className="fa-solid fa-asterisk"></i>
              </div>
              <div>
                <select
                  name="reporter"
                  className="update-issue-assignee-select"
                  // onChange={(e) => setAssigneeId(e.target.value)}
                >
                <option disabled selected>{currUser.first_name[0].toUpperCase() + currUser.first_name.slice(1) + " " + currUser.last_name[0].toUpperCase() + currUser.last_name.slice(1)}</option>
                {/* {allUsersArr?.map((user, i) => <option value={user.id} key={i}>{user.first_name[0].toUpperCase() + user.first_name.slice(1) + " " + user.last_name[0].toUpperCase() + user.last_name.slice(1)}</option>)} */}
                </select>
              </div>
            </div>
          </div>
          {/* <button>Submit</button> */}

        {/* </form> */}
      </div>
    </div>
  )
}

export default UpdateIssueForm;
