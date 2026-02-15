"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RequestBatch, RequestUrl } from "@/lib/types";

export default function RequestsPage() {
  const [batches, setBatches] = useState<RequestBatch[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [batchUrls, setBatchUrls] = useState<Record<string, RequestUrl[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("request_batches")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setBatches(data);
      setLoading(false);
    };

    fetchBatches();
  }, []);

  const toggleExpand = async (batchId: string) => {
    if (expandedId === batchId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(batchId);

    if (!batchUrls[batchId]) {
      const supabase = createClient();
      const { data } = await supabase
        .from("request_urls")
        .select("*")
        .eq("batch_id", batchId)
        .order("created_at", { ascending: true });

      if (data) {
        setBatchUrls((prev) => ({ ...prev, [batchId]: data }));
      }
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
      submitted: "bg-blue-900/50 text-blue-300 border-blue-700",
      removed: "bg-green-900/50 text-green-300 border-green-700",
      failed: "bg-red-900/50 text-red-300 border-red-700",
    };
    const labels: Record<string, string> = {
      pending: "保留中",
      submitted: "送信済み",
      removed: "削除成功",
      failed: "失敗",
    };
    return (
      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${styles[status] ?? styles.pending}`}>
        {labels[status] ?? status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">申請履歴</h1>

      {batches.length === 0 ? (
        <p className="text-gray-500">まだ申請がありません</p>
      ) : (
        <div className="space-y-3">
          {batches.map((batch) => (
            <div key={batch.id} className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
              {/* Batch row */}
              <button
                onClick={() => toggleExpand(batch.id)}
                className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-gray-800 sm:px-6"
              >
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  <span className="text-sm text-gray-400">
                    {new Date(batch.created_at).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-sm font-medium text-white">{batch.target_platform}</span>
                  <span className="text-sm text-gray-400">{batch.url_count} URL</span>
                  {statusBadge(batch.status)}
                </div>
                <svg
                  className={`h-5 w-5 text-gray-400 transition ${expandedId === batch.id ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded URLs */}
              {expandedId === batch.id && (
                <div className="border-t border-gray-800 bg-gray-950 px-4 py-4 sm:px-6">
                  {!batchUrls[batch.id] ? (
                    <div className="flex justify-center py-4">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    </div>
                  ) : batchUrls[batch.id].length === 0 ? (
                    <p className="text-sm text-gray-500">URLが見つかりません</p>
                  ) : (
                    <div className="space-y-2">
                      {batchUrls[batch.id].map((urlItem) => (
                        <div
                          key={urlItem.id}
                          className="flex items-center justify-between gap-3 rounded-lg bg-gray-900 px-4 py-3"
                        >
                          <a
                            href={urlItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-w-0 flex-1 truncate text-sm text-blue-400 hover:text-blue-300"
                          >
                            {urlItem.url}
                          </a>
                          {statusBadge(urlItem.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
