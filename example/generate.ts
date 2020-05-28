import { createCI, CI } from 'universal-ci'

import { config } from './config'

createCI({
  ci: CI.GITLAB_CI,
  outputFile: '.gitlab.yml',
  config,
})
