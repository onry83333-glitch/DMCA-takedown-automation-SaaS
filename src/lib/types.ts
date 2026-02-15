export type Profile = {
  id: string;
  email: string;
  stripchat_username: string | null;
  created_at: string;
};

export type RequestBatch = {
  id: string;
  user_id: string;
  platform: string;
  url_count: number;
  status: "pending" | "submitted" | "removed" | "failed";
  created_at: string;
};

export type RequestUrl = {
  id: string;
  batch_id: string;
  url: string;
  status: "pending" | "submitted" | "removed" | "failed";
  created_at: string;
};

export type SearchLog = {
  id: string;
  user_id: string;
  query: string;
  results_count: number;
  created_at: string;
};
