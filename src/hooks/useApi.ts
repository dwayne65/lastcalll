import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Sermon,
  Post,
  Resource,
  Page,
  Series,
  Category,
  Tag,
  MediaAsset,
  Donation,
  DonationStats,
  Campaign,
  InitiateDonationRequest,
  Subscriber,
  Inquiry,
  Setting,
  SocialLink,
  User,
  DashboardStats,
  ActivityItem,
  SearchResult,
  PaginatedResult,
} from "@/lib/api-types";

// ─── Sermons ───────────────────────────────────────────────
export function usePublishedSermons(params?: {
  page?: number;
  limit?: number;
  search?: string;
  speaker?: string;
  sort?: string;
  seriesId?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.speaker) query.set("speaker", params.speaker);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.seriesId) query.set("seriesId", params.seriesId);
  const qs = query.toString();
  return useQuery<PaginatedResult<Sermon>>({
    queryKey: ["sermons", "published", params],
    queryFn: () => api.get(`/sermons/published${qs ? `?${qs}` : ""}`),
  });
}

export function useSermonBySlug(slug: string | undefined) {
  return useQuery<Sermon>({
    queryKey: ["sermon", slug],
    queryFn: () => api.get(`/sermons/slug/${slug}`),
    enabled: !!slug,
  });
}

export function useSpeakers() {
  return useQuery<string[]>({
    queryKey: ["sermon-speakers"],
    queryFn: () => api.get("/sermons/speakers"),
  });
}

export function useAdminSermons(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return useQuery<PaginatedResult<Sermon>>({
    queryKey: ["admin-sermons", params],
    queryFn: () => api.get(`/sermons${qs ? `?${qs}` : ""}`),
  });
}

export function useCreateSermon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Sermon> & { tagIds?: string[] }) =>
      api.post<Sermon>("/sermons", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sermons"] });
      qc.invalidateQueries({ queryKey: ["admin-sermons"] });
    },
  });
}

export function useUpdateSermon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Sermon> & { id: string; tagIds?: string[] }) =>
      api.patch<Sermon>(`/sermons/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sermons"] });
      qc.invalidateQueries({ queryKey: ["admin-sermons"] });
    },
  });
}

export function useDeleteSermon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/sermons/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sermons"] });
      qc.invalidateQueries({ queryKey: ["admin-sermons"] });
    },
  });
}

// ─── Posts ──────────────────────────────────────────────────
export function usePublishedPosts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.categoryId) query.set("categoryId", params.categoryId);
  const qs = query.toString();
  return useQuery<PaginatedResult<Post>>({
    queryKey: ["posts", "published", params],
    queryFn: () => api.get(`/posts/published${qs ? `?${qs}` : ""}`),
  });
}

export function usePostBySlug(slug: string | undefined) {
  return useQuery<Post>({
    queryKey: ["post", slug],
    queryFn: () => api.get(`/posts/slug/${slug}`),
    enabled: !!slug,
  });
}

export function useAdminPosts(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return useQuery<PaginatedResult<Post>>({
    queryKey: ["admin-posts", params],
    queryFn: () => api.get(`/posts${qs ? `?${qs}` : ""}`),
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Post> & { tagIds?: string[] }) =>
      api.post<Post>("/posts", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Post> & { id: string; tagIds?: string[] }) =>
      api.patch<Post>(`/posts/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/posts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });
}

// ─── Pages ─────────────────────────────────────────────────
export function usePageBySlug(slug: string) {
  return useQuery<Page>({
    queryKey: ["page", slug],
    queryFn: () => api.get(`/pages/slug/${slug}`),
  });
}

export function useAdminPages() {
  return useQuery<PaginatedResult<Page>>({
    queryKey: ["admin-pages"],
    queryFn: () => api.get("/pages"),
  });
}

export function useCreatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Page>) => api.post<Page>("/pages", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-pages"] }),
  });
}

export function useUpdatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Page> & { id: string }) =>
      api.patch<Page>(`/pages/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-pages"] }),
  });
}

// ─── Resources ─────────────────────────────────────────────
export function usePublishedResources() {
  return useQuery<PaginatedResult<Resource>>({
    queryKey: ["resources", "published"],
    queryFn: () => api.get("/resources/published"),
  });
}

export function useCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Resource> & { tagIds?: string[] }) =>
      api.post<Resource>("/resources", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources"] }),
  });
}

export function useUpdateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Resource> & { id: string; tagIds?: string[] }) =>
      api.patch<Resource>(`/resources/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resources"] }),
  });
}

export function useAdminResources(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return useQuery<PaginatedResult<Resource>>({
    queryKey: ["admin-resources", params],
    queryFn: () => api.get(`/resources${qs ? `?${qs}` : ""}`),
  });
}

export function useDeleteResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/resources/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["resources"] });
      qc.invalidateQueries({ queryKey: ["admin-resources"] });
    },
  });
}

// ─── Series ────────────────────────────────────────────────
export function useSeries() {
  return useQuery<Series[]>({
    queryKey: ["series"],
    queryFn: () => api.get("/series"),
  });
}

export function useSeriesBySlug(slug: string | undefined) {
  return useQuery<Series>({
    queryKey: ["series", slug],
    queryFn: () => api.get(`/series/slug/${slug}`),
    enabled: !!slug,
  });
}

export function useCreateSeries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string; coverUrl?: string }) =>
      api.post<Series>("/series", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["series"] }),
  });
}

export function useUpdateSeries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; title?: string; description?: string; coverUrl?: string }) =>
      api.patch<Series>(`/series/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["series"] }),
  });
}

export function useDeleteSeries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/series/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["series"] }),
  });
}

// ─── Categories & Tags ─────────────────────────────────────
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories"),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      api.post<Category>("/categories", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; description?: string }) =>
      api.patch<Category>(`/categories/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: () => api.get("/tags"),
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) =>
      api.post<Tag>("/tags", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
  });
}

export function useUpdateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name: string }) =>
      api.patch<Tag>(`/tags/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tags/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
  });
}

// ─── Media ─────────────────────────────────────────────────
export function useMedia(params?: { page?: number; limit?: number; type?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.type) query.set("type", params.type);
  const qs = query.toString();
  return useQuery<PaginatedResult<MediaAsset>>({
    queryKey: ["media", params],
    queryFn: () => api.get(`/media${qs ? `?${qs}` : ""}`),
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.upload<MediaAsset>("/media/upload", form);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/media/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

// ─── Donations ─────────────────────────────────────────────
export function useDonations(params?: { page?: number; limit?: number; search?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return useQuery<PaginatedResult<Donation>>({
    queryKey: ["donations", params],
    queryFn: () => api.get(`/donations${qs ? `?${qs}` : ""}`),
  });
}

export function useDonationStats() {
  return useQuery<DonationStats>({
    queryKey: ["donation-stats"],
    queryFn: () => api.get("/donations/stats"),
  });
}

export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: () => api.get("/donations/campaigns"),
  });
}

export function useInitiateDonation() {
  return useMutation({
    mutationFn: (data: InitiateDonationRequest) =>
      api.post<{ donation: Donation; checkoutUrl: string }>("/donations/initiate", data),
  });
}

// ─── Subscribers ───────────────────────────────────────────
export function useSubscribe() {
  return useMutation({
    mutationFn: (data: { email: string; firstName?: string; lastName?: string }) =>
      api.post<Subscriber>("/subscribers", data),
  });
}

export function useAdminSubscribers(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return useQuery<PaginatedResult<Subscriber>>({
    queryKey: ["admin-subscribers", params],
    queryFn: () => api.get(`/subscribers${qs ? `?${qs}` : ""}`),
  });
}

export function useSubscriberStats() {
  return useQuery<{ total: number; active: number }>({
    queryKey: ["subscriber-stats"],
    queryFn: () => api.get("/subscribers/stats"),
  });
}

// ─── Inquiries (Contact) ───────────────────────────────────
export function useCreateInquiry() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; subject?: string; message: string }) =>
      api.post<Inquiry>("/inquiries", data),
  });
}

export function useAdminInquiries(params?: { page?: number; limit?: number; isRead?: boolean }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.isRead !== undefined) query.set("isRead", String(params.isRead));
  const qs = query.toString();
  return useQuery<PaginatedResult<Inquiry>>({
    queryKey: ["admin-inquiries", params],
    queryFn: () => api.get(`/inquiries${qs ? `?${qs}` : ""}`),
  });
}

export function useMarkInquiryRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<Inquiry>(`/inquiries/${id}/read`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });
}

export function useDeleteInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/inquiries/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });
}

// ─── Settings ──────────────────────────────────────────────
export function usePublicSettings() {
  return useQuery<Record<string, string>>({
    queryKey: ["public-settings"],
    queryFn: () => api.get("/settings/public"),
  });
}

export function useSettings(group?: string) {
  return useQuery<Record<string, Record<string, string>>>({
    queryKey: ["settings", group],
    queryFn: () => api.get(group ? `/settings/${group}` : "/settings"),
  });
}

export function useSettingsByGroup(group: string) {
  return useQuery<Record<string, string>>({
    queryKey: ["settings", group],
    queryFn: () => api.get(`/settings/${group}`),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: { key: string; value: string; group?: string }[]) =>
      api.put("/settings", { settings }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["public-settings"] });
    },
  });
}

export function useSocialLinks() {
  return useQuery<SocialLink[]>({
    queryKey: ["social-links"],
    queryFn: () => api.get("/settings/social-links"),
  });
}

// ─── Users (Admin) ─────────────────────────────────────────
export function useAdminUsers(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return useQuery<PaginatedResult<User>>({
    queryKey: ["admin-users", params],
    queryFn: () => api.get(`/users${qs ? `?${qs}` : ""}`),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; role?: string; isActive?: boolean; firstName?: string; lastName?: string }) =>
      api.patch<User>(`/users/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useInviteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; firstName?: string; lastName?: string; role?: string; password?: string }) =>
      api.post<User>("/users/invite", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

// ─── Dashboard ─────────────────────────────────────────────
export function usePublicStats() {
  return useQuery<{ publishedSermons: number; activeSubscribers: number; totalSermonViews: number }>({
    queryKey: ["public-stats"],
    queryFn: () => api.get("/dashboard/public-stats"),
  });
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get("/dashboard/stats"),
  });
}

export function useDashboardActivity() {
  return useQuery<ActivityItem[]>({
    queryKey: ["dashboard-activity"],
    queryFn: () => api.get("/dashboard/activity"),
  });
}

// ─── Search ────────────────────────────────────────────────
export function useSearch(query: string) {
  return useQuery<SearchResult>({
    queryKey: ["search", query],
    queryFn: () => api.get(`/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
  });
}
