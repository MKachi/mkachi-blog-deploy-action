const {
  exec
} = require("@actions/exec")

let result = ''

const stdout = (data) => {
  result += data.toString().trim()
}

const execute = async (command, path = null) => {
  let option = {
    listeners: {
      stdout
    }
  }

  if (path !== null) {
    option['cwd'] = path
  }
  await exec(command, [], option)

  return Promise.resolve(result)
}

module.exports = execute
