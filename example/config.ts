import { CIConfig } from 'universal-ci'

enum Stages {
  INSTALL = 'install',
  BUILD = 'build',
  TEST = 'test',
  DEPLOY = 'deploy',
}

enum JobNames {
  NODE_MODULES = 'install node_modules',
  BUILD_APP = 'build app',
  BUILD_DESIGN_SYSTEM = 'build design system',
  TEST_UNIT = 'run unit tests',
  TEST_E2E = 'run e2e tests',
  DEPLOY_APP = 'deploy app',
  DEPLOY_DESIGN_SYSTEM = 'deploy design system',
}

export const config: CIConfig<Stages, JobNames> = {
  variables: {
    GIT_DEPTH: 1,
  },
  stages: [Stages.INSTALL, Stages.BUILD, Stages.TEST, Stages.DEPLOY],
  jobs: [
    {
      name: JobNames.NODE_MODULES,
      stage: Stages.INSTALL,
      script: ['yarn --frozen-lockfile'],
      waitFor: [],
    },
    {
      name: JobNames.BUILD_APP,
      stage: Stages.BUILD,
      waitFor: [JobNames.NODE_MODULES],
      script: ['yarn build:app'],
      variables: {
        NODE_ENV: 'production',
      },
    },
    {
      name: JobNames.BUILD_DESIGN_SYSTEM,
      stage: Stages.BUILD,
      waitFor: [JobNames.NODE_MODULES],
      script: ['yarn build:design-system'],
      variables: {
        NODE_ENV: 'production',
      },
    },
    {
      name: JobNames.TEST_UNIT,
      stage: Stages.TEST,
      waitFor: [JobNames.NODE_MODULES],
      script: ['yarn test:unit'],
    },
    {
      name: JobNames.TEST_E2E,
      stage: Stages.TEST,
      waitFor: [JobNames.NODE_MODULES],
      script: ['yarn test:e2e'],
    },
    {
      name: JobNames.DEPLOY_APP,
      stage: Stages.DEPLOY,
      waitFor: [JobNames.NODE_MODULES, JobNames.BUILD_APP],
      script: ['yarn deploy:app'],
    },
    {
      name: JobNames.DEPLOY_DESIGN_SYSTEM,
      stage: Stages.DEPLOY,
      waitFor: [JobNames.NODE_MODULES, JobNames.BUILD_DESIGN_SYSTEM],
      script: ['yarn deploy:design-system'],
    },
  ],
}
