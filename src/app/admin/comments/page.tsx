"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminToast } from "@/lib/admin-toast";

type CommentRow = {
  id: number;
  content: string;
  status: string;
  createdAt: string | number | null;
  articleId: number | null;
  articleTitle: string | null;
  userName: string | null;
  userEmail: string | null;
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/comments?status=pending");
      if (!res.ok) {
        adminToast.error("Gagal memuat komentar");
        return;
      }
      const data = await res.json();
      setComments(data);
    } catch {
      adminToast.error("Gagal memuat komentar");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        adminToast.error(data.error || "Gagal memperbarui komentar");
        return;
      }
      adminToast.success(
        status === "approved" ? "Komentar disetujui" : "Komentar ditolak",
      );
      setComments((prev) => prev.filter((item) => item.id !== id));
    } catch {
      adminToast.error("Gagal memperbarui komentar");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderasi Komentar</h1>
        <p className="text-muted-foreground mt-2">Setujui atau tolak komentar dari pengunjung.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Komentar Menunggu Persetujuan</CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {isLoading ? "Memuat komentar..." : "Tidak ada komentar yang menunggu."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artikel</TableHead>
                  <TableHead>Pengunjung</TableHead>
                  <TableHead>Komentar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="max-w-[220px] whitespace-normal">
                      <p className="font-medium">{comment.articleTitle || "Artikel"}</p>
                      <p className="text-xs text-muted-foreground">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-[180px] whitespace-normal">
                      <p className="font-medium">{comment.userName || "Pengunjung"}</p>
                      <p className="text-xs text-muted-foreground">{comment.userEmail || ""}</p>
                    </TableCell>
                    <TableCell className="max-w-[360px] whitespace-normal">
                      {comment.content}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => updateStatus(comment.id, "approved")}>
                          Setujui
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(comment.id, "rejected")}>
                          Tolak
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
