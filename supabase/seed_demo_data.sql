-- Krishnnad Syndicate Demo Data Seed - Expanded (20+ Dogs)

-- 1. Insert Breeds
INSERT INTO breeds (id, name, origin, temperament, size_category, life_expectancy, description, cover_image_url)
VALUES 
  ('8d3c5b52-2598-4b72-9b2f-7634283c748c', 'German Shepherd', 'Germany', 'Confident, Courageous, Smart', 'large', '7-10 years', 'The German Shepherd Dog is one of America''s most popular dog breeds—for good reason. They''re intelligent and capable working dogs.', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000'),
  ('5af54f1d-72fb-4e78-9993-4560938f1234', 'Golden Retriever', 'Scotland', 'Friendly, Intelligent, Devoted', 'large', '10-12 years', 'The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000'),
  ('7320498b-2856-4b6e-826c-d225197823f4', 'Rottweiler', 'Germany', 'Loyal, Loving, Confident Guardian', 'large', '9-10 years', 'The Rottweiler is a robust working breed of great strength descended from the mastiffs of the Roman legions.', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000'),
  ('f4d2a1c9-6b3e-4d8a-9c7b-5a2e1f3d4b6a', 'Labrador Retriever', 'Canada', 'Kind, Pleasant, Outgoing', 'large', '10-12 years', 'The sweet-faced, lovable Labrador Retriever is America’s most popular dog breed.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000'),
  ('d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6g', 'Doberman Pinscher', 'Germany', 'Loyal, Fearless, Alert', 'large', '10-12 years', 'Sleek and powerful, possessing both a magnificent physique and keen intelligence.', 'https://images.unsplash.com/photo-1605897472359-85e4b9482221?q=80&w=1000'),
  ('a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 'French Bulldog', 'France', 'Adaptable, Playful, Smart', 'small', '10-12 years', 'The one-of-a-kind French Bulldog, with his large bat ears and even disposition.', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000'),
  ('b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 'Siberian Husky', 'Siberia', 'Loyal, Outgoing, Mischievous', 'medium', '12-14 years', 'The Siberian Husky, a thickly coated, compact sled dog of medium size and great endurance.', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Insert Dogs (20+ Total)
INSERT INTO dogs (id, name, breed_id, age_months, gender, color, weight_kg, price, status, is_featured, health_certified, vaccinated, dewormed, microchipped, pedigree_certified, description, care_notes)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Shadow', '8d3c5b52-2598-4b72-9b2f-7634283c748c', 24, 'Male', 'Black & Tan', 32, 1200000, 'Available', true, true, true, true, true, true, 'Shadow is a champion bloodline German Shepherd.', 'Requires active exercise.'),
  ('b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e', 'Bella', '5af54f1d-72fb-4e78-9993-4560938f1234', 18, 'Female', 'Golden', 28, 850000, 'Available', true, true, true, true, true, true, 'Bella is the sweetest Golden Retriever.', 'Regular grooming required.'),
  ('c3d4e5f6-a7b8-4c9d-8e9f-0a1b2c3d4e5f', 'Kaiser', '7320498b-2856-4b6e-826c-d225197823f4', 36, 'Male', 'Black & Mahogany', 45, 1500000, 'Available', true, true, true, true, true, true, 'Kaiser is a massive Rottweiler.', 'Socialization recommended.'),
  ('d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Max', 'f4d2a1c9-6b3e-4d8a-9c7b-5a2e1f3d4b6a', 6, 'Male', 'Yellow', 15, 600000, 'Available', true, true, true, true, true, false, 'Playful Labrador puppy.', 'Needs lots of toys.'),
  ('e2f3g4h5-i6j7-8k9l-m0n1-o2p3q4r5s6t7', 'Luna', 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 12, 'Female', 'White & Grey', 20, 950000, 'Available', true, true, true, true, true, true, 'Stunning Husky with blue eyes.', 'Keep in cool environment.'),
  ('f3g4h5i6-j7k8-9l0m-n1o2-p3q4r5s6t7u8', 'Duke', 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6g', 8, 'Male', 'Black & Rust', 25, 1300000, 'Available', false, true, true, true, true, true, 'Strong and alert Doberman.', 'Training essential.'),
  ('g4h5i6j7-k8l9-0m1n-o2p3-q4r5s6t7u8v9', 'Coco', 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 4, 'Female', 'Fawn', 8, 1800000, 'Available', true, true, true, true, true, true, 'Adorable Frenchie puppy.', 'Avoid excessive heat.'),
  ('h5i6j7k8-l9m0-1n2o-p3q4-r5s6t7u8v9w0', 'Rocky', '8d3c5b52-2598-4b72-9b2f-7634283c748c', 10, 'Male', 'Black & Tan', 28, 900000, 'Available', false, true, true, true, true, true, 'Young German Shepherd energetic.', 'Good for active homes.'),
  ('i6j7k8l9-m0n1-2o3p-q4r5-s6t7u8v9w0x1', 'Molly', '5af54f1d-72fb-4e78-9993-4560938f1234', 5, 'Female', 'Cream', 12, 750000, 'Available', false, true, true, true, true, true, 'Bright Golden Retriever pup.', 'Loves to fetch.'),
  ('j7k8l9m0-n1o2-3p4q-r5s6-t7u8v9w0x1y2', 'Bruno', '7320498b-2856-4b6e-826c-d225197823f4', 18, 'Male', 'Black', 38, 1100000, 'Available', false, true, true, true, true, true, 'Protective Rottweiler.', 'Fenced yard required.'),
  ('k8l9m0n1-o2p3-4q5r-s6t7-u8v9w0x1y2z3', 'Daisy', 'f4d2a1c9-6b3e-4d8a-9c7b-5a2e1f3d4b6a', 3, 'Female', 'Chocolate', 6, 800000, 'Available', true, true, true, true, true, true, 'Chocolate Lab puppy.', 'Very food motivated.'),
  ('l9m0n1o2-p3q4-5r6s-t7u8-v9w1x2y3z4a5', 'Ghost', 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 24, 'Male', 'Pure White', 24, 1400000, 'Available', true, true, true, true, true, true, 'Rare all-white Husky.', 'Will howl at the moon.'),
  ('m0n1o2p3-q4r5-6s7t-u8v9-w1x2y3z4a5b6', 'Roxy', 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6g', 5, 'Female', 'Rust', 18, 1200000, 'Available', false, true, true, true, true, true, 'Athletic Doberman female.', 'High energy.'),
  ('n1o2p3q4-r5s6-7t8u-v9w1-x2y3z4a5b6c7', 'Stitch', 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 6, 'Male', 'Blue', 10, 2500000, 'Available', true, true, true, true, true, true, 'Rare Blue Frenchie.', 'Indoor dog only.'),
  ('o2p3q4r5-s6t7-8u9v-w1x2-y3z4a5b6c7d8', 'Atlas', '8d3c5b52-2598-4b72-9b2f-7634283c748c', 36, 'Male', 'Sable', 40, 1800000, 'Available', true, true, true, true, true, true, 'Full grown working line GSD.', 'Experienced owners.'),
  ('p3q4r5s6-t7u8-9v0w-x1y2-z3a4b5c6d7e8', 'Zoe', '5af54f1d-72fb-4e78-9993-4560938f1234', 8, 'Female', 'Light Gold', 22, 900000, 'Available', false, true, true, true, true, true, 'Elegant Golden female.', 'Loves people.'),
  ('q4r5s6t7-u8v9-0w1x-y2z3-a4b5c6d7e8f9', 'Tyson', '7320498b-2856-4b6e-826c-d225197823f4', 4, 'Male', 'Black & Mahogany', 12, 850000, 'Available', false, true, true, true, true, true, 'Rottweiler pup.', 'Giant paws.'),
  ('r5s6t7u8-v9w1-1x2y-z3a4-b5c6d7e8f9g0', 'Nala', 'f4d2a1c9-6b3e-4d8a-9c7b-5a2e1f3d4b6a', 15, 'Female', 'Yellow', 26, 700000, 'Available', false, true, true, true, true, true, 'Active Lab female.', 'Fetch professional.'),
  ('s6t7u8v9-w1x2-2y3z-a4b5-c6d7e8f9g0h1', 'Skye', 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 7, 'Female', 'Black & White', 16, 1100000, 'Available', false, true, true, true, true, true, 'Agile Husky puppy.', 'Fast runner.'),
  ('t7u8v9w1-x2y3-3z4a-b5c6-d7e8f9g0h1i2', 'Ace', 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6g', 24, 'Male', 'Black', 35, 1500000, 'Available', true, true, true, true, true, true, 'European line Doberman.', 'Intense gaze.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Insert Dog Images (Matching IDs)
INSERT INTO dog_images (dog_id, url, is_primary, display_order)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000', true, 0),
  ('b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000', true, 0),
  ('c3d4e5f6-a7b8-4c9d-8e9f-0a1b2c3d4e5f', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000', true, 0),
  ('d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000', true, 0),
  ('e2f3g4h5-i6j7-8k9l-m0n1-o2p3q4r5s6t7', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000', true, 0),
  ('f3g4h5i6-j7k8-9l0m-n1o2-p3q4r5s6t7u8', 'https://images.unsplash.com/photo-1605897472359-85e4b9482221?q=80&w=1000', true, 0),
  ('g4h5i6j7-k8l9-0m1n-o2p3-q4r5s6t7u8v9', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000', true, 0),
  ('h5i6j7k8-l9m0-1n2o-p3q4-r5s6t7u8v9w0', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000', true, 0),
  ('i6j7k8l9-m0n1-2o3p-q4r5-s6t7u8v9w0x1', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000', true, 0),
  ('j7k8l9m0-n1o2-3p4q-r5s6-t7u8v9w0x1y2', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000', true, 0),
  ('k8l9m0n1-o2p3-4q5r-s6t7-u8v9w0x1y2z3', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000', true, 0),
  ('l9m0n1o2-p3q4-5r6s-t7u8-v9w1x2y3z4a5', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000', true, 0),
  ('m0n1o2p3-q4r5-6s7t-u8v9-w1x2y3z4a5b6', 'https://images.unsplash.com/photo-1605897472359-85e4b9482221?q=80&w=1000', true, 0),
  ('n1o2p3q4-r5s6-7t8u-v9w1-x2y3z4a5b6c7', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000', true, 0),
  ('o2p3q4r5-s6t7-8u9v-w1x2-y3z4a5b6c7d8', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000', true, 0),
  ('p3q4r5s6-t7u8-9v0w-x1y2-z3a4b5c6d7e8', 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000', true, 0),
  ('q4r5s6t7-u8v9-0w1x-y2z3-a4b5c6d7e8f9', 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?q=80&w=1000', true, 0),
  ('r5s6t7u8-v9w1-1x2y-z3a4-b5c6d7e8f9g0', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000', true, 0),
  ('s6t7u8v9-w1x2-2y3z-a4b5-c6d7e8f9g0h1', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000', true, 0),
  ('t7u8v9w1-x2y3-3z4a-b5c6-d7e8f9g0h1i2', 'https://images.unsplash.com/photo-1605897472359-85e4b9482221?q=80&w=1000', true, 0)
ON CONFLICT (dog_id, url) DO NOTHING;

-- 4. Set Initial Site Settings
INSERT INTO site_settings (key, value)
VALUES
  ('heroHeadline', '"Experience the Pinnacle of Dog Pedigree"'),
  ('heroSubheadline', '"At Krishnnad Syndicate, we don''t just breed dogs; we curate legacies."'),
  ('contactWhatsApp', '"+234 800 000 0000"'),
  ('contactEmail', '"hello@krishnnad.com"'),
  ('baseDeliveryFee', '50000')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
