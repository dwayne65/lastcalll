// ─── Enums ─────────────────────────────────────────────────
export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONTRIBUTOR" | "FINANCE" | "VIEWER";
export type ContentStatus = "DRAFT" | "PENDING" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
export type DonationStatus = "INITIATED" | "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
export type PaymentMethod = "CARD" | "MOBILE_MONEY" | "PAYPAL" | "BANK";

// ─── Auth ──────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: { id: string; email: string; role: Role };
  accessToken: string;
  refreshToken: string;
}

// ─── Pagination ────────────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Sermon ────────────────────────────────────────────────
export interface Sermon {
  id: string;
  title: string;
  slug: string;
  description?: string;
  transcript?: string;
  scripture?: string;
  speaker: string;
  duration?: string;
  status: ContentStatus;
  publishedAt?: string;
  scheduledAt?: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  pdfUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  viewCount: number;
  seriesId?: string;
  series?: Series;
  author?: { id: string; firstName: string; lastName: string };
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

// ─── Post ──────────────────────────────────────────────────
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  status: ContentStatus;
  publishedAt?: string;
  featuredImage?: string;
  readingTime?: number;
  viewCount: number;
  authorId: string;
  author?: { id: string; firstName: string; lastName: string };
  categoryId?: string;
  category?: Category;
  seriesId?: string;
  series?: Series;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

// ─── Page ──────────────────────────────────────────────────
export interface Page {
  id: string;
  title: string;
  slug: string;
  body: string;
  status: ContentStatus;
  publishedAt?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Resource ──────────────────────────────────────────────
export interface Resource {
  id: string;
  title: string;
  slug: string;
  description?: string;
  type: string;
  fileUrl: string;
  coverUrl?: string;
  fileSize?: number;
  status: ContentStatus;
  publishedAt?: string;
  downloadCount: number;
  authorId: string;
  categoryId?: string;
  seriesId?: string;
  series?: Series;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

// ─── Taxonomy ──────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  sermonCount?: number;
  _count?: { sermons: number; posts: number; resources: number };
  sermons?: Sermon[];
  createdAt: string;
  updatedAt: string;
}

// ─── Media ─────────────────────────────────────────────────
export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  type: MediaType;
  size: number;
  width?: number;
  height?: number;
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
}

// ─── Donation ──────────────────────────────────────────────
export interface Donation {
  id: string;
  reference: string;
  donorName?: string;
  donorEmail?: string;
  amount: number;
  currency: string;
  status: DonationStatus;
  paymentMethod: PaymentMethod;
  isRecurring: boolean;
  isAnonymous: boolean;
  campaignId?: string;
  campaign?: Campaign;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  description?: string;
  goalAmount?: number;
  isActive: boolean;
}

export interface DonationStats {
  totalAmount: number;
  monthlyAmount: number;
  totalCount: number;
}

export interface InitiateDonationRequest {
  donorName?: string;
  donorEmail?: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  isRecurring?: boolean;
  isAnonymous?: boolean;
  campaignId?: string;
}

// ─── Subscriber ────────────────────────────────────────────
export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Inquiry ───────────────────────────────────────────────
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Settings ──────────────────────────────────────────────
export interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

// ─── Dashboard ─────────────────────────────────────────────
export interface DashboardStats {
  totalDonations: number;
  monthlyDonations: number;
  publishedSermons: number;
  activeSubscribers: number;
  totalSermonViews: number;
}

// ─── Users ─────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Activity ──────────────────────────────────────────────
export interface ActivityItem {
  type: string;
  action: string;
  detail: string;
  time: string;
}

// ─── Search ────────────────────────────────────────────────
export interface SearchResult {
  sermons: Sermon[];
  posts: Post[];
  resources: Resource[];
  pages: Page[];
}

export interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  createdAt: string;
}

// ─── Search ────────────────────────────────────────────────
export interface SearchResult {
  sermons: Sermon[];
  posts: Post[];
  resources: Resource[];
}

// ─── User (admin) ──────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}
