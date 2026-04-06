"use client";

import { useEffect, useState, useTransition } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";

type ReactionCounts = {
  like?: number;
  love?: number;
  clap?: number;
};

type CommentItem = {
  id: number;
  content: string;
  createdAt: string | number | null;
  userName: string | null;
  userImage: string | null;
  userEmail: string | null;
};

export default function ArticleEngagement({
  articleId,
}: {
  articleId: number;
}) {
  const { data: session, status } = useSession();
  const [counts, setCounts] = useState<ReactionCounts>({});
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isPending, startTransition] = useTransition();
  const successToastDurationMs = 4000;

  const fetchReactions = async () => {
    const res = await fetch(`/api/reactions?articleId=${articleId}`);
    if (!res.ok) return;
    const data = await res.json();
    setCounts(data.counts || {});
    setMyReaction(data.myReaction || null);
  };

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?articleId=${articleId}`);
    if (!res.ok) return;
    const data = await res.json();
    setComments(data || []);
  };

  useEffect(() => {
    fetchReactions();
    fetchComments();
  }, [articleId]);

  const handleReaction = (type: "like" | "love" | "clap") => {
    if (!session) {
      signIn("google");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, type }),
      });

      if (!res.ok) {
        toast.error("Gagal memperbarui reaksi");
        return;
      }

      await fetchReactions();
    });
  };

  const handleSubmitComment = () => {
    if (!session) {
      signIn("google");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Komentar tidak boleh kosong");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, content: commentText }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Gagal mengirim komentar");
        return;
      }

      setCommentText("");
      toast.custom(
        () => (
          <div
            className="w-[320px] rounded-2xl border border-white/10 bg-slate-900/95 px-5 py-4 text-white shadow-xl"
            style={
              {
                "--toast-duration": `${successToastDurationMs}ms`,
              } as CSSProperties
            }
          >
            <p className="text-sm font-semibold">
              Komentar dikirim. Menunggu persetujuan admin.
            </p>
            <p className="text-sm text-white/70 mt-1">
              Terima kasih atas partisipasi Anda.
            </p>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="toast-progress h-full w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400" />
            </div>
          </div>
        ),
        { duration: successToastDurationMs },
      );
      await fetchComments();
    });
  };

  return (
    <section className="mt-10 space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-6 shadow-lg shadow-black/30">
        <div className="flex flex-wrap gap-3">
          {[
            { type: "like" as const, label: "👍 Like" },
            { type: "love" as const, label: "❤️ Love" },
            { type: "clap" as const, label: "👏 Clap" },
          ].map((item) => (
            <Button
              key={item.type}
              variant={myReaction === item.type ? "default" : "outline"}
              className={
                myReaction === item.type
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
              }
              onClick={() => handleReaction(item.type)}
              disabled={isPending}
            >
              {item.label} {counts[item.type] ? `(${counts[item.type]})` : ""}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-6 shadow-lg shadow-black/30 space-y-4 text-white">
        <div>
          <h3 className="text-lg font-semibold">Komentar</h3>
          <p className="text-sm text-white/60">
            {session
              ? "Komentar Anda akan tampil setelah disetujui admin."
              : "Login untuk menulis komentar."}
          </p>
        </div>

        <div className="space-y-3">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tulis komentar Anda..."
            className="min-h-[120px]"
            disabled={status === "loading" || isPending}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSubmitComment}
              disabled={isPending}
              className="bg-blue-500 text-white hover:bg-blue-400"
            >
              {session ? "Kirim Komentar" : "Login dengan Google"}
            </Button>
            {!session ? (
              <Button
                variant="outline"
                onClick={() => signIn("google")}
                disabled={isPending}
                className="border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
              >
                Login
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {comments.length === 0 ? (
            <p className="text-sm text-white/60">Belum ada komentar.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800/80 overflow-hidden flex items-center justify-center text-xs font-medium text-white/80">
                  {comment.userImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={comment.userImage}
                      alt={comment.userName || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (comment.userName || comment.userEmail || "U")
                      .slice(0, 1)
                      .toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                      {comment.userName || "Pengunjung"}
                    </p>
                    <span className="text-xs text-white/50">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mt-1 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
