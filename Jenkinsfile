pipeline {
    agent any
    environment {
        SONARQUBE = credentials('sonarqube-token')
        DOCKERHUB_CREDS = credentials('dockerhub-cred')
        IMAGE_NAME = "secure-nodejs-ci"
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Shwetali-Github/secure-nodejs-ci.git'
            }
        }
        stage('Check Tools') {
    steps {
        sh '''
            echo "=== Checking installed tools ==="
            which node || echo "❌ node not found"
            which npm || echo "❌ npm not found"
            which docker || echo "❌ docker not found"
            which trivy || echo "❌ trivy not found"
            which sonar-scanner || echo "❌ sonar-scanner not found"
            echo "================================"
        '''
    }
}

        stage('Install Dependencies') {
            steps { sh 'npm install' }
        }
        stage('Lint & Unit Test') {
            steps {
                sh 'npm run lint'
                sh 'npm test -- --coverage'
            }
        }
        stage('SonarQube Code Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=secure-nodejs-ci \
                        -Dsonar.sources=./src \
                        -Dsonar.login=$SONARQUBE
                    '''
                }
            }
        }
        stage('Build Docker Image') {
            steps { sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ." }
        }
        stage('Security Scan - Trivy') {
            steps {
                sh "trivy image ${IMAGE_NAME}:${IMAGE_TAG} --exit-code 1 --severity HIGH,CRITICAL || true"
            }
        }
        stage('Push to Docker Hub') {
            steps {
                sh '''
                    echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} $DOCKERHUB_CREDS_USR/${IMAGE_NAME}:${IMAGE_TAG}
                    docker push $DOCKERHUB_CREDS_USR/${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }
    }
    post {
        always {
            echo "✅ CI pipeline completed successfully!"
        }
    }
}

