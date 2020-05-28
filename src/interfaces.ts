export interface Variables {
  [name: string]: string | number
}

interface Job<Stages, JobNames> {
  name: JobNames
  stage: Stages
  variables?: Variables
  script: string[]
  waitFor: JobNames[]
}

export enum CI {
  GITLAB_CI = 'GITLAB_CI',
  GITHUB_ACTIONS = 'GITHUB_ACTIONS',
  CIRCLE_CI = 'CIRCLE_CI',
  TRAVIS_CI = 'TRAVIS_CI',
  JENKINS_CI = 'JENKINS_CI',
}

export interface CIConfig<Stages = any, JobNames = any> {
  variables?: Variables
  stages: Stages[]
  jobs: Job<Stages, JobNames>[]
}

export interface CreateCIOptions<Stages = any, JobNames = any> {
  ci: CI
  outputFile: string
  config: CIConfig<Stages, JobNames>
}
