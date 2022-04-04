const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const FormData = require('form-data')
const chalk = require('chalk')
const inquirer = require('inquirer')

const { logNodeStatus, logNodeProperties } = require('../../../util/logNode')
const { isValidHardwareId } = require('../../../util/validation')

const nodeCommands = [
  'status',         'properties',  'delete', 
  'bind',           'cancel',      'resume',
  'configurations', 'siteinstall', 'back',
  'exit'
]

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
  const {  data: { statusEntries } } = await this.httpClient.request(axiosConfig)
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


async function bindNode() {
  const hardwareId = await inquirer.prompt([
		{
		  type: 'input',
		  name: 'value',
		  suffix: chalk.bgGreen('?'),
		  message: 'Type hardwareId',
		  validate: input => isValidHardwareId(input),
		}
	])
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Binding ${hardwareId} to ${nodeId}...`,
    method: 'put',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/actions/bind`,
    data: {
      hardwareId,
    },
  }
  const { statusText } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Binding ${statusText}`))
}


async function cancelNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Canceling ${nodeId}...`,
    method: 'post',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/actions/cancel`,
  }
  const { statusText } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Canceling ${statusText}`))
}


async function resumeNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const axiosConfig = {
    text: `Resuming ${nodeId}...`,
    method: 'post',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/actions/resume`,
  }
  const { statusText } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Resuming ${statusText}`))
}


async function configurationsNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const fileNameInput = await inquirer.prompt([{
    type: 'file-tree-selection',
    name: 'nodeFile',
    message: 'Choose a node file...',
  }])
  const formData = new FormData()
  formData.append('file', fs.createReadStream(fileNameInput.nodeFile))
  const axiosConfig = {
    text: `Uploading ${nodeId} configuration to ${projectId}...`,
    method: 'put',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/configurations`,
    headers: formData.getHeaders(),
    data: formData
  }
  const { statusText } = await this.httpClient.request(axiosConfig)
  console.log(chalk.bgGreen(`Resuming ${statusText}`))
}


async function siteinstallNode() {
  const { projectId } = this.projects[this.projectIndex]
  const nodeId = this.nodes[this.nodeIndex]
  const saveFileName = path.join(process.cwd(), `Site_Install_${nodeId}.xml`)
  const axiosConfig = {
    text: `Downloading site install file ${nodeId}...`,
    method: 'get',
    url: `${this.appUrl}/projects/${projectId}/nodes/${nodeId}/configurations/siteinstall`,
  }
  const { data } = await this.httpClient.request(axiosConfig)
  await fsPromises.writeFile(saveFileName, data)
  console.log(chalk.bgGreen(`Download site install file to ${saveFileName}`))
}


module.exports = {
  getNode,
  getNodeStatus,
  getNodeProperties,
  bindNode,
  cancelNode,
  resumeNode,
  configurationsNode,
  siteinstallNode
}