pipeline {
    agent any
    environment {
        NETLIFY_SITE_ID = 'be204aa5-5657-4e03-a306-4833f4227751'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        REACT_APP_VERSION ="1.0.$BUILD_ID"
    }
    stages {
        
        stage('Docker'){
            steps{
                sh 'docker build -t my-playwright .'
                sh 'docker run -d -p 8080:8080 -p 50000:50000 jenkins-nodejs'
            }
        }
        stage('Build') {
                agent {
                    docker {
                        image 'node:18-alpine'
                        reuseNode true
                     }
                 }
             steps {
                sh '''
                        echo 'Small change'
                        ls -ls
                        node --version
                        npm --version
                        npm ci
                        npm run build
                        ls -la
                    '''
                 }
             }
            

        stage('Tests'){
            parallel {
                    stage('Unit tests')
                {
                    agent {
                            docker {
                                image 'node:18-alpine'
                                reuseNode true
                            }
                    }
                    steps {
                    sh '''
                    test -f build/index.html
                    npm test
                    '''
                }
                    post {
                        always {
                            junit 'jest-results/junit.xml'
                            
                        }
                    }

                }
                stage('E2E')
                {
                    agent {
                            docker {
                                image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                                reuseNode true
                                
                            }
                    }
                    steps {
                    sh '''
                        npm install serve
                        node_modules/.bin/serve -s build &            # & will run this in background
                        sleep 10
                        npx playwright test --reporter=html
                    '''
                }
                post {
                    always {
                        
                        publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Local Report', reportTitles: '', useWrapperFileDirectly: true])
                    }
                }
                }

            }
        }
    stage('Deploy stage') {
                agent {
                    docker {
                        image 'node:18-alpine'
                        reuseNode true
                     }
                 }
             steps {
                sh '''
                       npm install netlify-cli
                       node_modules/.bin/netlify --version
                       echo "Deploying to staging. Site ID: $NETLIFY_SITE_ID"
                       node_modules/.bin/netlify status
                       node_modules/.bin/netlify deploy --dir=build

                    '''
                 }
             }
    stage('Approval') {
    
            steps {
                timeout(time: 15, unit: 'MINUTES') {
                input message: 'Do you wish to deploy to production?', ok: 'Yes, I\'m sure!'
                }
            }
    }
             
    stage('Deploy prod') {
                agent {
                    docker {
                        image 'node:18-alpine'
                        reuseNode true
                     }
                 }
             steps {
                sh '''
                       npm install netlify-cli node-jq
                       node_modules/.bin/netlify --version
                       echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
                       node_modules/.bin/netlify status
                       node_modules/.bin/netlify deploy --dir=build --prod

                    '''
                 }
             }
    stage('Prod E2E')
                {
                    agent {
                            docker {
                                image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                                reuseNode true
                                
                            }
                    }
                            environment {
                                    CI_ENVIRONMENT_URL = 'https://shiny-beijinho-8f5136.netlify.app'
                            }
                    steps {
                    sh '''
                        npx playwright test --reporter=html
                    '''
                }
                post {
                    always {
                        
                        publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright E2E Report', reportTitles: '', useWrapperFileDirectly: true])
                    }
                }
                }
        }
        
    }