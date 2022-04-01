const chalk = require('chalk')


function logNodeStatus(statusEntries, indent = 6) {
  console.log('')
  statusEntries.forEach(entry => {
    const { task, progress, timestamp, additionalInfo } = entry
    console.log(`${' '.repeat(indent)}${chalk.cyan(task)} ${progress} at ${chalk.italic.gray(timestamp)}${additionalInfo && '\n' + ' '.repeat(indent + 2) + chalk.dim(additionalInfo.trim())}`)
  })
  console.log('')
}


function logNodeProperties(attributes, attributeGroups, indent = 6) {
  console.log('')
  logAttributes(attributes)
  console.log('')
  attributeGroups.forEach(attributeGroup => {
    const { type, properties } = attributeGroup
    console.log(`${' '.repeat(indent)}${chalk.bold.yellow(type)}🔽`)
    logAttributes(properties, 8)
    console.log('')
  })
}


function logAttributes(attributes, indent = 6) {
  attributes.forEach(attribute => {
    const { name = 'value', value } = attribute
    console.log(`${' '.repeat(indent)}${chalk.bold.cyan(name)}: ${value}`)
  })
}


module.exports = { logNodeStatus, logNodeProperties }