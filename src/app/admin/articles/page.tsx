"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { adminToast } from "@/lib/admin-toast";
import { Pencil, Trash2, Plus } from 'lucide-react';

type Article = { id: number; title: string; slug: string; content: string; publishedAt: string | null };

export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    } catch {
      adminToast.error("Failed to load articles");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/articles/${currentArticle.id}` : '/api/articles';
      const body = {
        ...currentArticle,
        publishedAt: currentArticle.publishedAt || new Date().toISOString(),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        adminToast.success(isEditing ? "Article updated" : "Article created");
        setIsOpen(false);
        fetchArticles();
      } else {
        const data = await res.json();
        adminToast.error(data.error || "Failed to save article");
      }
    } catch {
      adminToast.error("An error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        adminToast.success("Article deleted");
        fetchArticles();
      } else {
        adminToast.error("Failed to delete article");
      }
    } catch {
      adminToast.error("An error occurred");
    }
  };

  const openModal = (article?: Article) => {
    if (article) {
      setCurrentArticle(article);
      setIsEditing(true);
    } else {
      setCurrentArticle({ title: '', slug: '', content: '' });
      setIsEditing(false);
    }
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Articles Management</h1>
        <Button onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4" /> New Article
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Article' : 'Create Article'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                required
                value={currentArticle.title || ''}
                onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                required
                value={currentArticle.slug || ''}
                onChange={(e) => setCurrentArticle({ ...currentArticle, slug: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Content (Markdown support)</Label>
              <Textarea
                required
                className="min-h-[200px]"
                value={currentArticle.content || ''}
                onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">Save Article</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.slug}</TableCell>
                  <TableCell>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openModal(article)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {articles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No articles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
