from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from datetime import datetime
from app.models import Phase, Issue, db
from app.forms import PhaseForm, IssueForm
from .auth_routes import validation_errors_to_error_messages

project_routes = Blueprint('projects', __name__)


@project_routes.route("/issues/<int:issue_id>")
# @login_required
def get_one_issue(issue_id):
  # print("---GET ONE ISSUE---ISSUE_ID:", issue_id)
  issue = Issue.query.get(issue_id)
  # print("---GET ONE ISSUE---ISSUE:", issue)
  if issue:
    return issue.to_dict(), 200
  else:
    return {"error": "Issue couldn't be found", "statusCode": 404}

# fetch("http://localhost:3000/api/projects/issues/1", {
#   method: 'GET',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)


@project_routes.route("/")
# @login_required
def get_all_phases_issues():
  all_phases = Phase.query.all()
  # phases = [phase.to_dict_all() for phase in all_phases]
  # print("====GETALLPHASESISSUES=====", all_phases)
  if all_phases:
    return {"AllPhases":[phase.to_dict_all_phase() for phase in all_phases]}, 200

# fetch("http://localhost:3000/api/projects/", {
#   method: 'GET',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)


@project_routes.route("/phases/<int:phase_id>/issues", methods=["POST"])
@login_required
def create_issue(phase_id):
  form = IssueForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  # print("---CREATE ISSUE---description:", form.data["description"])
  # print("---CREATE ISSUE---SUMMARY:", form.data["summary"])
  # print("---CREATE ISSUE---PHASE_ID:", form.data["phase_id"])
  # print("---CREATE ISSUE---OWNER_ID:", form.data["owner_id"])
  if form.validate_on_submit():
    new_issue = Issue(
      summary = form.data["summary"],
      description = form.data["description"],
      phase_id = form.data["phase_id"],
      owner_id = form.data["owner_id"],
      created_at= datetime.now()
    )
    # print("---CREATE ISSUE---new_issue:", new_issue)
    db.session.add(new_issue)
    db.session.commit()

    return new_issue.to_dict(), 201
  else:
    # print("---CREATE ISSUE---FORM ERRORS:", form.errors)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

# fetch("http://localhost:3000/api/projects/phases/3/issues", {
#   method: 'POST',
#   body: JSON.stringify({
#    "summary": "new issue",
#    "description": "new description",
#    "phase_id": 3,
#    "owner_id": 2
#   }),
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)


@project_routes.route("/issues/<int:issue_id>", methods=["PUT"])
@login_required
def update_issue(issue_id):
  form = IssueForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  issue = Issue.query.get(issue_id)
  if issue is None:
    return {"errors" : "Issue couldn't be found"}, 404
  print("---UPDATE ISSUE---new_issue:", issue)
  print("---UPDATE ISSUE---phase_id/onwer_id:", form.data['phase_id'], form.data["owner_id"])
  if form.validate_on_submit():
    issue.summary = form.data['summary']
    issue.description = form.data['description']
    issue.phase_id = form.data['phase_id']
    issue.owner_id = form.data["owner_id"]
    issue.updated_at = datetime.now()
    db.session.commit()
    return issue.to_dict(), 200
  else:
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


# fetch("http://localhost:3000/api/projects/issues/6", {
#   method: 'PUT',
#   body: JSON.stringify({
#    "summary": "edit issue",
#    "description": "edit description",
#    "phase_id": 4,
#    "owner_id": 3
#   }),
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)

@project_routes.route("/issues/<int:issue_id>", methods=["DELETE"])
@login_required
def delete_issue(issue_id):
  issue = Issue.query.get(issue_id)

  if current_user.is_admin == True:
    db.session.delete(issue)
    db.session.commit()

    return jsonify({
      "message": "Issue is successfully deleted!",
      "status_code": 200
    }), 200

  else:
    return jsonify({
      "errors": "Unauthorized! You are not the admin of this board!"
    }), 403

# fetch("http://localhost:3000/api/projects/issues/6", {
#   method: 'DELETE',
#   headers: {
#     'Content-type': 'application/json'
#   }
# })
# .then(res => res.json())
# .then(console.log)
