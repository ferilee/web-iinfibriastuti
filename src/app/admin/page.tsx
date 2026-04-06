"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image as ImageIcon, Mail } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, photos: 0, messages: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resArticles, resPhotos, resMessages] = await Promise.all([
          fetch('/api/articles?limit=1000').then((res) => res.json()),
          fetch('/api/gallery').then((res) => res.json()),
          fetch('/api/contact').then((res) => res.json()),
        ]);

        setStats({
          articles: Array.isArray(resArticles) ? resArticles.length : 0,
          photos: Array.isArray(resPhotos) ? resPhotos.length : 0,
          messages: Array.isArray(resMessages) ? resMessages.length : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back to your control panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articles}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gallery Photos</CardTitle>
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.photos}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inbox Messages</CardTitle>
            <Mail className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
