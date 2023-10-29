pipeline {
    agent any

    environment {
        // Adjust these variables
        LINODE_SERVER = 'your_linode_server_ip_or_hostname'
        LINODE_USER = 'your_linode_server_user'
        ANGULAR_PROJECT_PATH = 'path_to_your_angular_project'
        DOCKER_IMAGE_NAME = 'your_angular_image_name'
    }

    stages {
        stage('Build Angular Project') {
            steps {
                script {
                    // Navigate to the Angular project directory and build the project
                    dir("${ANGULAR_PROJECT_PATH}") {
                        sh 'npm install'
                        sh 'ng build --prod'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image
                    docker.build("${DOCKER_IMAGE_NAME}")
                }
            }
        }

        stage('Deploy to Linode') {
            steps {
                script {
                    // Push Docker image to a registry (like Docker Hub) if needed

                    // SSH to Linode server, pull the image, and run using Docker Compose
                    sh """
                        ssh ${LINODE_USER}@${LINODE_SERVER} << EOF
                            docker pull ${DOCKER_IMAGE_NAME}
                            cd path_to_docker_compose_directory_on_linode
                            docker-compose up -d
                        EOF
                    """
                }
            }
        }
    }
}
