import { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";
import { uploadImage } from "@/lib/uploadImage";
import { processCodeBlocks } from "@/lib/processCodeBlocks";

interface UseTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const BLOCK_TAGS = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "PRE"];

export function useTextEditor({ value, onChange }: UseTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInternalChangeRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const codeBlockTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [imageControls, setImageControls] = useState<{
    top: number;
    left: number;
    src: string;
  } | null>(null);
  const [activeBlockFormat, setActiveBlockFormat] = useState("P");
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState("");
  const [isSpellCheck, setIsSpellCheck] = useState(false);
  const [linkDialog, setLinkDialog] = useState({ isOpen: false, selectedText: "" });
  const savedRangeRef = useRef<Range | null>(null);

  useLayoutEffect(() => { onChangeRef.current = onChange; });

  useLayoutEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
    editorRef.current.innerHTML = value;
    processCodeBlocks(editorRef.current);
  }, [value]);

  const getCleanHtml = useCallback(() => {
    if (!editorRef.current) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editorRef.current.innerHTML;

    tempDiv.querySelectorAll(".code-lang-label, .code-line-numbers").forEach(
      (el) => el.remove(),
    );

    tempDiv.querySelectorAll("img").forEach((img) => {
      img.classList.remove("selected-editor-image");
      if (img.classList.length === 0) img.removeAttribute("class");
    });
    return tempDiv.innerHTML;
  }, []);

  const notifyChange = useCallback(() => {
    isInternalChangeRef.current = true;
    onChangeRef.current(getCleanHtml());
  }, [getCleanHtml]);

  const updateActiveBlockFormat = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      setActiveBlockFormat("P");
      return;
    }
    let node: Node | null = selection.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = (node as HTMLElement).tagName;
        if (BLOCK_TAGS.includes(tag)) {
          setActiveBlockFormat(tag);
          return;
        }
      }
      node = node.parentNode;
    }
    setActiveBlockFormat("P");
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveBlockFormat);
    return () => document.removeEventListener("selectionchange", updateActiveBlockFormat);
  }, [updateActiveBlockFormat]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (editorRef.current && !editorRef.current.contains(target)) {
        const controls = document.getElementById("editor-image-controls");
        if (controls && controls.contains(target)) return;
        editorRef.current.querySelectorAll("img").forEach((img) => {
          img.classList.remove("selected-editor-image");
        });
        setImageControls(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const execCommand = useCallback((command: string, cmdValue?: string) => {
    if (editorRef.current) editorRef.current.focus();
    document.execCommand(command, false, cmdValue);
    notifyChange();
    updateActiveBlockFormat();
  }, [notifyChange, updateActiveBlockFormat]);

  const handleInput = useCallback(() => {
    notifyChange();
    clearTimeout(codeBlockTimerRef.current);
    codeBlockTimerRef.current = setTimeout(() => {
      if (editorRef.current) processCodeBlocks(editorRef.current);
    }, 400);
  }, [notifyChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (editorRef.current) {
        editorRef.current.querySelectorAll("img").forEach((i) => {
          i.classList.remove("selected-editor-image");
        });
      }
      setImageControls(null);
      if (e.key === "Tab") {
        e.preventDefault();
        execCommand(e.shiftKey ? "outdent" : "indent");
      }
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            execCommand("bold");
            break;
          case "i":
            e.preventDefault();
            execCommand("italic");
            break;
          case "u":
            e.preventDefault();
            execCommand("underline");
            break;
        }
      }
    },
    [execCommand],
  );

  const insertLink = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "";
    savedRangeRef.current = selection?.rangeCount
      ? selection.getRangeAt(0).cloneRange()
      : null;
    setLinkDialog({ isOpen: true, selectedText });
  }, []);

  const handleLinkConfirm = useCallback((url: string, label: string) => {
    setLinkDialog({ isOpen: false, selectedText: "" });
    if (!url) return;

    if (editorRef.current) editorRef.current.focus();

    const selection = window.getSelection();
    if (selection && savedRangeRef.current) {
      selection.removeAllRanges();
      selection.addRange(savedRangeRef.current);
    }

    const displayText = label || url;
    document.execCommand(
      "insertHTML",
      false,
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${displayText}</a>`,
    );
    notifyChange();
  }, [notifyChange]);

  const handleLinkClose = useCallback(() => {
    setLinkDialog({ isOpen: false, selectedText: "" });
  }, []);

  const insertCodeBlock = useCallback(() => {
    if (editorRef.current) editorRef.current.focus();
    document.execCommand("formatBlock", false, "PRE");

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== editorRef.current) {
        if ((node as HTMLElement).tagName === "PRE") {
          if (!(node as HTMLElement).dataset.language) {
            (node as HTMLElement).dataset.language = "code";
          }
          break;
        }
        node = node.parentNode;
      }
    }

    if (editorRef.current) processCodeBlocks(editorRef.current);
    notifyChange();
    updateActiveBlockFormat();
  }, [notifyChange, updateActiveBlockFormat]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadImage(file, "articles");
      if (editorRef.current) editorRef.current.focus();
      execCommand("insertImage", url);
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const insertImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleToggleSource = useCallback(() => {
    if (!isSourceMode) {
      const html = getCleanHtml();
      setSourceHtml(html);
      setIsSourceMode(true);
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML = sourceHtml;
        processCodeBlocks(editorRef.current);
      }
      isInternalChangeRef.current = true;
      onChangeRef.current(sourceHtml);
      setIsSourceMode(false);
    }
  }, [isSourceMode, getCleanHtml, sourceHtml]);

  const handleSourceChange = useCallback((html: string) => {
    setSourceHtml(html);
    isInternalChangeRef.current = true;
    onChangeRef.current(html);
  }, []);

  const handleCommand = useCallback((command: string, cmdValue?: string) => {
    if (command === "insertLink") {
      insertLink();
    } else if (command === "insertImage") {
      insertImage();
    } else if (command === "toggleSource") {
      handleToggleSource();
    } else if (command === "toggleSpellCheck") {
      setIsSpellCheck((prev) => !prev);
    } else if (command === "formatBlock" && cmdValue === "PRE") {
      insertCodeBlock();
    } else {
      execCommand(command, cmdValue);
    }
  }, [execCommand, insertLink, insertImage, handleToggleSource, insertCodeBlock]);

  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("code-lang-label")) {
      e.preventDefault();
      const pre = target.closest<HTMLElement>("pre");
      if (pre && editorRef.current) {
        const current = pre.dataset.language ?? "code";
        const lang = window.prompt("Language (e.g. javascript, bash, python):", current);
        if (lang !== null) {
          pre.dataset.language = lang.trim() || "code";
          processCodeBlocks(editorRef.current);
          notifyChange();
        }
      }
      return;
    }

    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      editorRef.current?.querySelectorAll("img").forEach((i) => {
        i.classList.remove("selected-editor-image");
      });
      img.classList.add("selected-editor-image");
      const rect = img.getBoundingClientRect();
      const containerRect = editorRef.current?.getBoundingClientRect();
      if (containerRect) {
        setImageControls({
          top: rect.top - containerRect.top + (editorRef.current?.scrollTop || 0) - 45,
          left: rect.left - containerRect.left + (rect.width / 2) - 120,
          src: img.src,
        });
      }
    } else {
      editorRef.current?.querySelectorAll("img").forEach((i) => {
        i.classList.remove("selected-editor-image");
      });
      setImageControls(null);
    }
  }, [notifyChange]);

  const handleResize = useCallback((size: string) => {
    if (!editorRef.current || !imageControls) return;
    const imgs = editorRef.current.querySelectorAll("img");
    const img = Array.from(imgs).find((i) => i.src === imageControls.src);
    if (img) {
      img.style.width = size;
      img.style.height = "auto";
      notifyChange();
    }
  }, [imageControls, notifyChange]);

  const handleDeleteImage = useCallback(() => {
    if (!imageControls || !editorRef.current) return;
    const confirmed = window.confirm("Remove this image from the content?");
    if (!confirmed) return;
    const imageUrl = imageControls.src;
    const imgs = editorRef.current.querySelectorAll("img");
    const img = Array.from(imgs).find((i) => i.src === imageUrl);
    if (img) {
      img.remove();
      notifyChange();
    }
    setImageControls(null);
  }, [imageControls, notifyChange]);

  return {
    editorRef,
    fileInputRef,
    isUploading,
    imageControls,
    setImageControls,
    activeBlockFormat,
    isSourceMode,
    sourceHtml,
    isSpellCheck,
    linkDialog,
    handleInput,
    handleKeyDown,
    handleCommand,
    handleEditorClick,
    handleResize,
    handleDeleteImage,
    handleImageUpload,
    handleSourceChange,
    handleLinkConfirm,
    handleLinkClose,
  };
}
