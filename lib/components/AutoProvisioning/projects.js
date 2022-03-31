const chalk = require('chalk')
const logProject = require('../../../util/logProject')


async function getProjects() {
  const axiosConfig = {
    text: 'Getting projects...',
    method: 'get',
    url: `${this.appUrl}/projects`
  }
  const response = await this.httpClient.request(axiosConfig)
  this.projects = response.data
  this.choices = projectsChoices(this.projects)
}


async function getProjectData(projectId) {
  const axiosConfig = {
    text: `Getting ${projectId}'s status...`,
    method: 'get',
    url: `${this.appUrl}/projects/${projectId}`
  }
  const { data: { nodeSummary } } = await this.httpClient.request(axiosConfig)
  axiosConfig.text = `Getting ${projectId}'s properties...`
  axiosConfig.url +=  '?filter=properties'
  const { data } = await this.httpClient.request(axiosConfig)
  logProject(data, nodeSummary)
  this.choices = ['back', 'delete', 'exit']
}


async function deleteProject(projectId) {
  const axiosConfig = {
    text: `Deleting project ${projectId}...`,
    method: 'delete',
    url: `${this.appUrl}/projects/${projectId}`
  }
  const { data: { statusText } } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Delete ${statusText}`))
  this.choices = projectsChoices(this.projects)
}


function projectsChoices(projects) {
  return this.projectsCommands.concat(projects.map(project => {
    const {
      projectId,
      numberOfNodes,
      integrationPhaseSummary: {
        cancelled,
        failed,
        inProgress,
        successful,
        suspended,
      },
    } = project
    const statusList = [
      successful && successful + '✔',
      inProgress && inProgress + '⌛',
      suspended && suspended + '⏸',
      cancelled && cancelled + '❌',
      failed && failed + '⛔',
    ]
    return `${chalk.bold(projectId)}${' '.repeat(Math.max(14, projectId.length + 2) - projectId.length)}(${numberOfNodes}) ${statusList.filter(item => item).join(' ')}`
  }))
}


module.exports = { getProjects, getProjectData, deleteProject }