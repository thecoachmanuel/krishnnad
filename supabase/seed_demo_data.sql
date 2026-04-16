-- Krishnnad Syndicate Demo Data Seed - Expanded (20+ Dogs)

-- 1. Insert Breeds
INSERT INTO breeds (id, name, origin, temperament, size_category, life_expectancy, description, cover_image_url)
VALUES 
  ('8d3c5b52-2598-4b72-9b2f-7634283c748c', 'German Shepherd', 'Germany', 'Confident, Courageous, Smart', 'large', '7-10 years', 'The German Shepherd Dog is one of America''s most popular dog breeds—for good reason. They''re intelligent and capable working dogs.', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000'),
  ('5af54f1d-72fb-4e78-9993-4560938f1234', 'Golden Retriever', 'Scotland', 'Friendly, Intelligent, Devoted', 'large', '10-12 years', 'The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000'),
  ('7320498b-2856-4b6e-826c-d225197823f4', 'Rottweiler', 'Germany', 'Loyal, Loving, Confident Guardian', 'large', '9-10 years', 'The Rottweiler is a robust working breed of great strength descended from the mastiffs of the Roman legions.', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000'),
  ('f4d2a1c9-6b3e-4d8a-9c7b-5a2e1f3d4b6a', 'Labrador Retriever', 'Canada', 'Kind, Pleasant, Outgoing', 'large', '10-12 years', 'The sweet-faced, lovable Labrador Retriever is America’s most popular dog breed.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000'),
  ('d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f60', 'Doberman Pinscher', 'Germany', 'Loyal, Fearless, Alert', 'large', '10-12 years', 'Sleek and powerful, possessing both a magnificent physique and keen intelligence.', 'https://images.unsplash.com/photo-1605897472359-85e4b9482221?q=80&w=1000'),
  ('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 'French Bulldog', 'France', 'Adaptable, Playful, Smart', 'small', '10-12 years', 'The one-of-a-kind French Bulldog, with his large bat ears and even disposition.', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-a2b3c4d5e6f7', 'Siberian Husky', 'Siberia', 'Loyal, Outgoing, Mischievous', 'medium', '12-14 years', 'The Siberian Husky, a thickly coated, compact sled dog of medium size and great endurance.', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Insert Dogs (20+ Total)
INSERT INTO dogs (id, name, breed_id, age_months, gender, color, weight_kg, price, status, is_featured, health_certified, vaccinated, dewormed, microchipped, pedigree_certified, description, care_notes)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Shadow', '8d3c5b52-2598-4b72-9b2f-7634283c748c', 24, 'Male', 'Black & Tan', 32, 1200000, 'Available', true, true, true, true, true, true, 'Shadow is a champion bloodline German Shepherd.', 'Requires active exercise.'),
  ('b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e', 'Bella', '5af54f1d-72fb-4e78-9993-4560938f1234', 18, 'Female', 'Golden', 28, 850000, 'Available', true, true, true, true, true, true, 'Bella is the sweetest Golden Retriever.', 'Regular grooming required.'),
  ('c3d4e5f6-a7b8-4c9d-8e9f-0a1b2c3d4e5f', 'Kaiser', '7320498b-2856-4b6e-826c-d225197823f4', 36, 'Male', 'Black & Mahogany', 45, 1500000, 'Available', true, true, true, true, true, true, 'Kaiser is a massive Rottweiler.', 'Socialization recommended.'),
  ('d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Max', 'f4d2a1c9-6b3e-4d8a-9c7b-5a2e1f3d4b6a', 6, 'Male', 'Yellow', 15, 600000, 'Available', true, true, true, true, true, false, 'Playful Labrador puppy.', 'Needs lots of toys.'),
  ('e2f3c4d5-a6b7-8c9d-0e1f-2a3b4c5d6e7f', 'Luna', 'b2c3d4e5-f6a7-8b9c-0d1e-a2b3c4d5e6f7', 12, 'Female', 'White & Grey', 20, 950000, 'Available', true, true, true, true, true, true, 'Stunning Husky with blue eyes.', 'Keep in cool environment.'),
  ('f3d4e5f6-a7b8-9c0d-e1f2-a3b4c5d6e7f8', 'Duke', 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f60', 8, 'Male', 'Black & Rust', 25, 1300000, 'Available', false, true, true, true, true, true, 'Strong and alert Doberman.', 'Training essential.'),
  ('a1d2e3f4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', 'Coco', 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 4, 'Female', 'Fawn', 8, 1800000, 'Available', true, true, true, true, true, true, 'Adorable Frenchie puppy.', 'Avoid excessive heat.'),
  ('b2a3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', 'Rocky', '8d3c5b52-2598-4b72-9b2f-7634283c748c', 10, 'Male', 'Black & Tan', 28, 900000, 'Available', false, true, true, true, true, true, 'Young German Shepherd energetic.', 'Good for active homes.'),
  ('c3a4b5c6-d7e8-9a0b-1c2d-3e4f5a6b7c8d', 'Molly', '5af54f1d-72fb-4e78-9993-4560938f1234', 5, 'Female', 'Cream', 12, 750000, 'Available', false, true, true, true, true, true, 'Bright Golden Retriever pup.', 'Loves to fetch.'),
  ('d4a5b6c7-d8e9-0a1b-2c3d-4e5f6a7b8c9d', 'Bruno', '7320498b-2856-4b6e-826c-d225197823f4', 18, 'Male', 'Black', 38, 1100000, 'Available', false, true, true, true, true, true, 'Protective Rottweiler.', 'Fenced yard required.'),
  ('e5a6b7c8-d9e0-1a2b-3c4d-5e6f7a8b9c0d', 'Daisy', 'f4d2a1c9-6b3e-4d8a-9c7b-5a2e1f3d4b6a', 3, 'Female', 'Chocolate', 6, 800000, 'Available', true, true, true, true, true, true, 'Chocolate Lab puppy.', 'Very food motivated.'),
  ('f6a7b8c9-d0e1-2a3b-4c5d-6e7f8a9b0c1d', 'Ghost', 'b2c3d4e5-f6a7-8b9c-0d1e-a2b3c4d5e6f7', 24, 'Male', 'Pure White', 24, 1400000, 'Available', true, true, true, true, true, true, 'Rare all-white Husky.', 'Will howl at the moon.'),
  ('a7a8b9c0-d1e2-3a4b-5c6d-7e8f9a0b1c2d', 'Roxy', 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f60', 5, 'Female', 'Rust', 18, 1200000, 'Available', false, true, true, true, true, true, 'Athletic Doberman female.', 'High energy.'),
  ('b8a9b0c1-d2e3-4a5b-6c7d-8e9f0a1b2c3d', 'Stitch', 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6', 6, 'Male', 'Blue', 10, 2500000, 'Available', true, true, true, true, true, true, 'Rare Blue Frenchie.', 'Indoor dog only.'),
  ('c9a0b1c2-d3e4-5a6b-7c8d-9e0f1a2b3c4d', 'Atlas', '8d3c5b52-2598-4b72-9b2f-7634283c748c', 36, 'Male', 'Sable', 40, 1800000, 'Available', true, true, true, true, true, true, 'Full grown working line GSD.', 'Experienced owners.'),
  ('d0a1b2c3-d4e5-6a7b-8c9d-0e1f2a3b4c5d', 'Zoe', '5af54f1d-72fb-4e78-9993-4560938f1234', 8, 'Female', 'Light Gold', 22, 900000, 'Available', false, true, true, true, true, true, 'Elegant Golden female.', 'Loves people.'),
  ('a2a3b4c5-d6e7-8a9b-0c1d-2e3f4a5b6c7d', 'Tyson', '7320498b-2856-4b6e-826c-d225197823f4', 4, 'Male', 'Black & Mahogany', 12, 850000, 'Available', false, true, true, true, true, true, 'Rottweiler pup.', 'Giant paws.'),
  ('b3a4b5c6-d7e8-9a0b-1c2d-3e4f5a6b7c8d', 'Nala', 'f4d2a1c9-6b3e-4d8a-9c7b-5a2e1f3d4b6a', 15, 'Female', 'Yellow', 26, 700000, 'Available', false, true, true, true, true, true, 'Active Lab female.', 'Fetch professional.'),
  ('c4a5b6c7-d8e9-0a1b-2c3d-4e5f6a7b8c9d', 'Skye', 'b2c3d4e5-f6a7-8b9c-0d1e-a2b3c4d5e6f7', 7, 'Female', 'Black & White', 16, 1100000, 'Available', false, true, true, true, true, true, 'Agile Husky puppy.', 'Fast runner.'),
  ('d5a6b7c8-d9e0-1a2b-3c4d-5e6f7a8b9c0d', 'Ace', 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f60', 24, 'Male', 'Black', 35, 1500000, 'Available', true, true, true, true, true, true, 'European line Doberman.', 'Intense gaze.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Insert Dog Images
-- Clear existing demo images to allow clean re-run of script
DELETE FROM dog_images WHERE dog_id IN (
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e', 'c3d4e5f6-a7b8-4c9d-8e9f-0a1b2c3d4e5f',
  'd1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'e2f3c4d5-a6b7-8c9d-0e1f-2a3b4c5d6e7f', 'f3d4e5f6-a7b8-9c0d-e1f2-a3b4c5d6e7f8',
  'a1d2e3f4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', 'b2a3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', 'c3a4b5c6-d7e8-9a0b-1c2d-3e4f5a6b7c8d',
  'd4a5b6c7-d8e9-0a1b-2c3d-4e5f6a7b8c9d', 'e5a6b7c8-d9e0-1a2b-3c4d-5e6f7a8b9c0d', 'f6a7b8c9-d0e1-2a3b-4c5d-6e7f8a9b0c1d',
  'a7a8b9c0-d1e2-3a4b-5c6d-7e8f9a0b1c2d', 'b8a9b0c1-d2e3-4a5b-6c7d-8e9f0a1b2c3d', 'c9a0b1c2-d3e4-5a6b-7c8d-9e0f1a2b3c4d',
  'd0a1b2c3-d4e5-6a7b-8c9d-0e1f2a3b4c5d', 'a2a3b4c5-d6e7-8a9b-0c1d-2e3f4a5b6c7d', 'b3a4b5c6-d7e8-9a0b-1c2d-3e4f5a6b7c8d',
  'c4a5b6c7-d8e9-0a1b-2c3d-4e5f6a7b8c9d', 'd5a6b7c8-d9e0-1a2b-3c4d-5e6f7a8b9c0d'
);

INSERT INTO dog_images (dog_id, url, is_primary, display_order)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000', true, 0),
  ('b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000', true, 0),
  ('c3d4e5f6-a7b8-4c9d-8e9f-0a1b2c3d4e5f', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000', true, 0),
  ('d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000', true, 0),
  ('e2f3c4d5-a6b7-8c9d-0e1f-2a3b4c5d6e7f', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000', true, 0),
  ('f3d4e5f6-a7b8-9c0d-e1f2-a3b4c5d6e7f8', 'https://images.unsplash.com/photo-1605897472359-85e4b9482221?q=80&w=1000', true, 0),
  ('a1d2e3f4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000', true, 0),
  ('b2a3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000', true, 0),
  ('c3a4b5c6-d7e8-9a0b-1c2d-3e4f5a6b7c8d', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000', true, 0),
  ('d4a5b6c7-d8e9-0a1b-2c3d-4e5f6a7b8c9d', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000', true, 0),
  ('e5a6b7c8-d9e0-1a2b-3c4d-5e6f7a8b9c0d', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000', true, 0),
  ('f6a7b8c9-d0e1-2a3b-4c5d-6e7f8a9b0c1d', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000', true, 0),
  ('a7a8b9c0-d1e2-3a4b-5c6d-7e8f9a0b1c2d', 'https://images.unsplash.com/photo-1605897472359-85e4b9482221?q=80&w=1000', true, 0),
  ('b8a9b0c1-d2e3-4a5b-6c7d-8e9f0a1b2c3d', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000', true, 0),
  ('c9a0b1c2-d3e4-5a6b-7c8d-9e0f1a2b3c4d', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000', true, 0),
  ('d0a1b2c3-d4e5-6a7b-8c9d-0e1f2a3b4c5d', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000', true, 0),
  ('a2a3b4c5-d6e7-8a9b-0c1d-2e3f4a5b6c7d', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000', true, 0),
  ('b3a4b5c6-d7e8-9a0b-1c2d-3e4f5a6b7c8d', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000', true, 0),
  ('c4a5b6c7-d8e9-0a1b-2c3d-4e5f6a7b8c9d', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000', true, 0),
  ('d5a6b7c8-d9e0-1a2b-3c4d-5e6f7a8b9c0d', 'https://images.unsplash.com/photo-1605897472359-85e4b9482221?q=80&w=1000', true, 0);

-- 4. Set Initial Site Settings
INSERT INTO site_settings (key, value)
VALUES
  ('heroHeadline', '"Experience the Pinnacle of Dog Pedigree"'),
  ('heroSubheadline', '"At Krishnnad Syndicate, we don''t just breed dogs; we curate legacies."'),
  ('contactWhatsApp', '"+234 800 000 0000"'),
  ('contactEmail', '"hello@krishnnad.com"'),
  ('baseDeliveryFee', '50000')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
