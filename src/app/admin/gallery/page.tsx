"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminToast } from "@/lib/admin-toast";
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';

type Photo = { id: number; title: string; imageUrl: string; createdAt: string };

export default function GalleryManagement() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Partial<Photo>>({});

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setPhotos(data);
    } catch {
      adminToast.error("Failed to load photos");
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPhoto),
      });

      if (res.ok) {
        adminToast.success("Photo added to gallery");
        setIsOpen(false);
        fetchPhotos();
      } else {
        const data = await res.json();
        adminToast.error(data.error || "Failed to add photo");
      }
    } catch {
      adminToast.error("An error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        adminToast.success("Photo deleted");
        fetchPhotos();
      } else {
        adminToast.error("Failed to delete photo");
      }
    } catch {
      adminToast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
        <Button onClick={() => { setCurrentPhoto({ title: '', imageUrl: '' }); setIsOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Photo
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Photo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                required
                placeholder="e.g. Kegiatan Upacara"
                value={currentPhoto.title || ''}
                onChange={(e) => setCurrentPhoto({ ...currentPhoto, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Image URL</Label>
              <Input
                required
                placeholder="https://example.com/image.jpg"
                value={currentPhoto.imageUrl || ''}
                onChange={(e) => setCurrentPhoto({ ...currentPhoto, imageUrl: e.target.value })}
              />
            </div>
            {currentPhoto.imageUrl && (
              <div className="mt-4 rounded border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentPhoto.imageUrl} alt="Preview" className="w-full h-auto object-cover max-h-[300px]" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Invalid+Image+URL' }} />
              </div>
            )}
            <Button type="submit" className="w-full">Save Photo</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group">
            <div className="relative aspect-[4/3] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="icon" onClick={() => handleDelete(photo.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{photo.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{new Date(photo.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {photos.length === 0 && (
        <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
          <p>Your gallery is empty.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setCurrentPhoto({ title: '', imageUrl: '' }); setIsOpen(true); }}>Upload your first photo</Button>
        </Card>
      )}
    </div>
  );
}
