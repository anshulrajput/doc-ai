# React + Django + NodeJs EXpress Application

## Application Architecture

![alt text](https://github.com/anshulrajput/doc-ai/blob/main/doc-ai-arch.png?raw=true)

## DB Architecture

![alt text](https://github.com/anshulrajput/doc-ai/blob/main/db-structure.png?raw=true)


This repository contains three applications:
1. **React App** - A frontend single-page application (SPA) built with React.
2. **Django App** - A backend API server built with Django Rest Framework for handling Data Apis.
3. **NodeJs Express App** - A backend API server built with Express For handling Authentication.

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v14 or later) and **npm** (Node Package Manager)
- **Python** (v3.7 or later)

Download Service Account Json Key for Firebase Authentication
- Save the service_account.json file to the root directory, the path for this will be added to the .env files for both the backend apps.

---

## Running Django App Locally

### 1. Naviagte to the data_server folder

### 2. Install dependencies

```bash
pip -r i requirements.txt
```

### 3. Create .env file in the data_server directory

```
DB_NAME="doc-ai"        // set the database name for the postgres db
DB_USER="anshulrajput"  // set user for the postgres db
DB_PASSWORD="root"  // set password for the postgres db
DB_HOST="localhost"
DB_PORT="5432"      // set port for the postgres db
SERVICE_ACCOUNT='/doc-ai/service_account.json'    // path to the service_account.json file
CORS_ORIGINS='http://localhost:3000'    // react app url for allowing cors
```

### 4. Run DB Migrations

```bash
python manage.py migrate
```

### 5. Run Application

```bash
python manage.py runserver
```

---

## Running NodeJs App Locally

### 1. Naviagte to the auth_server folder

```bash
cd auth_server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create .env file in the auth_server directory

```
NODE_ENV='local'
PORT=3001

DB_HOST='localhost'
DATABASE='doc-ai'            // set the database name for the postgres db
DB_USERNAME='anshulrajput'   // set user for the postgres db
DB_PASSWORD='root'           // set password for the postgres db
DB_PORT=5432                 // set port for the postgres db

SERVICE_ACCOUNT='/Users/anshulrajput/my_projects/doc-ai/service_account.json'  // path to the service_account.json file

CORS_ORIGINS='http://localhost:3000'    // react app url for allowing cors
```

### 4. Run Application

```bash
node index.js
```

---

## Running Frontend Locally

### 1. Naviagte to the frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create .env file in the frontend directory

```
REACT_APP_DATA_API_URL='http://localhost:8000/api'    // url of the Django application APIs
REACT_APP_AUTH_API_URL='http://localhost:3001/api'    // url of the NodeJs application APIs
REACT_APP_STATIC_FILES_URL='http://localhost:8000'    // url of the Django application
```

### 4. Run Application

```bash
npm start
```

### 5. Access The Application

- Go the the following url in the browser - http://localhost:3000/
