-- Drop table if exists
DROP TABLE IF EXISTS vehicles;

-- Create vehicles table with owner information
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_make VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    vehicle_year INT NOT NULL,
    vehicle_vin VARCHAR(17),
    vehicle_registration VARCHAR(20) NOT NULL,
    vehicle_color VARCHAR(30),
    owner_first_name VARCHAR(50) NOT NULL,
    owner_last_name VARCHAR(50) NOT NULL,
    owner_email VARCHAR(100),
    owner_phone VARCHAR(20),
    owner_address VARCHAR(255),
    owner_license_number VARCHAR(20),
    owner_dob DATE,
    insurance_policy_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed data for vehicles with owner information
INSERT INTO vehicles 
(vehicle_make, vehicle_model, vehicle_year, vehicle_vin, vehicle_registration, vehicle_color, 
owner_first_name, owner_last_name, owner_email, owner_phone, owner_address, owner_license_number, owner_dob)
VALUES
-- Passenger vehicles
('Toyota', 'Camry', 2018, 'JT2BF22K1W0123456', 'ABC-1234', 'Silver', 
'John', 'Smith', 'john.smith@example.com', '555-123-4567', '123 Main St, Anytown, ST 12345', 'DL98765432', '1985-06-15'),

('Honda', 'Civic', 2020, 'JHMEJ6674MS012345', 'XYZ-5678', 'Blue', 
'Sarah', 'Johnson', 'sarah.j@example.com', '555-987-6543', '456 Oak Ave, Somewhere, ST 67890', 'DL12345678', '1990-03-22'),

('Ford', 'Mustang', 2019, '1ZVBP8AM5E5987654', 'DEF-9012', 'Red', 
'Michael', 'Williams', 'mike.w@example.com', '555-234-5678', '789 Pine Rd, Nowhere, ST 54321', 'DL56781234', '1982-11-30'),

-- SUVs
('Jeep', 'Grand Cherokee', 2021, '1J8GR48K17C654321', 'GHI-3456', 'Black', 
'Jennifer', 'Brown', 'jen.brown@example.com', '555-345-6789', '321 Elm St, Anyplace, ST 13579', 'DL87654321', '1978-08-12'),

('Chevrolet', 'Tahoe', 2017, '1GNSCBE07BR123456', 'JKL-7890', 'White', 
'Robert', 'Davis', 'rob.davis@example.com', '555-456-7890', '654 Maple Dr, Somewhere, ST 24680', 'DL23456789', '1972-04-18'),

-- Trucks
('Ford', 'F-150', 2022, '1FTEW1EP1MKE23456', 'MNO-1234', 'Blue', 
'Patricia', 'Miller', 'pat.miller@example.com', '555-567-8901', '987 Cedar Ln, Anywhere, ST 97531', 'DL34567890', '1988-12-05'),

('Toyota', 'Tacoma', 2020, '3TMCZ5AN1LM321654', 'PQR-5678', 'Gray', 
'James', 'Wilson', 'james.w@example.com', '555-678-9012', '135 Birch St, Someplace, ST 86420', 'DL45678901', '1975-09-25'),

-- Luxury vehicles
('BMW', '5 Series', 2021, 'WBAPH7C54BE789012', 'STU-9012', 'Black', 
'Linda', 'Anderson', 'linda.a@example.com', '555-789-0123', '246 Walnut Ave, Nowhere, ST 75319', 'DL56789012', '1980-07-14'),

('Mercedes-Benz', 'E-Class', 2019, 'WDDZF4JB9KA456789', 'VWX-3456', 'Silver', 
'David', 'Thomas', 'david.t@example.com', '555-890-1234', '579 Spruce Dr, Anytown, ST 24680', 'DL67890123', '1968-01-23'),

-- Hybrid/Electric
('Tesla', 'Model 3', 2022, '5YJ3E1EA4MF123789', 'YZA-7890', 'Red', 
'Elizabeth', 'Jackson', 'liz.j@example.com', '555-901-2345', '864 Aspen Ct, Somewhere, ST 13579', 'DL78901234', '1992-05-11'); 