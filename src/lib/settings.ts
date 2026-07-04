import { createAdminClient } from "./supabase/server";

export interface SiteSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  tagline: string;
  experience: string;
  happyCustomers: string;
  projectsDelivered: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
}

const defaultSettings: SiteSettings = {
  name: "RK Infracon",
  phone: "8499900100",
  email: "info@rkinfracon.in",
  address: "Uppal, Hyderabad, Telangana, India",
  workingHours: "Mon - Sat: 9:30 AM to 6:30 PM",
  tagline: "Trust In Us",
  experience: "15+",
  happyCustomers: "2000+",
  projectsDelivered: "15+",
  facebookUrl: "https://facebook.com/rkinfracon",
  instagramUrl: "https://instagram.com/rkinfracon",
  youtubeUrl: "https://youtube.com/@rkinfracon",
  linkedinUrl: "https://linkedin.com/company/rkinfracon",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("site_settings").select("key, value");
    
    if (error || !data) {
      console.error("Failed to fetch settings, using defaults", error);
      return defaultSettings;
    }

    const settings: Record<string, string> = {};
    data.forEach((row) => {
      settings[row.key] = row.value;
    });

    return {
      name: settings["name"] || defaultSettings.name,
      phone: settings["phone"] || defaultSettings.phone,
      email: settings["email"] || defaultSettings.email,
      address: settings["address"] || defaultSettings.address,
      workingHours: settings["working_hours"] || defaultSettings.workingHours,
      tagline: settings["tagline"] || defaultSettings.tagline,
      experience: settings["experience"] || defaultSettings.experience,
      happyCustomers: settings["happy_customers"] || defaultSettings.happyCustomers,
      projectsDelivered: settings["projects_delivered"] || defaultSettings.projectsDelivered,
      facebookUrl: settings["facebook_url"] || defaultSettings.facebookUrl,
      instagramUrl: settings["instagram_url"] || defaultSettings.instagramUrl,
      youtubeUrl: settings["youtube_url"] || defaultSettings.youtubeUrl,
      linkedinUrl: settings["linkedin_url"] || defaultSettings.linkedinUrl,
    };
  } catch (err) {
    console.error("Error fetching settings:", err);
    return defaultSettings;
  }
}
