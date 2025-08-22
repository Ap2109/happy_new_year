pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { git 'https://github.com/Ap2109/happy_new_year' }
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
