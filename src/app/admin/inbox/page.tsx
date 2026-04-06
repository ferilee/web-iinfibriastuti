"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminToast } from "@/lib/admin-toast";
import { Trash2, MailOpen, Mail } from "lucide-react";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function InboxManagement() {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(data);
    } catch {
      adminToast.error("Failed to load messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        adminToast.success("Message deleted");
        fetchMessages();
      } else {
        adminToast.error("Failed to delete message");
      }
    } catch {
      adminToast.error("An error occurred");
    }
  };

  const toggleReadStatus = async (msg: Message) => {
    try {
      const res = await fetch(`/api/contact/${msg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !msg.isRead }),
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch {
      adminToast.error("An error occurred updating status");
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`border-white/10 bg-slate-900/70 text-white ${!msg.isRead ? "ring-1 ring-blue-400/40" : ""}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  {msg.name}
                  {!msg.isRead && (
                    <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">
                      New
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-white/60">
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-blue-300 hover:underline"
                  >
                    {msg.email}
                  </a>
                  <span>&bull;</span>
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => toggleReadStatus(msg)}
                  title={msg.isRead ? "Mark as unread" : "Mark as read"}
                >
                  {msg.isRead ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <MailOpen className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                  onClick={() => handleDelete(msg.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap mt-2 text-white/80">
                {msg.message}
              </p>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12 text-white/70 border border-white/10 rounded-lg bg-slate-900/70">
            <Mail className="mx-auto h-12 w-12 opacity-30 mb-4" />
            <p>Your inbox is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
