-- Seed data for Doctors
INSERT INTO doctors (name, specialty, bio, image_url) VALUES
('Dra. Lisa Cuddy', 'Endocrinología', 'Decana de Medicina y administradora hospitalaria con amplia experiencia.', 'https://randomuser.me/api/portraits/women/68.jpg'),
('Dr. Derek Shepherd', 'Neurocirugía', 'Neurocirujano de renombre mundial, conocido como McDreamy.', 'https://randomuser.me/api/portraits/men/64.jpg');

-- Update existing doctors with images
UPDATE doctors SET image_url = 'https://randomuser.me/api/portraits/men/32.jpg' WHERE name = 'Dr. Gregory House';
UPDATE doctors SET image_url = 'https://randomuser.me/api/portraits/women/44.jpg' WHERE name = 'Dr. Meredith Grey';
UPDATE doctors SET image_url = 'https://randomuser.me/api/portraits/men/86.jpg' WHERE name = 'Dr. Stephen Strange';

-- Seed data for Appointments (Example data)
-- Note: UUIDs here are placeholders or need to be dynamically retrieved in a real script.
-- These are based on the session execution.
/*
INSERT INTO appointments (doctor_id, patient_name, patient_email, start_time, status) VALUES
('fea78861-af15-4073-b3fa-375d4be966c0', 'Juan Pérez', 'juan@test.com', NOW() + INTERVAL '1 day 09:00', 'confirmed'),
('fea78861-af15-4073-b3fa-375d4be966c0', 'Ana García', 'ana@test.com', NOW() + INTERVAL '1 day 10:00', 'pending'),
('fea78861-af15-4073-b3fa-375d4be966c0', 'Carlos López', 'carlos@test.com', NOW() + INTERVAL '2 days 11:00', 'confirmed'),
('573db8e0-9cea-4e0a-8bc4-6716ae27151d', 'María Rodríguez', 'maria@test.com', NOW() + INTERVAL '1 day 14:00', 'confirmed'),
('573db8e0-9cea-4e0a-8bc4-6716ae27151d', 'Pedro Martínez', 'pedro@test.com', NOW() + INTERVAL '3 days 09:30', 'cancelled'),
('62759008-2eed-428c-9afe-c1cf8cf87b0d', 'Lucía Fernández', 'lucia@test.com', NOW() + INTERVAL '2 days 16:00', 'confirmed');
*/
