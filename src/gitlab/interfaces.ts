import { Variables } from '~/interfaces'

interface GitlabJob<Stages, JobNames> {
  stage: Stages
  variables?: Variables
  needs: JobNames[]
  script: string[]
}

export interface GitlabConfig<Stages, JobNames> {
  variables?: Variables
  stages: Stages[]
  jobs: {
    [jobName: string]: GitlabJob<Stages, JobNames>
  }
}
