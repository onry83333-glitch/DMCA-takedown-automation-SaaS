"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { RequestBatch } from "@/lib/types";

type Stats = {
  total: number;
  submitted: number;
  removed: number;
  pending: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, submitted: 0, removed: 0, pending: 0 });
  const [recentBatches, setRecentBatches] = useState<RequestBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch URL stats by status
      const { data: urls } = await supabase
        .from("request_urls")
        .select("status");

      if (urls) {
        setStats({
          total: urls.length,
          submitted: urls.filter((u) => u.status === "submitted").length,
          removed: urls.filter((u) => u.status === "removed").length,
          pending: urls.filter((u) => u.status === "pending").length,
        });
      }

      // Fetch recent batches
      const { data: batches } = await supabase
        .from("request_batches")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (batches) setRecentBatches(batches);
      setLoading(false);
    };

    fetchData();
  }, []);

  const statCards = [
    { label: "総申請URL数", value: stats.total, color: "text-white" },
    { label: "送信済み", value: stats.submitted, color: "text-blue-400" },
    { label: "削除成功", value: stats.removed, color: "text-green-400" },
    { label: "保留中", value: stats.pending, color: "text-yellow-400" },
  ];

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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-800 bg-gray-900 p-6"
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/dashboard/new"
        className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-5 text-xl font-bold text-white transition hover:bg-blue-700 sm:w-auto sm:px-12"
      >
        + 新規申請を作成
      </Link>

      {/* Recent Batches */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">最近の申請</h2>
        {recentBatches.length === 0 ? (
          <p className="text-gray-500">まだ申請がありません</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-800 bg-gray-900">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-400">日時</th>
                  <th className="px-4 py-3 font-medium text-gray-400">プラットフォーム</th>
                  <th className="px-4 py-3 font-medium text-gray-400">URL数</th>
                  <th className="px-4 py-3 font-medium text-gray-400">ステータス</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentBatches.map((batch) => (
                  <tr key={batch.id} className="bg-gray-950 hover:bg-gray-900 transition">
                    <td className="px-4 py-3 text-gray-300">
                      {new Date(batch.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{batch.target_platform}</td>
                    <td className="px-4 py-3 text-gray-300">{batch.url_count}</td>
                    <td className="px-4 py-3">{statusBadge(batch.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
