const core = require('@actions/core')
const gh = require('@actions/github')
const time = require('./time')
const execute = require('./execute')
const path = require('path')

const tempDir = '__temp__deploy__'

const deploy = async (message, target, info) => {
  await execute(`mkdir ${tempDir}`)
  await execute(`cd ${tempDir}`)

  await execute('git init')
  await execute(`git config user.name "${info.name}"`)
  await execute(`git config user.email "${info.email}"`)

  let token = info.accessToken
  if (token === '') {
    token = `x-access-token:${info.githubToken}`
  }
  await execute(`git remote add origin https://${token}@github.com/${target.repository}.git`)
  await execute('git pull -f')

  await execute(`git checkout ${target.branch}`)
  await execute(`rm -rf ./*`)
  await execute(`mv ${target.folder}/* ./`)

  await execute('git add .')
  await execute(`git commit -m "${message}"`)
  await execute('git push -u -f origin master')
}

try {
  const target = {
    folder: path.resolve('../', core.getInput('FOLDER')),
    branch: core.getInput('BRANCH'),
    repository: gh.context.payload.repository.full_name
  }

  const info = {
    accessToken: core.getInput('ACCESS_TOKEN'),
    githubToken: core.getInput('GITHUB_TOKEN'),
    name: gh.context.payload.pusher.name,
    email: gh.context.payload.pusher.email,
  }

  const message = `[Deploy] 🚀 ${time()}`
  deploy(message, target, info).then(() => {
      console.log('Deploy Success!')
      console.log(message)
    })
    .catch(error => {
      throw error
    })

} catch (error) {
  core.setFailed(error.message)
  console.log(`Error : ${error.message}`)
}
