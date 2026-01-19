
pipeline {
    agent {
        node {
            label "docker && builder"
        }
    }
    
    stages {

        // stage('build-dev') {
        //     options {
        //         timeout(unit: 'MINUTES', time: 15)
        //     }
        //     steps {
        //         script {

        //             docker.withRegistry('https://eu-frankfurt-1.ocir.io', 'DockerOracle') {
        //                 String branchName = BRANCH_NAME.replace('/', '_')
        //                 String imageName = "eu-frankfurt-1.ocir.io/frkybrerb2jg/dev/mc-backend:$branchName"

        //                 def dockerImage = docker.build(imageName, ". --build-arg prod=false")
        //                 println "pushing ${dockerImage} as ${imageName}"
        //                 dockerImage.push()
        //             }

        //         }
        //     }
        // }

        stage('build-prod') {
            when {
                anyOf { branch 'master'; buildingTag() }
            }
            options {
                timeout(unit: 'MINUTES', time: 15)
            }
            steps {
                script {

                    docker.withRegistry('https://eu-frankfurt-1.ocir.io', 'DockerOracle') {
                        String tagName = BRANCH_NAME == 'master' ? 'latest' : BRANCH_NAME.replace('/', '_')
                        String imageName = "eu-frankfurt-1.ocir.io/frkybrerb2jg/mc-backend:$tagName"

                        def dockerImage = docker.build(imageName, ". --build-arg prod=true")
                        println "pushing ${dockerImage} as ${imageName}"
                        dockerImage.push()
                    }

                }
            }
        }

    }

    post {
        success {
            chuckNorris()
        }
        cleanup {
            cleanWs()
        }
    }

}