const chalk = require('chalk')


function logNodeStatus(statusEntries, indent = 6) {
  if (!statusEntries) {
    throw new Error('No node status entries!')
  }
  console.log('')
  statusEntries.forEach(entry => {
    const { task, progress, timestamp, additionalInfo } = entry
    const addInfo = additionalInfo ? additionalInfo.trim().split('\n') : null
    console.log(`${' '.repeat(indent)}${chalk.cyan(task)} ${progress} at ${chalk.italic.gray(timestamp)}`)
    if (addInfo) {
      addInfo.forEach(info => {
        console.log(`${' '.repeat(indent + 2) + chalk.dim(info)}`)
      })
    }
  })
  console.log('')
}


function logNodeProperties(attributes, attributeGroups, indent = 6) {
  if (!attributeGroups) {
    throw new Error('No node attribute groups!')
  }
  console.log('')
  logAttributes(attributes)
  console.log('')
  attributeGroups.forEach(attributeGroup => {
    const { type, properties } = attributeGroup
    console.log(`${' '.repeat(indent)}${chalk.bold.yellow(type + '↓')}`)
    logAttributes(properties, 8)
    console.log('')
  })
}


function logAttributes(attributes, indent = 6) {
  if (!attributes) {
    throw new Error('No node attributes!')
  }
  attributes.forEach(attribute => {
    const { name = 'value', value } = attribute
    console.log(`${' '.repeat(indent)}${chalk.bold.cyan(name)}: ${value}`)
  })
}


module.exports = { logNodeStatus, logNodeProperties }