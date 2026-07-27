"use client";

import { GetsharedRoom } from "@/lib/api/shareApi";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CalendarDays,
  InfoIcon,
  TriangleAlert,
  Unlink,
  Cable,
} from "lucide-react";
import { sendNotify } from "@/lib/api/notifyApi";
import { useCodestore } from "@/lib/store/Codestore";
import Profile from "../editor/ui/profile";
import { useRouter } from "next/navigation";

interface RoomData {
  name: string;
  createdAt: string;
}

export default function JoinRoom({ id }: { id: string }) {
  const [data, setData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDisable, setIsDisable] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [Invalid, setInvalid] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();
  const user = useCodestore((s) => s.user);
  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    if (!user) return;
    try {
      const res = await GetsharedRoom({ token: id });

      if (res.access) {
        setHasAccess(true);
        setIsRedirect(true);
        router.push(`/playground/${res.roomId}`);
        return;
      }

      setData(res);
    } catch (err) {
      const { roomId } = err?.data;

      if (err.status == 400) {
        setIsDisable(true);
        setInvalid(true);
        setError("this is invliad link cannot procced anymore !!");
      }

      if (err.status == 403) {
        setIsDisable(true);
        setIsRedirect(true);
        router.push(`/playground/${roomId}`);
        setInfo("admin cannot send joining request");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    // TODO: Send join request
    setError("");
    setInfo("");
    if (!user || !data) return;
    setIsSubmitting(true);
    try {
      const res = await sendNotify({
        receiverId: data?.adminId,
        type: "request",
        roomId: data?.roomId,
        message: `${user?.name} wants to join ${data?.name}`,
      });
      if (res.status == 201) {
        setIsDisable(true);
        setInfo("you request sent");
      }
      setIsSubmitting(false);
    } catch (err) {
      if (err.status == 409) {
        setIsDisable(true);
        setError("your is request alredy been sent !!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e]">
        <Cable className="h-8 w-8 animate-pulse text-white" />
        <p className="text-md text-gray-500">{Info}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (Invalid) {
    return (
      <div className="flex min-h-screen gap-3 items-center justify-center bg-[#1e1e1e]">
        <Unlink className="h-8 w-8 animate-pulse text-white" />
        <p className="text-md text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-[#252526]/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-white">Codex</h1>
            <p className="text-xs text-zinc-500">
              Real-time Collaborative Workspace
            </p>
          </div>

          <Profile />
        </div>
      </header>

      {/* Content */}
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <Card className="w-full max-w-md border-zinc-800 bg-[#252526] shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl text-white">
              Join Workspace
            </CardTitle>

            <CardDescription className="text-zinc-400">
              You've been invited to collaborate.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg border border-zinc-800 bg-[#2d2d30] p-4">
              <h2 className="text-lg font-semibold text-white">{data?.name}</h2>

              <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                <CalendarDays className="h-4 w-4" />

                <span>
                  {data?.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : "--"}
                </span>

                <span>•</span>

                <span>{data?.type}</span>
              </div>
            </div>

            <Button
              disabled={isDisable || isSubmitting}
              className="h-11 w-full"
              onClick={handleRequest}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : isRedirect ? (
                "Redirecting..."
              ) : (
                "Send Request"
              )}
            </Button>

            {Info && (
              <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                <TriangleAlert className="h-4 w-4 flex-shrink-0" />
                <span>{Info}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                <TriangleAlert className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
