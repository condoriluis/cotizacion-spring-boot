# 🏢 Professional Quotation Management System

Backend profesional desarrollado con **Spring Boot 3**, siguiendo los principios de **Arquitectura Limpia (Hexagonal)**.

## 🚀 Tecnologías
- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Security + JWT**
- **Spring Data JPA + PostgreSQL**
- **MapStruct** (Mapeo de objetos)
- **Lombok**
- **Swagger / OpenAPI 3**
- **Docker**

## 🏗️ Arquitectura
El proyecto implementa **Clean Architecture**, separando estrictamente la lógica de negocio de los detalles técnicos:
1. **Domain**: Modelos puros y puertos (interfaces).
2. **Application**: Servicios de aplicación y DTOs.
3. **Infrastructure**: Implementación de persistencia, seguridad y configuración.
4. **Interfaces**: Controladores REST y documentación.

## 🛠️ Cómo correr el proyecto

### 1. Requisitos
- Java 17 o superior.
- Docker y Docker Compose (opcional para la BD).
- Maven.

### 2. Levantar la Base de Datos
```bash
docker-compose up -d
```

### 3. Correr la aplicación
```bash
mvn spring-boot:run
```

## 📄 Documentación de la API
Una vez iniciada la aplicación, puedes acceder a la documentación interactiva en:
👉 [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## 🔐 Flujo de Seguridad
1. **Registro**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login` -> Obtienes `accessToken` y `refreshToken`.
3. **Uso**: Incluir `Authorization: Bearer <token>` en cada petición.
4. **Refresh**: `POST /api/v1/auth/refresh` con el refresh token en el header.

## 📊 Ejemplo de Flujo de Negocio
1. Crear un **Cliente**.
2. Crear **Productos** con stock.
3. Generar una **Cotización** enviando el `clienteId` y la lista de `items`.
4. El sistema calculará automáticamente subtotales, totales y validará el stock disponible.
5. Cambiar el estado a **ACEPTADA** para finalizar la venta (el stock se descontará automáticamente).

---
*Desarrollado como un ejemplo de arquitectura senior para sistemas escalables.*
