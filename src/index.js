const core = require('@actions/core')
const gh = require('@actions/github')
const time = require('./time')
const execute = require('./execute')

const tempDir = './_temporary_'

const deploy = async (message, target, info) => {
  console.log(`mkdir ${tempDir}`)
  await execute(`mkdir ${tempDir}`)
  await execute('ls')

  console.log('git initialize...')
  await execute('git init', tempDir)
  await execute(`git config user.name "${info.name}"`, tempDir)
  await execute(`git config user.email "${info.email}"`, tempDir)

  console.log('git remote add...')
  let token = info.accessToken
  if (token === '') {
    token = `x-access-token:${info.githubToken}`
  }
  await execute(`git remote add origin https://${token}@github.com/${target.repository}.git`, tempDir)
  await execute('git pull origin master', tempDir)

  console.log('move deploy files...')
  await execute(`rm -rf ./*`, tempDir)
  await execute(`rsync -a ./${target.folder}/ ${tempDir}/`)

  console.log('git push files...')
  await execute('git add .', tempDir)
  await execute(`git commit -m "${message}"`, tempDir)
  await execute('git push -u -f origin master', tempDir)
}

try {
  const target = {
    folder: core.getInput('FOLDER'),
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
      core.setFailed(error.message)
    })

} catch (error) {
  core.setFailed(error.message)
}
