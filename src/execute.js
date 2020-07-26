const {
  exec
} = require("@actions/exec")

let result = ''

const stdout = (data) => {
  result += data.toString().trim()
}

const execute = async (command) => {
  await exec(command, [], {
    listeners: {
      stdout
    }
  })

  return Promise.resolve(result)
}

module.exports = execute
