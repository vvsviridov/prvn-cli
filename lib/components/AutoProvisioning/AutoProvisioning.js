const ENM = require('../ENM/ENM')

const { getProjects, getProjectData, deleteProject } = require('./projects')

class AutoProvisioning extends ENM {
  constructor(username, password, url) {
    super(username, password, url)

    this.appUrl = '/auto-provisioning/v1'
    this.projects = null
    this.projectsCommands = ['new', 'exit']
    this.choices = null
  }

  async getProjects() {
    await getProjects.call(this)
  }

  async getProjectData(projectId) {
    await getProjectData.call(this, projectId)
  }

  async deleteProject(projectId) {
    await deleteProject.call(this, projectId)
  }

  async next(input) {
    const filter = input ? input : ''
    return this.choices.filter(
      proj => proj.toLowerCase().includes(filter.toLowerCase())
    )
  }

}


module.exports = AutoProvisioning