const inquirer = require('inquirer')
const chalk = require('chalk')

const logError = require('../../../util/logError')
const { isEmpty } = require('../../../util/validation')


inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))


// function buildPrompt(fdn) {
//   if (fdn.length >= 67) {
//     return { prefix: '...', prompt: fdn.slice(-65) }
//   }
//   return { prefix: '', prompt: fdn }
// }


// function commndUp(tplg, fdn) {
//   if (tplg.up()) {
//     fdn = fdn.split(',').slice(0,-1).join(',')
//   } else {
//     console.log('There\'s no way up!'.yellow)
//   }
//   return fdn
// }


async function commandOther(prvn, fdn, command) {
  const projectIndex = prvn.choices.indexOf(command) - prvn.projectsCommands.length
  if (projectIndex !== -1) {
    fdn = prvn.projects[projectIndex].projectId
    await prvn.getProjectData(fdn)
  // } else if (prvn.setAttribute(command)) {
  //   fdn = fdn.replace(/\((\w+)\)/g, `(${command})`)
  } else {
    console.log('Command Unrecognized❗'.red)
  }
  return fdn
}


async function handleCommand(prvn, fdn, command) {
  const [cmd, param] = command.split(/\s+/)
  switch (cmd) {
    case 'exit':
      return
    case 'back':
      await prvn.getProjects()
      break
    case 'delete':
      await prvn.deleteProject()
      break
  
    default:
      fdn = await commandOther(prvn, fdn, command)
  }
  return fdn
}


async function inputHandlerLoop(prvn) {
  await prvn.getProjects()
  let prompt = ' '
  let prefix = ''
  while (true) {
    try {
      const input = await inquirer.prompt([
        {
          type: 'autocomplete',
          name: 'command',
          message: chalk.bold.blue(prompt),
          pageSize: 10,
          prefix: chalk.bold.grey(prefix),
          suffix: chalk.bold.blue('>'),
          validate: isEmpty,
          source: async (answers, input) => await prvn.next(input)
        }
      ])
      prompt = await handleCommand(prvn, prompt, input.command)
      if (!prompt) break
    //   ({ prefix, prompt } = buildPrompt(fdn))
    } catch (error) {
      logError(error)
    }
  }
}


async function inputHandler(prvn) {
  try {
    await inputHandlerLoop(prvn)
  } catch (error) {
    logError(error)
  }
}


module.exports = inputHandler