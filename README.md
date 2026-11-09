tudentHub -- Student Management System
StudentHub is a containerized student management application built with
React, Node.js/Express, and MongoDB. It is deployed on
Kubernetes using Minikube.

The project demonstrates Docker image creation, publishing images to
Docker Hub, Kubernetes Deployments and Services, persistent MongoDB
storage, and application verification.
Features
- View student records
- Add a student
- Edit student details
- Delete a student
- Store student records in MongoDB
- Persist MongoDB data using a Kubernetes PersistentVolumeClaim
- Serve the React frontend through Nginx
- Route frontend /api/ requests to the Express backend
Each student record contains:
- name
- email (unique)
- course
- year (1--6)
- MongoDB timestamps (createdAt, updatedAt)
Technology stack
  Layer                          Technology
  Frontend                       React, Vite
Web server / reverse proxy     Nginx
Backend                        Node.js, Express
ODM                            Mongoose
Database                       MongoDB 8
Containerization               Docker
Container registry             Docker Hub
Orchestration                  Kubernetes
Local Kubernetes environment   Minikube
Architecture
Browser
   |
   | HTTP :30081
   v
StudentHub Frontend Service (NodePort)
   |
   v
React + Nginx Pod (port 80)
   |
   | /api/ requests
   v
StudentHub Backend Service (ClusterIP)
   |
   v
Express Pod (port 5000)
   |
   | mongodb://studenthub-mongo:27017/studenthub
   v
StudentHub MongoDB Service (ClusterIP)
   |
   v
MongoDB Pod (port 27017)
   |
   v
PersistentVolumeClaim: studenthub-mongo-pvc (1Gi)
The frontend Nginx configuration proxies API requests to the Kubernetes
Service studenthub-backend on port 5000. MongoDB is reached through
the internal Service name studenthub-mongo.
Docker Hub images
The published images used by the Kubernetes deployments are:

  Component   Image
  Frontend    gontlasanthoshkumar2005/studenthub-frontend:v3
Backend     gontlasanthoshkumar2005/studenthub-backend:v2
- StudentHub Frontend on Docker
  Hub
- StudentHub Backend on Docker
  Hub
Project structure
The relevant project structure is:
student-management/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   └── ...
├── backend/
│   ├── Dockerfile
│   ├── .env
│   └── src/
│       ├── server.js
│       ├── models/
│       │   └── Student.js
│       └── routes/
│           └── studentRoutes.js
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── mongodb-pvc.yaml
├── docker-compose.yml
└── README.md
The Kubernetes directory contains the manifests used for the Minikube
deployment.
Prerequisites
Install and start:
- Docker Desktop
- Minikube
- kubectl
- Git (optional)
On Windows, use PowerShell for the commands below. Start Docker Desktop
and wait until the Docker Engine is running before starting Minikube.
Run the application with Kubernetes (Minikube)
1. Start Docker Desktop
Open Docker Desktop and wait until its engine is running.

Check Docker:
docker version
docker info
2. Start the existing Minikube cluster
From PowerShell:
minikube start --driver=docker
Check cluster status:
minikube status
kubectl get nodes
The Minikube node should report Ready.
Use the existing minikube profile. Do not run minikube delete if
you want to preserve the deployed applications and their persistent
volumes.

3. Check existing Kubernetes resources
From the project directory:
cd C:\Users\santh\projects\student-management
Check the deployments, pods, Services, and persistent volume claims:
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get pvc
If the StudentHub resources already exist and are healthy, you do not
need to apply the manifests again.
4. Apply the manifests (first deployment or after manifest changes)
cd .\kubernetes

kubectl apply -f .\mongodb-pvc.yaml
kubectl apply -f .\service.yaml
kubectl apply -f .\deployment.yaml
Wait for each Deployment:
kubectl rollout status deployment/studenthub-mongo --timeout=120s
kubectl rollout status deployment/studenthub-backend --timeout=120s
kubectl rollout status deployment/studenthub-frontend --timeout=120s
Verify:
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get pvc
Expected StudentHub workloads:
- studenthub-mongo -- 1/1 ready
- studenthub-backend -- 1/1 ready
- studenthub-frontend -- 1/1 ready
- studenthub-mongo-pvc -- Bound
5. Access StudentHub
Run:
minikube service studenthub-frontend --url
Open the exact URL printed by Minikube in your browser.

On Windows with the Docker driver, Minikube may create a local tunnel.
Keep the PowerShell window running while using the URL. The URL and port
can change when a new tunnel is started.

The StudentHub frontend Service uses NodePort 30081.
API endpoints
The backend exposes the following endpoints:

  Method   Endpoint              Purpose
  GET      /                   Backend welcome message
GET      /api/health         Health check
GET      /api/students       List students
POST     /api/students       Create a student
GET      /api/students/:id   Get one student
PUT      /api/students/:id   Update a student
DELETE   /api/students/:id   Delete a student

When accessed through the frontend tunnel, for example:
http://127.0.0.1:<tunnel-port>/api/health
http://127.0.0.1:<tunnel-port>/api/students
Replace <tunnel-port> with the port in the URL returned by
minikube service studenthub-frontend --url.

The health endpoint should return a successful JSON response when the
backend is reachable:
{
  "success": true,
  "message": "Student Management API is running!"
}
MongoDB configuration and persistence
The backend receives its MongoDB connection string from the Kubernetes
Deployment environment:
mongodb://studenthub-mongo:27017/studenthub
MongoDB data is stored in the studenthub database, in the students
collection.

The MongoDB Deployment mounts the PersistentVolumeClaim
studenthub-mongo-pvc at /data/db. The claim requests 1Gi of
storage.

Check the claim:
kubectl get pvc studenthub-mongo-pvc
Inspect student records:
kubectl exec deployment/studenthub-mongo -- mongosh studenthub --eval "db.students.find().toArray()"
Verify persistence after a MongoDB pod restart
kubectl rollout restart deployment/studenthub-mongo
kubectl rollout status deployment/studenthub-mongo --timeout=120s
kubectl exec deployment/studenthub-mongo -- mongosh studenthub --eval "db.students.find().toArray()"
Previously stored records should still be present after the pod restart.
This verifies persistence across a pod restart; it does not by itself
verify recovery from node or cluster failure.
Useful Kubernetes commands
Run these commands from any PowerShell directory:
  Task                                Command
  Check Minikube                      minikube status

  Start Minikube                      minikube start --driver=docker

  Stop Minikube                       minikube stop

  List pods                           kubectl get pods

  List Deployments                    kubectl get deployments

  List Services                       kubectl get services

  List PVCs                           kubectl get pvc

  StudentHub backend logs             kubectl logs deployment/studenthub-backend

  StudentHub frontend logs            kubectl logs deployment/studenthub-frontend

  StudentHub MongoDB logs             kubectl logs deployment/studenthub-mongo

  Restart StudentHub frontend         kubectl rollout restart deployment/studenthub-frontend

  Restart StudentHub backend          kubectl rollout restart deployment/studenthub-backend
Restart StudentHub MongoDB          kubectl rollout restart deployment/studenthub-mongo
Daily startup after shutting down Docker Desktop or Windows
You do not need to rebuild the images or recreate the Deployments for an
ordinary restart.
1. Open Docker Desktop and wait for the engine to become ready.
2. Run:
minikube start --driver=docker
3. Verify:
minikube status
kubectl get pods
4. Open StudentHub:
minikube service studenthub-frontend --url
Keep the tunnel's PowerShell window open while using the application.

Closing VS Code does not delete Kubernetes resources. Stopping Minikube
also does not normally delete its stored cluster resources or PVC data.
Build and publish updated Docker images
If application source code or Docker configuration changes, rebuild and
push new image tags.

From the project root:
docker build -t gontlasanthoshkumar2005/studenthub-backend:v2 .\backend
docker build -t gontlasanthoshkumar2005/studenthub-frontend:v3 .\frontend
Push the images:
docker login
docker push gontlasanthoshkumar2005/studenthub-backend:v2
docker push gontlasanthoshkumar2005/studenthub-frontend:v3
If you publish a new tag, update the corresponding image in
kubernetes/deployment.yaml before applying the Deployment manifest:
kubectl apply -f .\kubernetes\deployment.yaml
kubectl rollout status deployment/studenthub-backend
kubectl rollout status deployment/studenthub-frontend
For repeatable releases, prefer incrementing image tags (for example,
v3, v4) rather than reusing an existing tag.
Existing Food Ordering application in the same Minikube cluster
This Minikube cluster also contains a separate Food Ordering
application. Its existing resources use different names and a different
frontend NodePort:

  Application     Frontend Service          NodePort
  Food Ordering   food-frontend            30080
StudentHub      studenthub-frontend      30081

StudentHub uses its own backend Service, MongoDB Service, and PVC. Avoid
changing or deleting Food Ordering resources when managing StudentHub.
Troubleshooting
Minikube is stopped or kubectl cannot connect
Start Docker Desktop, then run:
minikube start --driver=docker
kubectl get nodes
A StudentHub pod is not Ready
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
Replace <pod-name> with the actual pod name from kubectl get pods.
Check backend-to-MongoDB connection
kubectl logs deployment/studenthub-backend
The backend should log:
MongoDB connected successfully
Check Service endpoints
kubectl get endpoints studenthub-frontend
kubectl get endpoints studenthub-backend
kubectl get endpoints studenthub-mongo
Frontend tunnel stopped
Run the command again:
minikube service studenthub-frontend --url
Keep the terminal open while accessing the returned URL.
Important data-safety notes
- Do not run minikube delete unless you intentionally want to remove
  the Minikube cluster.
- Do not delete studenthub-mongo-pvc if you want to preserve
  StudentHub database files.
- Avoid kubectl delete pvc --all; it can affect storage claims
  belonging to both applications.
- Avoid docker compose down -v unless you intentionally want to
  remove Compose-managed volumes.
- Keep the Food Ordering and StudentHub resource names separate.
Deployment verification
The StudentHub deployment was verified in Minikube with:
- Frontend, backend, and MongoDB pods reaching 1/1 Running.
- All three StudentHub Deployments reaching 1/1 available.
- studenthub-mongo-pvc reaching Bound.
- Backend successfully connecting to MongoDB.
- Student records being stored and retrieved from MongoDB.
- A saved student record remaining available after restarting the
  MongoDB pod.
- Frontend Add, View, Edit, and Delete operations working.
These results describe the tested deployment. Re-run the verification
commands after future configuration or application changes.
