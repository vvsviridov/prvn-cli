const inquirer = require('inquirer')

const ENM = require('../ENM/ENM')

const { getProjects, getProjectData, deleteProject, newProject } = require('./projects')
const { getNode, getNodeStatus, getNodeProperties } = require('./nodes')

class AutoProvisioning extends ENM {
  constructor(username, password, url) {
    super(username, password, url)

    this.appUrl = '/auto-provisioning/v1'
    this.projects = null
    this.projectIndex = -1
    this.nodes = null
    this.nodeIndex = -1
    this.commands = null
    this.choices = null
  }

  async getProjects() {
    return await getProjects.call(this)
  }

  async getProjectData(projectId) {
    return await getProjectData.call(this, projectId)
  }

  async newProject() {
    await newProject.call(this)
  }

  async deleteProject() {
    await deleteProject.call(this)
  }

  async getNode() {
    return await getNode.call(this)
  }

  async getNodeStatus() {
    await getNodeStatus.call(this)
  }

  async getNodeProperties() {
    await getNodeProperties.call(this)
  }

  async next(input) {
    const filter = input ? input : ''
    return [new inquirer.Separator()]
      .concat(this.commands.map(cmd => `[${cmd}]`).filter(command => command.toLowerCase().includes(filter.toLowerCase()))
      .concat([new inquirer.Separator()])
      .concat(this.choices.filter(choice => choice.toLowerCase().includes(filter.toLowerCase()))))
  }

}


module.exports = AutoProvisioning