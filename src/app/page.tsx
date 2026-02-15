import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "アカウント登録",
    description: "メールアドレスとパスワードで簡単に無料登録",
  },
  {
    number: "2",
    title: "URLを入力",
    description: "削除したい無断転載ページのURLを貼り付け",
  },
  {
    number: "3",
    title: "自動で削除申請",
    description: "DMCA テイクダウン通知を各プラットフォームに送信",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold text-blue-500">DMCA Shield</span>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:text-white"
            >
              ログイン
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-32">
        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          あなたのコンテンツを
          <br />
          <span className="text-blue-500">守る</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          無断転載されたコンテンツを見つけたら、DMCA Shield が
          テイクダウン申請を自動で作成・送信。あなたの権利を守ります。
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/auth/signup"
            className="w-full rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            無料で始める
          </Link>
          <Link
            href="/auth/login"
            className="w-full rounded-xl border border-gray-700 px-8 py-4 text-lg font-medium text-gray-300 transition hover:bg-gray-900 sm:w-auto"
          >
            ログイン
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:pb-32">
        <h2 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
          かんたん 3 ステップ
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        &copy; 2025 DMCA Shield. All rights reserved.
      </footer>
    </div>
  );
}
