const { logNodeStatus, logNodeProperties } = require('../../../util/logNode')

const nodeCommands = ['status', 'properties', 'delete', 'bind', 'cancel', 'resume', 'configurations', 'siteinstall', 'back', 'exit']

async function getNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  this.commands = nodeCommands
  this.choices = this.nodes.filter(item => item !== nodeId)
  return `${projectId} (${nodeId}) `
}


async function getNodeStatus() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Getting ${nodeId}'s status...`,
    method: 'get',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}`
  }
  const { data: { statusEntries } } = await this.httpClient.request(axiosConfig)
  logNodeStatus(statusEntries)
}


async function getNodeProperties() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Getting ${nodeId}'s properties...`,
    method: 'get',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}?filter=properties`
  }
  const { data: { attributes, attributeGroups } } = await this.httpClient.request(axiosConfig)
  logNodeProperties(attributes, attributeGroups)
}


module.exports = { getNode, getNodeStatus, getNodeProperties }