import React, { useEffect, useRef } from "react";
import { useOne, useParsed } from "@refinedev/core";
import { Card, Chip, Skeleton, Typography, cn } from "@heroui/react";
import { processCodeBlocks } from "@lib/processCodeBlocks";
import { ARTICLE_STATUS_META } from "./constant";
import { IArticle } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";

export const ArticleDetail = () => {
  const { id } = useParsed();
  const { result: record, query } = useOne<IArticle>({
    resource: "articles",
    id,
  });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) processCodeBlocks(contentRef.current);
  }, [record?.content]);

  const statusMeta =
    (record?.status && ARTICLE_STATUS_META[record.status]) ??
    ARTICLE_STATUS_META.draft;

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card>
          <Card.Content className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Typography type="body" color="muted">
              Article tidak ditemukan.
            </Typography>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="w-full">
        <Card.Header className="flex flex-col items-start gap-3">
          <div className="flex flex-col gap-1">
            <Typography type="h4">{record.title || "Article Details"}</Typography>
            <Typography type="body-sm" color="muted">
              {record.slug ? `/${record.slug}` : "View article information"}
            </Typography>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip color={statusMeta.color} variant="soft">
              <Chip.Label>{statusMeta.label}</Chip.Label>
            </Chip>
            <Chip variant="tertiary">
              <Chip.Label>{record.viewsCount ?? 0} views</Chip.Label>
            </Chip>
            <Chip variant="tertiary">
              <Chip.Label>Order {record.sortOrder ?? 0}</Chip.Label>
            </Chip>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <Typography type="body-sm" color="muted">
                Excerpt
              </Typography>
              <p className="text-md whitespace-pre-wrap">{record.excerpt || "-"}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Typography type="body-sm" color="muted">
                Content
              </Typography>
              {record.content ? (
                <div className={cn("rounded-lg border border-divider bg-surface p-5")}>
                  <Typography.Prose>
                    <div
                      ref={contentRef}
                      dangerouslySetInnerHTML={{ __html: record.content }}
                    />
                  </Typography.Prose>
                </div>
              ) : (
                <Typography type="body-sm" color="muted">
                  -
                </Typography>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Typography type="body-sm" color="muted">
                  Created At
                </Typography>
                <Typography type="body">
                  {formatDateTimeShort(record.createdAt || "-")}
                </Typography>
              </div>
              <div className="flex flex-col gap-2">
                <Typography type="body-sm" color="muted">
                  Updated At
                </Typography>
                <Typography type="body">
                  {formatDateTimeShort(
                    record.updatedAt ? String(record.updatedAt) : "-",
                  )}
                </Typography>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {record.coverImage && (
        <Card>
          <Card.Header>
            <Typography type="h5">Cover Image</Typography>
          </Card.Header>
          <Card.Content>
            <img
              src={record.coverImage}
              alt={record.title || "Article cover"}
              className="max-h-96 w-full rounded-lg border border-divider object-cover"
            />
          </Card.Content>
        </Card>
      )}
    </div>
  );
};
