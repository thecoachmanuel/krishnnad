import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const sqlPath = path.join(process.cwd(), "supabase", "seed_demo_data.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  // Since we can't easily run arbitrary SQL blocks via the JS client for everything 
  // (like multiple inserts with specific IDs), we'll do them sequentially or 
  // use a RPC if available. 
  // However, for this environment, the best way is usually to provide the SQL for the dashboard.
  // But I will try to do it via the API for the main tables.

  console.log("Seeding breeds...");
  const { error: breedError } = await supabase.from("breeds").upsert([
    {
      id: "8d3c5b52-2598-4b72-9b2f-7634283c748c",
      name: "German Shepherd",
      origin: "Germany",
      temperament: "Confident, Courageous, Smart",
      size_category: "large",
      life_expectancy: "7-10 years",
      description: "Intelligent and capable working dogs.",
      cover_image_url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000"
    },
    {
      id: "5af54f1d-72fb-4e78-9993-4560938f1234",
      name: "Golden Retriever",
      origin: "Scotland",
      temperament: "Friendly, Intelligent, Devoted",
      size_category: "large",
      life_expectancy: "10-12 years",
      description: "Sturdy, muscular dog of medium size.",
      cover_image_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000"
    }
  ]);

  if (breedError) console.error("Breed seed error:", breedError);

  console.log("Seeding dogs...");
  const { error: dogError } = await supabase.from("dogs").upsert([
    {
      id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      name: "Shadow",
      breed_id: "8d3c5b52-2598-4b72-9b2f-7634283c748c",
      age_months: 24,
      gender: "Male",
      color: "Black & Tan",
      weight_kg: 32,
      price: 1200000,
      status: "Available",
      is_featured: true,
      health_certified: true,
      vaccinated: true,
      description: "Champion bloodline German Shepherd."
    },
    {
      id: "b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e",
      name: "Bella",
      breed_id: "5af54f1d-72fb-4e78-9993-4560938f1234",
      age_months: 18,
      gender: "Female",
      color: "Golden",
      weight_kg: 28,
      price: 850000,
      status: "Available",
      is_featured: true,
      health_certified: true,
      vaccinated: true,
      description: "Sweetest Golden Retriever."
    }
  ]);

  if (dogError) console.error("Dog seed error:", dogError);

  console.log("Seeding images...");
  await supabase.from("dog_images").upsert([
    { dog_id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1000", is_primary: true },
    { dog_id: "b2c3d4e5-f6a7-4b6c-8d9e-0f1a2b3c4d5e", url: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000", is_primary: true }
  ]);

  console.log("Seed complete.");
}

seed();
