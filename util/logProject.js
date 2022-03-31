const chalk = require('chalk')


function logProject(data, nodeSummary) {
  const {
    id: projectId,
    description,
    creator,
    creationDate,
    nodes,
  } = data
  console.log(`
    ${chalk.bold.greenBright(projectId)}
    ${chalk.underline(creator)}
    ${chalk.dim.gray(creationDate)}
    ${description}`)
  nodes.forEach(node => {
    const { id: nodeId, type, identifier, ipAddress } = node
    const { status, state } = nodeSummary.find(item => item.id === nodeId)
    console.log(`      ${chalk.cyan(nodeId)}
      ${type}
      ${identifier}
      ${ipAddress}
      ${status}
      ${state}
    `)
  })
}


module.exports = logProject