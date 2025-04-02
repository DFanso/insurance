-- Drop table if exists
DROP TABLE IF EXISTS insurance_policies;
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

-- Create insurance policies table
CREATE TABLE IF NOT EXISTS insurance_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    provider VARCHAR(100) NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    premium_amount DECIMAL(10, 2) NOT NULL,
    coverage_type VARCHAR(50) NOT NULL,
    deductible_amount DECIMAL(10, 2),
    liability_coverage_amount DECIMAL(12, 2),
    comprehensive_coverage_amount DECIMAL(12, 2),
    collision_coverage_amount DECIMAL(12, 2),
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    vehicle_image LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
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

-- Seed data for insurance policies
INSERT INTO insurance_policies 
(policy_number, provider, vehicle_id, start_date, end_date, premium_amount, coverage_type, 
deductible_amount, liability_coverage_amount, comprehensive_coverage_amount, collision_coverage_amount, 
status, notes, vehicle_image)
VALUES
-- Active policies
('POL-123456-A', 'Safe Auto Insurance', 1, '2023-01-01', '2023-12-31', 1250.00, 'FULL', 
500.00, 250000.00, 50000.00, 50000.00, 
'ACTIVE', 'Annual policy with roadside assistance',
'data:image/jpeg;base64,/9j/4AAQSkZJRg...'), -- Replace with actual base64 image from https://unsplash.com/photos/p7tai9P7H-s

('POL-789012-B', 'Geico', 2, '2023-03-15', '2024-03-14', 980.50, 'FULL', 
1000.00, 300000.00, 75000.00, 75000.00, 
'ACTIVE', 'Multi-car discount applied',
'data:image/jpeg;base64,/9j/4AAQSkZJRg...'), -- Replace with actual base64 image from https://unsplash.com/photos/N9Pf2J656aQ

('POL-345678-C', 'State Farm', 3, '2023-05-20', '2024-05-19', 1500.75, 'FULL', 
750.00, 500000.00, 100000.00, 100000.00, 
'ACTIVE', 'Premium coverage for sports car',
'data:image/jpeg;base64,/9j/4AAQSkZJRg...'), -- Replace with actual base64 image from https://unsplash.com/photos/YApiWyp0lqo

('POL-901234-D', 'Allstate', 4, '2023-07-10', '2024-07-09', 1350.25, 'FULL', 
500.00, 300000.00, 60000.00, 60000.00, 
'ACTIVE', 'Bundled with home insurance discount', NULL),

('POL-567890-E', 'Progressive', 5, '2023-02-28', '2024-02-27', 1175.00, 'FULL', 
500.00, 250000.00, 50000.00, 50000.00, 
'ACTIVE', 'Safe driver discount applied', NULL),

-- Expiring soon
('POL-987654-F', 'Liberty Mutual', 6, '2023-01-15', '2023-08-15', 1400.50, 'FULL', 
500.00, 300000.00, 70000.00, 70000.00, 
'ACTIVE', 'Truck coverage with commercial use rider', NULL),

-- Expired policies
('POL-654321-G', 'Farmers Insurance', 7, '2022-05-10', '2023-05-09', 1100.00, 'FULL', 
750.00, 250000.00, 50000.00, 50000.00, 
'EXPIRED', 'Policy expired, renewal notice sent', NULL),

('POL-210987-H', 'USAA', 8, '2022-06-20', '2023-06-19', 1625.75, 'FULL', 
500.00, 500000.00, 100000.00, 100000.00, 
'EXPIRED', 'Luxury vehicle premium policy', NULL),

-- Minimal coverage policy
('POL-876543-I', 'The General', 9, '2023-04-15', '2024-04-14', 750.25, 'LIABILITY', 
1000.00, 100000.00, NULL, NULL, 
'ACTIVE', 'Liability only coverage', NULL),

-- Electric vehicle policy
('POL-432109-J', 'Tesla Insurance', 10, '2023-06-01', '2024-05-31', 950.00, 'FULL', 
500.00, 300000.00, 150000.00, 150000.00, 
'ACTIVE', 'Special EV coverage including battery protection', NULL),

-- Additional active policies
('POL-112233-K', 'Nationwide', 1, '2023-07-15', '2024-07-14', 1150.50, 'FULL', 
250.00, 200000.00, 40000.00, 40000.00, 
'ACTIVE', 'Secondary policy for shared vehicle', NULL),

('POL-445566-L', 'American Family', 3, '2023-08-01', '2024-08-01', 1375.25, 'COLLISION', 
500.00, 300000.00, NULL, 75000.00, 
'ACTIVE', 'Collision-focused policy for high-risk driver', NULL),

('POL-778899-M', 'Hartford', 5, '2023-06-10', '2024-06-09', 1050.75, 'COMPREHENSIVE', 
300.00, 200000.00, 80000.00, NULL, 
'ACTIVE', 'Comprehensive coverage for weather-related incidents', NULL),

('POL-223344-N', 'Travelers', 7, '2023-07-20', '2024-07-19', 1250.00, 'FULL', 
750.00, 350000.00, 75000.00, 75000.00, 
'ACTIVE', 'Replacement policy after expiration', NULL),

-- Policies expiring very soon (within 30 days)
('POL-556677-O', 'Esurance', 2, '2022-08-15', '2023-08-14', 975.50, 'FULL', 
500.00, 250000.00, 50000.00, 50000.00, 
'ACTIVE', 'Expiring soon, renewal offer sent with 10% discount', NULL),

('POL-889900-P', 'Amica', 4, '2022-08-20', '2023-08-19', 1425.25, 'FULL', 
250.00, 400000.00, 80000.00, 80000.00, 
'ACTIVE', 'Premier policy expiring soon, renewal pending', NULL),

-- Recently expired policies
('POL-334455-Q', 'Mercury', 6, '2022-07-01', '2023-07-01', 1300.00, 'FULL', 
500.00, 200000.00, 40000.00, 40000.00, 
'EXPIRED', 'Recently expired, grace period applied', NULL),

('POL-667788-R', 'Safeco', 8, '2022-07-15', '2023-07-15', 1575.50, 'FULL', 
1000.00, 500000.00, 100000.00, 100000.00, 
'EXPIRED', 'Premium policy recently expired, customer contacted', NULL),

-- Special coverage types
('POL-990011-S', 'Root Insurance', 9, '2023-06-15', '2024-06-14', 825.75, 'LIABILITY', 
500.00, 150000.00, NULL, NULL, 
'ACTIVE', 'Usage-based insurance with telematics discount', NULL),

('POL-112233-T', 'PEMCO', 10, '2023-05-01', '2024-04-30', 1050.25, 'COMPREHENSIVE', 
250.00, 200000.00, 200000.00, NULL, 
'ACTIVE', 'Enhanced coverage for high-value electric vehicle', NULL),

-- Historical policies
('POL-445566-U', 'Metlife', 1, '2021-01-15', '2022-01-14', 1100.00, 'FULL', 
500.00, 200000.00, 40000.00, 40000.00, 
'EXPIRED', 'Previous policy before current coverage', NULL),

('POL-778899-V', 'AAA Insurance', 3, '2021-05-20', '2022-05-19', 1450.50, 'FULL', 
750.00, 350000.00, 70000.00, 70000.00, 
'EXPIRED', 'Previous policy with higher premium', NULL),

-- Policies with unusual coverage amounts
('POL-001122-W', 'Elephant Insurance', 5, '2023-04-01', '2024-03-31', 1100.00, 'FULL', 
1500.00, 1000000.00, 250000.00, 250000.00, 
'ACTIVE', 'High-limit policy with increased deductible', NULL),

('POL-334455-X', 'General Auto', 7, '2023-03-15', '2024-03-14', 675.25, 'LIABILITY', 
2000.00, 50000.00, NULL, NULL, 
'ACTIVE', 'Minimum coverage policy with high deductible', NULL); 