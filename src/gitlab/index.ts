import Yaml from 'yaml'
import { fromPairs, pickBy, identity } from 'lodash'

import { CIConfig } from '~/interfaces'

import { GitlabConfig } from './interfaces'

export const createGitlabCI = <Stages, JobNames>(
  config: CIConfig<Stages, JobNames>,
): string => {
  const { jobs, ...output }: GitlabConfig<Stages, JobNames> = {
    stages: config.stages,
    jobs: fromPairs(
      config.jobs.map((job) => {
        const value = pickBy(
          {
            stage: job.stage,
            variables: job.variables,
            needs: job.waitFor,
            script: job.script,
          },
          identity,
        )

        return [job.name, value]
      }),
    ),
  }

  if (config.variables) output.variables = config.variables

  return Yaml.stringify({
    ...output,
    ...jobs,
  })
}
