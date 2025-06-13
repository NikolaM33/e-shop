# E-Shop – Ski Equipment Rental and Sales Platform 🎿

This is a full-stack web application for renting and purchasing ski equipment. It includes a customer-facing portal and an admin dashboard. Users can browse products, register/login, place orders, leave reviews, and admins can manage products, view analytics, and handle orders.

---

## 📁 Project Structure
```
e-shop/
│
├── backend/ # Spring Boot application (Java 8)
│
└── frontend/
  ├── front-core/ # Customer-facing application
  └── front-admin/ # Admin dashboard
```

---

## 🧰 Technologies Used

| Layer       | Tech Stack                     |
|-------------|--------------------------------|
| Backend     | Java 8, Spring Boot 2.7.8, Maven |
| Frontend    | Angular 14, Bootstrap          |
| Database    | MongoDB                        |
| API         | RESTful                        |
| Payment     | Stripe                         |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/NikolaM33/e-shop.git
cd e-shop
```
⚙️ Backend Setup

Prerequisites

  *  Java 8

   * Maven 3.x

 *   MongoDB (local or cloud)

Configuration

 Start MongoDB locally or use a cloud instance.

  1.  Update the configuration file:
  2.  File location: backend/src/main/resources/application.yaml
 
 ```
   spring:
    data:
      mongodb:
        uri: mongodb://localhost:27017/eshop
 ```
    
```
cd backend
mvn spring-boot:run
```

📍 Server runs at: http://localhost:8080
💻 Frontend Setup

Prerequisites

    Node.js v16+

    Angular CLI

Run Front-Core (Customer App)
```
cd frontend/front-core
npm install
ng serve
```
📍 App available at: http://localhost:4200

Run Front-Admin (Admin Dashboard)
```
cd frontend/front-admin
npm install
ng serve --port 4300
```
📍 Admin available at: http://localhost:4300

