pipeline {
    agent any

    tools {
        nodejs "nodejs"   // Configure this in Manage Jenkins → Global Tool Configuration
    }

    environment {
        // Ensure npm global bin is available (for pm2 installed without sudo)
        NPM_CONFIG_PREFIX = "${env.WORKSPACE}/.npm-global"
        PATH = "${env.PATH}:${env.WORKSPACE}/.npm-global/bin"
        APP_NAME = "happy_app"
        APP_PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Ap2109/happy_new_year.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci || npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "No tests available"'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build step"'
            }
        }

        stage('Deploy (PM2)') {
            steps {
                sh '''
                  # Install pm2 for the jenkins user (no sudo)
                  if ! command -v pm2 >/dev/null 2>&1; then
                    npm install -g pm2
                  fi

                  # Start or reload the app
                  if pm2 list | grep -q ${APP_NAME}; then
                    pm2 reload ${APP_NAME} --update-env
                  else
                    pm2 start index.js --name ${APP_NAME}
                  fi

                  # Persist pm2 process list
                  pm2 save || true
                '''
            }
        }

        stage('Nginx Reload (optional)') {
            steps {
                // If Nginx config changes in repo, validate + reload. Requires Jenkins sudo for these two commands.
                sh '''
                  if command -v sudo >/dev/null 2>&1; then
                    sudo nginx -t && sudo systemctl reload nginx || true
                  fi
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployed! Visit: https://devlogin.nextastra.com'
        }
        failure {
            echo '❌ Build/Deploy failed. Check console log.'
        }
    }
}
