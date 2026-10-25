import { useState } from "react";
import { useOne, useParsed, useUpdate } from "@refinedev/core";
import { useNavigate } from "react-router";
import {
  Button,
  Card,
  Chip,
  Input,
  Label,
  Skeleton,
  TextField,
  Typography,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useCopyToClipboard } from "@hooks/useCopyToClipboard";
import { downloadFile, extensionOf } from "@lib/downloadFile";
import { InstagramPreview } from "./components/InstagramPreview";
import { StatusChip } from "./columns";
import {
  CAPTION_MAX,
  FORMAT_META,
  HASHTAG_MAX,
  NEXT_STEP,
  PLATFORM_META,
} from "./constants";
import type { ISocialPost, SocialPostStatus } from "./interfaces";
import { countHashtags, formatSchedule } from "./utils";

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "post";
}

function InfoRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon icon={icon} className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <Typography type="body-sm" color="muted" className="w-28 shrink-0">
        {label}
      </Typography>
      <div className="min-w-0 flex-1 text-sm">{children}</div>
    </div>
  );
}

export const SocialPostDetail = () => {
  const { id } = useParsed();
  const navigate = useNavigate();
  const copy = useCopyToClipboard();
  const [postUrl, setPostUrl] = useState("");
  const [downloading, setDownloading] = useState(false);

  const { result: post, query } = useOne<ISocialPost>({ resource: "social-posts", id });
  const { mutate: update, mutation } = useUpdate<ISocialPost>();

  if (query.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Skeleton className="h-150 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-150 rounded-2xl lg:col-span-3" />
      </div>
    );
  }

  if (!post) {
    return (
      <Card>
        <Card.Content className="py-16 text-center">
          <Typography type="body" color="muted">
            Postingan tidak ditemukan.
          </Typography>
        </Card.Content>
      </Card>
    );
  }

  const next = NEXT_STEP[post.status];
  const hashtags = countHashtags(post.caption);
  const platform = PLATFORM_META[post.platform] ?? PLATFORM_META.instagram;
  const format = FORMAT_META[post.format] ?? FORMAT_META.feed;

  const setStatus = (status: SocialPostStatus, extra: Partial<ISocialPost> = {}) =>
    update({
      resource: "social-posts",
      id: post.id,
      values: { status, ...extra },
      successNotification: () => ({ type: "success", message: "Status diperbarui" }),
    });

  const downloadAll = async () => {
    setDownloading(true);
    const base = slug(post.title);
    for (const [i, m] of post.media.entries()) {
      await downloadFile(m.url, `${base}-${i + 1}.${extensionOf(m.url)}`);
    }
    setDownloading(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <Card>
        <Card.Content className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Typography type="h4">{post.title}</Typography>
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip status={post.status} />
              <Chip size="sm" variant="tertiary">
                <Icon icon={platform.icon} className="h-3.5 w-3.5" />
                <Chip.Label>{platform.label}</Chip.Label>
              </Chip>
              <Chip size="sm" variant="tertiary">
                <Icon icon={format.icon} className="h-3.5 w-3.5" />
                <Chip.Label>
                  {format.label}
                  {post.media.length > 1 ? ` · ${post.media.length} slide` : ""}
                </Chip.Label>
              </Chip>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onPress={() => navigate(`/social-posts/edit/${post.id}`)}>
              <Icon icon="mdi:pencil-outline" className="h-4 w-4" />
              Edit
            </Button>
            {next && next.to !== "posted" && (
              <Button isPending={mutation.isPending} onPress={() => setStatus(next.to)}>
                <Icon icon={next.icon} className="h-4 w-4" />
                {next.label}
              </Button>
            )}
          </div>
        </Card.Content>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-4">
            <InstagramPreview
              media={post.media}
              caption={post.caption}
              format={post.format}
              date={post.postedAt ?? post.scheduledAt}
            />
          </div>
        </div>

        {/* Posting kit */}
        <div className="flex flex-col gap-5 lg:col-span-3">
          <Card>
            <Card.Header className="flex flex-row items-center justify-between gap-2">
              <div>
                <Card.Title>Caption</Card.Title>
                <Card.Description>
                  {post.caption.length}/{CAPTION_MAX} karakter ·{" "}
                  <span className={hashtags > HASHTAG_MAX ? "font-semibold text-danger" : undefined}>
                    {hashtags}/{HASHTAG_MAX} hashtag
                  </span>
                </Card.Description>
              </div>
              <Button size="sm" isDisabled={!post.caption} onPress={() => copy(post.caption, "Caption disalin")}>
                <Icon icon="mdi:content-copy" className="h-4 w-4" />
                Salin
              </Button>
            </Card.Header>
            <Card.Content>
              <div className="max-h-72 overflow-y-auto rounded-lg border border-divider bg-default-50 p-3 text-sm whitespace-pre-wrap">
                {post.caption || <span className="text-muted-foreground italic">Belum ada caption.</span>}
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header className="flex flex-row items-center justify-between gap-2">
              <div>
                <Card.Title>Desain</Card.Title>
                <Card.Description>Download lalu upload manual ke {platform.label}.</Card.Description>
              </div>
              <Button
                size="sm"
                variant="secondary"
                isDisabled={post.media.length === 0}
                isPending={downloading}
                onPress={downloadAll}
              >
                <Icon icon="mdi:download" className="h-4 w-4" />
                Download semua
              </Button>
            </Card.Header>
            <Card.Content className="flex flex-col gap-3">
              {post.media.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {post.media.map((m, i) => (
                    <button
                      key={`${m.url}-${i}`}
                      type="button"
                      title="Download gambar ini"
                      onClick={() =>
                        downloadFile(m.url, `${slug(post.title)}-${i + 1}.${extensionOf(m.url)}`)
                      }
                      className="group relative aspect-4/5 overflow-hidden rounded-lg border border-divider"
                    >
                      <img src={m.url} alt={m.alt || `Slide ${i + 1}`} className="h-full w-full object-cover" />
                      <span className="absolute top-1 left-1 rounded bg-black/60 px-1.5 text-xs font-semibold text-white">
                        {i + 1}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Icon icon="mdi:download" className="h-6 w-6 text-white" />
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <Typography type="body-sm" color="muted">
                  Belum ada gambar.
                </Typography>
              )}
              {post.canvaUrl && (
                <a
                  href={post.canvaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-accent hover:underline"
                >
                  <Icon icon="simple-icons:canva" className="h-4 w-4" />
                  Buka desain di Canva
                  <Icon icon="mdi:open-in-new" className="h-3.5 w-3.5" />
                </a>
              )}
            </Card.Content>
          </Card>

          {post.status === "ready" && (
            <Card className="border border-success/40">
              <Card.Header>
                <Card.Title>Sudah diposting?</Card.Title>
                <Card.Description>
                  Setelah posting di {platform.label}, tempel link postingannya (opsional) lalu tandai selesai.
                </Card.Description>
              </Card.Header>
              <Card.Content className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <TextField value={postUrl} onChange={setPostUrl} className="flex-1">
                  <Label>Link postingan</Label>
                  <Input placeholder="https://www.instagram.com/p/…" fullWidth />
                </TextField>
                <Button
                  isPending={mutation.isPending}
                  onPress={() =>
                    setStatus("posted", {
                      postUrl: postUrl.trim() || null,
                      postedAt: new Date().toISOString(),
                    })
                  }
                >
                  <Icon icon="mdi:send-check-outline" className="h-4 w-4" />
                  Tandai Sudah Diposting
                </Button>
              </Card.Content>
            </Card>
          )}

          <Card>
            <Card.Header>
              <Card.Title>Detail</Card.Title>
            </Card.Header>
            <Card.Content className="divide-y divide-divider">
              <InfoRow icon="mdi:calendar-clock-outline" label="Rencana tayang">
                {formatSchedule(post.scheduledAt)}
              </InfoRow>
              {post.status === "posted" && (
                <InfoRow icon="mdi:send-check-outline" label="Diposting">
                  {formatSchedule(post.postedAt)}
                </InfoRow>
              )}
              {post.postUrl && (
                <InfoRow icon="mdi:link-variant" label="Link">
                  <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="break-all text-accent hover:underline">
                    {post.postUrl}
                  </a>
                </InfoRow>
              )}
              <InfoRow icon="mdi:note-text-outline" label="Catatan">
                <span className="whitespace-pre-wrap">{post.notes || "-"}</span>
              </InfoRow>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};
