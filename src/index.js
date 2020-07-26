const core = require('@actions/core')
const gh = require('@actions/github')

try {} catch (error) {
  core.setFailed(error.message)
  console.log(`Error : ${error.message}`)
}
