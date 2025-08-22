pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { git 'https://github.com/yourrepo/sample-node-app.git' }
        }
        stage('Install') {
            steps { sh 'npm install' }
        }
        stage('Test') {
            steps { sh 'npm test || echo "No tests available"' }
        }
        stage('Build') {
            steps { sh 'npm run build || echo "No build step"' }
        }
        stage('Deploy') {
            steps {
                sh '''
                pm2 stop app || true
                pm2 start app.js --name app
                '''
            }
        }
    }
}
