# StudentHub – Student Management System

A full-stack Student Management System built using **React, Node.js, Express, and MongoDB**, containerized with Docker and deployed on Kubernetes using Minikube.

## 🚀 Features

- Add new student records
- View all students
- Edit student information
- Delete student records
- MongoDB database integration
- Persistent database storage using Kubernetes PVC
- Dockerized frontend and backend
- Kubernetes Deployments and Services
- Nginx reverse proxy for frontend-backend communication

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend |
| Vite | Frontend build tool |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| Nginx | Web server and reverse proxy |
| Docker | Containerization |
| Docker Hub | Image registry |
| Kubernetes | Container orchestration |
| Minikube | Local Kubernetes cluster |

## 🏗️ Architecture

```text
                 Browser
                    |
                    v
          StudentHub Frontend
             React + Nginx
              NodePort 30081
                    |
                    v
          StudentHub Backend
             Node.js + Express
                Port 5000
                    |
                    v
            StudentHub MongoDB
                Port 27017
                    |
                    v
          PersistentVolumeClaim
                  1 GiB
```

## 📁 Project Structure

```text
student-management/
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Student.js
│   │   ├── routes/
│   │   │   └── studentRoutes.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── mongodb-pvc.yaml
│
├── docker-compose.yml
└── README.md
```

## 🐳 Docker Hub Images

The application images are published on Docker Hub.

| Component | Docker Image | Version |
|---|---|---|
| Frontend | `gontlasanthoshkumar2005/studenthub-frontend` | v3 |
| Backend | `gontlasanthoshkumar2005/studenthub-backend` | v2 |

**Docker Hub repositories:**

- [StudentHub Frontend](https://hub.docker.com/r/gontlasanthoshkumar2005/studenthub-frontend)
- [StudentHub Backend](https://hub.docker.com/r/gontlasanthoshkumar2005/studenthub-backend)

## ⚙️ Prerequisites

Install the following tools:

- Docker Desktop
- Minikube
- kubectl
- Git (optional)

## 🚀 Deployment Using Kubernetes

### 1. Start Docker Desktop

Open Docker Desktop and wait until Docker Engine is running.

Verify Docker:

```powershell
docker version
docker info
```

### 2. Start Minikube

```powershell
minikube start --driver=docker
```

Check cluster status:

```powershell
minikube status
kubectl get nodes
```

### 3. Navigate to the Project

```powershell
cd C:\Users\santh\projects\student-management
```

### 4. Deploy MongoDB Persistent Storage

```powershell
cd kubernetes

kubectl apply -f mongodb-pvc.yaml
```

Verify:

```powershell
kubectl get pvc
```

### 5. Create Kubernetes Services

```powershell
kubectl apply -f service.yaml
```

Verify:

```powershell
kubectl get services
```

### 6. Deploy the Applications

```powershell
kubectl apply -f deployment.yaml
```

### 7. Verify Deployments

```powershell
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get pvc
```

Wait for the deployments:

```powershell
kubectl rollout status deployment/studenthub-mongo

kubectl rollout status deployment/studenthub-backend

kubectl rollout status deployment/studenthub-frontend
```

## 🌐 Access the Application

Run:

```powershell
minikube service studenthub-frontend --url
```

Open the URL returned by Minikube in your browser.

**Frontend NodePort:** `30081`

> On Windows with the Docker driver, keep the PowerShell terminal running while using the Minikube service tunnel.

## 🔌 Backend API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend welcome message |
| GET | `/api/health` | API health check |
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Add a student |
| GET | `/api/students/:id` | Get a student by ID |
| PUT | `/api/students/:id` | Update student details |
| DELETE | `/api/students/:id` | Delete a student |

## 🗄️ MongoDB Configuration

The backend connects to MongoDB through the Kubernetes Service:

```text
mongodb://studenthub-mongo:27017/studenthub
```

Database name:

```text
studenthub
```

Collection:

```text
students
```

MongoDB storage is configured using a Kubernetes PersistentVolumeClaim.

**PVC name:** `studenthub-mongo-pvc`

**Storage capacity:** `1Gi`

### Verify MongoDB Records

```powershell
kubectl exec deployment/studenthub-mongo -- mongosh studenthub --eval "db.students.find().toArray()"
```

### Verify Data Persistence

Restart the MongoDB deployment:

```powershell
kubectl rollout restart deployment/studenthub-mongo
```

Wait for it to become ready:

```powershell
kubectl rollout status deployment/studenthub-mongo
```

Check the records again:

```powershell
kubectl exec deployment/studenthub-mongo -- mongosh studenthub --eval "db.students.find().toArray()"
```

Previously saved student records should remain available after the pod restart.

## 🔄 Daily Startup Commands

After shutting down Docker Desktop, VS Code, or Windows, follow these steps.

**Step 1: Start Docker Desktop.**

Wait until Docker Engine is running.

**Step 2: Start Minikube.**

```powershell
minikube start --driver=docker
```

**Step 3: Verify Kubernetes.**

```powershell
minikube status
kubectl get nodes
```

**Step 4: Check application pods.**

```powershell
kubectl get pods
```

**Step 5: Open StudentHub.**

```powershell
minikube service studenthub-frontend --url
```

You do not need to rebuild Docker images or redeploy the applications after an ordinary shutdown and restart.

## 🧰 Useful Kubernetes Commands

| Command | Description |
|---|---|
| `minikube start --driver=docker` | Start Minikube |
| `minikube stop` | Stop Minikube |
| `minikube status` | Check Minikube status |
| `kubectl get nodes` | List Kubernetes nodes |
| `kubectl get pods` | List pods |
| `kubectl get deployments` | List deployments |
| `kubectl get services` | List services |
| `kubectl get pvc` | List persistent volume claims |
| `kubectl get all` | List common Kubernetes resources |
| `kubectl logs deployment/studenthub-backend` | View backend logs |
| `kubectl logs deployment/studenthub-frontend` | View frontend logs |
| `kubectl logs deployment/studenthub-mongo` | View MongoDB logs |

## 🔧 Troubleshooting

### Minikube is not running

```powershell
minikube start --driver=docker
```

### Check pod errors

```powershell
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Check backend logs

```powershell
kubectl logs deployment/studenthub-backend
```

### Check MongoDB connection

```powershell
kubectl logs deployment/studenthub-backend
```

Expected message:

```text
MongoDB connected successfully
```

### Restart the frontend

```powershell
kubectl rollout restart deployment/studenthub-frontend
```

### Restart the backend

```powershell
kubectl rollout restart deployment/studenthub-backend
```

## ⚠️ Important Notes

- Do not run `minikube delete` unless you intentionally want to delete the cluster.
- Do not delete `studenthub-mongo-pvc` if you want to preserve database data.
- Avoid `kubectl delete pvc --all`.
- Keep Food Ordering and StudentHub Kubernetes resources separate.

## ✅ Project Verification

The StudentHub application has been deployed and tested successfully.

| Verification | Result |
|---|---|
| Docker image creation | Completed |
| Docker Hub image publishing | Completed |
| Kubernetes Deployments | Successful |
| Kubernetes Services | Successful |
| MongoDB connection | Verified |
| Persistent storage | Verified |
| Frontend access | Verified |
| Add student | Working |
| View students | Working |
| Edit student | Working |
| Delete student | Working |
| Data persistence after MongoDB pod restart | Verified |

## 👨‍💻 Author

**Gontla Santhosh Kumar**

Student Management System – Docker and Kubernetes Deployment Project.
