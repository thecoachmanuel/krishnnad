-- 1. Branding
INSERT INTO site_settings (key, value)
VALUES ('branding', '{
  "siteName": "Krishnnad Syndicate",
  "tagline": "Curating Canine Legacies",
  "announcement": "New Elite Litter: Doberman Pinschers coming in May 2026!",
  "logoUrl": ""
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Homepage Content
INSERT INTO site_settings (key, value)
VALUES ('home_content', '{
  "heroTitle": "Experience the Pinnacle of Dog Pedigree",
  "heroSubtitle": "At Krishnnad Syndicate, we don''t just breed dogs; we curate legacies. Discover your world-class companion today.",
  "heroCtaMain": "Browse Collection",
  "heroCtaSecondary": "Contact Us",
  "featuresTitle": "Why Choose Krishnnad?",
  "features": [
    { "icon": "ShieldCheck", "title": "Health Guaranteed", "desc": "Every puppy undergoes rigorous veterinary checks and genetic screening." },
    { "icon": "Award", "title": "Elite Pedigree", "desc": "World-class bloodlines carefully selected for temperament and structure." },
    { "icon": "Heart", "title": "Lifetime Support", "desc": "We remain your partner throughout your dog''s entire life journey." }
  ],
  "ctaTitle": "Start Your Journey Today.",
  "ctaSubtitle": "Our concierge team is ready to match you with your perfect lifetime companion."
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. Testimonials
INSERT INTO site_settings (key, value)
VALUES ('testimonials', '[
  { "author": "Adekunle M.", "role": "Lagos, Nigeria", "quote": "Caesar has been a dream. His temperament is rock solid and the health package was so thorough.", "rating": 5 },
  { "author": "Chibuzor O.", "role": "Abuja, Nigeria", "quote": "The team at Krishnnad made the process so easy. Our Golden Retriever is the heart of our home now.", "rating": 5 },
  { "author": "Sarah J.", "role": "Lagos, Nigeria", "quote": "Buying from a trusted breeder matters. The lifetime support has been invaluable for us.", "rating": 5 }
]')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. About Page
INSERT INTO site_settings (key, value)
VALUES ('page_about', '{
  "title": "Our Story",
  "subtitle": "Dedicated to breeding the finest, healthiest companion and working dogs in Nigeria.",
  "storyTitle": "Uncompromising Quality",
  "storyText": "Founded on the principles of ethical breeding, Krishnnad Syndicate ensures that every puppy raised under our banner meets world-class standards. Our breeding program focuses intensely on genetic health, robust temperament, and breed-standard conformation.",
  "missionItems": [
    { "title": "Health First", "desc": "Every litter is born into a pristine environment, fully vetted, vaccinated, and microchipped." },
    { "title": "Pedigree Lines", "desc": "We import and rigorously select our sires and dams to ensure elite offspring." }
  ],
  "imageUrl": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
  "quote": "Not just dogs. A legacy."
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 5. Contact Page & Global Details
INSERT INTO site_settings (key, value)
VALUES ('page_contact', '{
  "title": "Contact Us",
  "subtitle": "Have questions about a listing? Let''s talk.",
  "address": "Lagos, Nigeria (Appointment Only)",
  "whatsapp": "+234 800 000 0000",
  "email": "hello@krishnnad.com",
  "instagram": "@krishnnad_syndicate",
  "supportText": "We prioritize our customer''s experience. Reach out for any enquiries."
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
