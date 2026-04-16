-- Krishnnad Syndicate Demo Data Seed

-- 1. Insert Breeds
INSERT INTO breeds (id, name, origin, temperament, size_category, life_expectancy, description, cover_image_url)
VALUES 
  ('8d3c5b52-2598-4b72-9b2f-7634283c748c', 'German Shepherd', 'Germany', 'Confident, Courageous, Smart', 'large', '7-10 years', 'The German Shepherd Dog is one of America''s most popular dog breeds—for good reason. They''re intelligent and capable working dogs.', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000'),
  ('5af54f1d-72fb-4e78-9993-4560938f1234', 'Golden Retriever', 'Scotland', 'Friendly, Intelligent, Devoted', 'large', '10-12 years', 'The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000'),
  ('7320498b-2856-4b6e-826c-d225197823f4', 'Rottweiler', 'Germany', 'Loyal, Loving, Confident Guardian', 'large', '9-10 years', 'The Rottweiler is a robust working breed of great strength descended from the mastiffs of the Roman legions.', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000');

-- 2. Insert Dogs
INSERT INTO dogs (id, name, breed_id, age_months, gender, color, weight_kg, price, status, is_featured, health_certified, vaccinated, dewormed, microchipped, pedigree_certified, description, care_notes)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Shadow', '8d3c5b52-2598-4b72-9b2f-7634283c748c', 24, 'Male', 'Black & Tan', 32, 1200000, 'Available', true, true, true, true, true, true, 'Shadow is a champion bloodline German Shepherd with exceptional drive and focus. Perfect for protection or as a disciplined family companion.', 'Requires active exercise and mental stimulation. High protein diet recommended.'),
  ('b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e', 'Bella', '5af54f1d-72fb-4e78-9993-4560938f1234', 18, 'Female', 'Golden', 28, 850000, 'Available', true, true, true, true, true, true, 'Bella is the sweetest Golden Retriever you will ever meet. She loves children and is already basic-obedience trained.', 'Regular grooming is essential to maintain her beautiful coat.'),
  ('c3d4e5f6-a7b8-4c9d-8e9f-0a1b2c3d4e5f', 'Kaiser', '7320498b-2856-4b6e-826c-d225197823f4', 36, 'Male', 'Black & Mahogany', 45, 1500000, 'Available', false, true, true, true, true, true, 'Kaiser is a massive Rottweiler with a heart of gold. He is calm, observant, and fiercely loyal.', 'Socialization with other large breeds is recommended.');

-- 3. Insert Dog Images
INSERT INTO dog_images (dog_id, url, is_primary, display_order)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000', true, 0),
  ('b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000', true, 0),
  ('c3d4e5f6-a7b8-4c9d-8e9f-0a1b2c3d4e5f', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000', true, 0);

-- 4. Set Initial Site Settings
INSERT INTO site_settings (key, value)
VALUES
  ('heroHeadline', '"Experience the Pinnacle of Dog Pedigree"'),
  ('heroSubheadline', '"At Krishnnad Syndicate, we don''t just breed dogs; we curate legacies."'),
  ('contactWhatsApp', '"+234 800 000 0000"'),
  ('contactEmail', '"hello@krishnnad.com"'),
  ('baseDeliveryFee', '50000')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
