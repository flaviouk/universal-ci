import { CIConfig } from '../src'
import { createGitlabCI } from '../src/gitlab'

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

describe('[GITLAB]', () => {
  it('should not insert null properties', () => {
    const config: CIConfig<Stages, JobNames> = {
      stages: [],
      jobs: [],
    }

    expect(createGitlabCI(config)).toMatchInlineSnapshot(`
      "stages: []
      "
    `)
  })

  it('should output the correct gitlab config', () => {
    const config: CIConfig<Stages, JobNames> = {
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

    expect(createGitlabCI(config)).toMatchInlineSnapshot(`
      "stages:
        - install
        - build
        - test
        - deploy
      variables:
        GIT_DEPTH: 1
      install node_modules:
        stage: install
        needs: []
        script:
          - yarn --frozen-lockfile
      build app:
        stage: build
        variables:
          NODE_ENV: production
        needs:
          - install node_modules
        script:
          - yarn build:app
      build design system:
        stage: build
        variables:
          NODE_ENV: production
        needs:
          - install node_modules
        script:
          - yarn build:design-system
      run unit tests:
        stage: test
        needs:
          - install node_modules
        script:
          - yarn test:unit
      run e2e tests:
        stage: test
        needs:
          - install node_modules
        script:
          - yarn test:e2e
      deploy app:
        stage: deploy
        needs:
          - install node_modules
          - build app
        script:
          - yarn deploy:app
      deploy design system:
        stage: deploy
        needs:
          - install node_modules
          - build design system
        script:
          - yarn deploy:design-system
      "
    `)
  })
})
