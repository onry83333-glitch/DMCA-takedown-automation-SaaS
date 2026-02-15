"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const platforms = [
  "Stripchat",
  "Google",
  "XVideos",
  "Pornhub",
  "その他",
];

export default function NewRequestPage() {
  const router = useRouter();
  const [urls, setUrls] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) {
      setError("URLを1つ以上入力してください");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("認証エラー。再度ログインしてください。");
      setLoading(false);
      return;
    }

    // Create batch
    const { data: batch, error: batchError } = await supabase
      .from("request_batches")
      .insert({
        user_id: user.id,
        target_platform: platform,
        url_count: urlList.length,
        status: "pending",
      })
      .select()
      .single();

    if (batchError || !batch) {
      setError("申請の作成に失敗しました: " + (batchError?.message ?? ""));
      setLoading(false);
      return;
    }

    // Insert URLs
    const urlRecords = urlList.map((url) => ({
      batch_id: batch.id,
      url,
      status: "pending" as const,
    }));

    const { error: urlError } = await supabase
      .from("request_urls")
      .insert(urlRecords);

    if (urlError) {
      setError("URLの登録に失敗しました: " + urlError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/requests");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-white">新規申請</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-900/50 border border-red-700 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Step 1 */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              1
            </span>
            <h2 className="text-lg font-semibold text-white">プラットフォームを選択</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {platforms.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`rounded-lg border px-5 py-3 text-sm font-medium transition ${
                  platform === p
                    ? "border-blue-500 bg-blue-600/20 text-blue-400"
                    : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              2
            </span>
            <h2 className="text-lg font-semibold text-white">URLを入力</h2>
          </div>
          <p className="mb-3 text-sm text-gray-400">
            削除したいURLを1行に1つずつ貼り付けてください
          </p>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={"https://example.com/page1\nhttps://example.com/page2\nhttps://example.com/page3"}
          />
          <p className="mt-2 text-sm text-gray-500">
            {urls.split("\n").filter((u) => u.trim().length > 0).length} 件のURL
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "送信中..." : "申請を作成"}
        </button>
      </form>
    </div>
  );
}
