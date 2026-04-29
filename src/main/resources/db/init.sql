CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(19, 2) NOT NULL,
    stock INTEGER NOT NULL
);

CREATE TABLE quotations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    fecha TIMESTAMP NOT NULL,
    estado VARCHAR(50) NOT NULL,
    total DECIMAL(19, 2) NOT NULL
);

CREATE TABLE quotation_items (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER REFERENCES quotations(id),
    product_id INTEGER REFERENCES products(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(19, 2) NOT NULL,
    subtotal DECIMAL(19, 2) NOT NULL
);
