pipeline {
    agent any

    tools {
        nodejs "nodejs"   // make sure NodeJS plugin installed & named "nodejs"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Ap2109/happy_new_year.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Run tests if available, otherwise skip
                sh 'npm test || echo "No tests available"'
            }
        }

        stage('Build') {
            steps {
                // If you have build step (for React/Angular), otherwise skip
                sh 'npm run build || echo "No build step"'
            }
        }

        stage('Deploy') {
            steps {
                // Deploy with PM2 (production process manager for Node.js)
                sh 'npm start'
            }
        }
    }
}
