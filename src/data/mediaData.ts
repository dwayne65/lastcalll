export interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  size: string;
  dimensions?: string;
  uploadedAt: string;
  url: string;
  thumbnail?: string;
}

export const mockMedia: MediaItem[] = [
  { id: "1", name: "hero-banner.jpg", type: "image", size: "2.4 MB", dimensions: "1920×1080", uploadedAt: "2025-02-25", url: "#", thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80" },
  { id: "2", name: "sermon-thumbnail.jpg", type: "image", size: "890 KB", dimensions: "800×600", uploadedAt: "2025-02-24", url: "#", thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&q=80" },
  { id: "3", name: "worship-night.jpg", type: "image", size: "1.8 MB", dimensions: "1600×900", uploadedAt: "2025-02-23", url: "#", thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&q=80" },
  { id: "4", name: "pastor-james-profile.jpg", type: "image", size: "650 KB", dimensions: "500×500", uploadedAt: "2025-02-22", url: "#", thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { id: "5", name: "sunday-sermon-feb23.mp4", type: "video", size: "245 MB", uploadedAt: "2025-02-23", url: "#" },
  { id: "6", name: "hymn-amazing-grace.mp3", type: "audio", size: "8.2 MB", uploadedAt: "2025-02-21", url: "#" },
  { id: "7", name: "bible-study-guide.pdf", type: "document", size: "1.1 MB", uploadedAt: "2025-02-20", url: "#" },
  { id: "8", name: "church-exterior.jpg", type: "image", size: "3.1 MB", dimensions: "2400×1600", uploadedAt: "2025-02-19", url: "#", thumbnail: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&q=80" },
  { id: "9", name: "youth-retreat-recap.mp4", type: "video", size: "180 MB", uploadedAt: "2025-02-18", url: "#" },
  { id: "10", name: "quarterly-newsletter.pdf", type: "document", size: "4.5 MB", uploadedAt: "2025-02-17", url: "#" },
  { id: "11", name: "choir-performance.mp3", type: "audio", size: "12 MB", uploadedAt: "2025-02-16", url: "#" },
  { id: "12", name: "baptism-ceremony.jpg", type: "image", size: "1.9 MB", dimensions: "1200×800", uploadedAt: "2025-02-15", url: "#", thumbnail: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80" },
];
