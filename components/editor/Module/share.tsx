"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Forward, Share, Share2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { getLink } from "@/lib/api/shareApi";
import { useCodestore } from "@/lib/store/Codestore";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
}

export default function ShareModal({
  open,
  onOpenChange,
  roomId,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = useCodestore((s) => s.user?.id);

  const generateLink = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const { token } = await getLink({
        roomId,
        userId,
      });

      const url = `${process.env.NEXT_PUBLIC_API_URL}/share/${token}`;
      console.log(token);
      setShareUrl(url);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (!navigator.share || !shareUrl) return;

    try {
      await navigator.share({
        title: "Join my Codex workspace",
        text: "Join my collaborative coding workspace.",
        url: shareUrl,
      });
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button variant="none" size="icon" className="cursor-pointer ">
          <Forward className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#3a3d3e] border-[#3a3d3e]">
        <DialogHeader>
          <DialogTitle>Share workspace</DialogTitle>

          <DialogDescription>
            Anyone with this link can join your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <InputGroup className="flex-1">
              <InputGroupInput
                value={shareUrl}
                readOnly
                placeholder="Generate a share link..."
              />
            </InputGroup>

            <Button
              variant="secondary"
              size="icon"
              onClick={handleCopy}
              disabled={!shareUrl}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <button
            className="text-sm font-semibold cursor-pointer"
            onClick={generateLink}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Link"}
          </button>
        </div>
        {copied && (
          <p className="text-xs text-muted-foreground">
            Link copied to clipboard
          </p>
        )}

        {typeof navigator !== "undefined" && navigator.share && (
          <Button
            variant="outline"
            className="w-full bg-[#3a3d3e] border-black/50 text-gray-400"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
