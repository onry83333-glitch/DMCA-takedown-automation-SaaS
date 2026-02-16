export type Profile = {
  id: string;
  email: string;
  stripchat_username: string | null;
  created_at: string;
};

export type RequestBatch = {
  id: string;
  user_id: string;
  target_platform: string;
  total_urls: number;
  successful_count: number;
  failed_count: number;
  pending_count: number;
  status: "pending" | "submitted" | "removed" | "failed";
  created_at: string;
};

export type RequestUrl = {
  id: string;
  batch_id: string;
  infringing_url: string;
  source_site: string | null;
  status: "pending" | "submitted" | "removed" | "failed";
  submitted_at: string | null;
  removed_at: string | null;
  created_at: string;
};

export type SearchLog = {
  id: string;
  user_id: string;
  query: string;
  results_count: number;
  created_at: string;
};
