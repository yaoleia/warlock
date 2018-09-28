pipeline {
    agent any
    stages {
        stage('Prepare') {
            steps {
                sh 'sudo npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'sudo ./build.sh "$BUILD_TIMESTAMP_COMPACT"'
            }
        }
    }
}