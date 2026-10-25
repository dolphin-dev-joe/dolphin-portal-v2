import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "@components/inputs/TextInput";
import { TextAreaInput } from "@components/inputs/TextareaInput";
import { SelectInput } from "@components/inputs/SelectInput";
import { NumberInput } from "@components/inputs/NumberInput";
import { useNextSortOrder } from "@/hooks/useNextSortOrder";
import { useFormContext } from "react-hook-form";
import { useFormMode } from "@/contexts/FormModeContext";
import { RichTextEditorInput } from "../components/RichTextEditorInput";
import { CoverImageInput } from "../components/CoverImageInput";
import { ARTICLE_STATUS_OPTIONS } from "../constant";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ArticleForm() {
  const { isShow } = useFormMode();
  const nextSortOrder = useNextSortOrder("articles/next-sort-order");
  const { setValue, watch } = useFormContext();
  const [showSlug, setShowSlug] = useState(false);

  const title = watch("title") ?? "";
  const lastAutoSlug = useRef<string | null>(null);

  useEffect(() => {
    if (!isShow && nextSortOrder !== null) {
      setValue("sortOrder", nextSortOrder);
    }
  }, [isShow, nextSortOrder, setValue]);

  useEffect(() => {
    if (isShow) return;
    const currentSlug = (watch("slug") as string) ?? "";
    if (currentSlug === "" || currentSlug === lastAutoSlug.current) {
      const next = slugify(title);
      lastAutoSlug.current = next;
      setValue("slug", next);
    }
  }, [title, watch, setValue, isShow]);

  return (
    <>
      <TextInput
        fieldName="title"
        fieldLabel="Title"
        placeholder="Enter article title"
        isRequired
      />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Slug auto-generated from title.
          </span>
          {!isShow && (
            <button
              type="button"
              onClick={() => setShowSlug((v) => !v)}
              className="text-xs text-accent hover:underline"
            >
              {showSlug ? "Hide slug" : "Edit slug"}
            </button>
          )}
        </div>
        {showSlug && (
          <TextInput
            fieldName="slug"
            fieldLabel="Slug"
            placeholder="article-title-slug"
            isRequired
          />
        )}
      </div>

      <TextAreaInput
        fieldName="excerpt"
        fieldLabel="Excerpt"
        placeholder="A short summary shown in listings and previews."
        rows={3}
        isRequired
      />

      <RichTextEditorInput
        fieldName="content"
        fieldLabel="Content"
        placeholder="Start writing your article..."
        isRequired
      />

      <CoverImageInput fieldName="coverImage" fieldLabel="Cover Image" />

      <SelectInput
        fieldName="status"
        fieldLabel="Status"
        options={ARTICLE_STATUS_OPTIONS}
        placeholder="Select status"
      />

      <NumberInput fieldName="sortOrder" fieldLabel="Sort Order" />
    </>
  );
}
