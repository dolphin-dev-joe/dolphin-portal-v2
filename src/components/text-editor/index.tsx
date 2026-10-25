import { memo } from "react";
import { FONT_FAMILIES, FONT_SIZES, BLOCK_FORMATS } from "./constants";
import { Separator } from "./components/Separator";
import { ToolbarButton } from "./components/ToolbarButton";
import { ToolbarSelect } from "./components/ToolbarSelect";
import { ImageControls } from "./components/ImageControls";
import { InsertLinkModal } from "./components/InsertLinkModal";
import { useTextEditor } from "./hooks/useTextEditor";
import { EditorArea } from "./components/EditorArea";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function TextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
}: TextEditorProps) {
  const {
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
  } = useTextEditor({ value, onChange });

  return (
    <div
      className={`relative border-2 border-divider bg-surface focus-within:border-accent transition-colors rounded-lg ${className || ""}`}
    >
      <style>{`
        .selected-editor-image {
          outline: 3px solid var(--accent) !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 6px oklch(61.90% 0.1683 252.66 / 0.3) !important;
          transition: outline 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
        }
      `}</style>

      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-1.5 px-3 py-2 overflow-x-auto border-b border-divider bg-surface-secondary md:flex-wrap md:whitespace-normal">
        <ToolbarSelect
          options={BLOCK_FORMATS}
          command="formatBlock"
          onCommand={handleCommand}
          value={activeBlockFormat}
          title="Paragraph Format"
          width="w-28"
          isDisabled={isSourceMode}
        />

        <Separator />

        <ToolbarSelect
          options={FONT_FAMILIES}
          command="fontName"
          onCommand={handleCommand}
          title="Font Family"
          width="w-32"
          isDisabled={isSourceMode}
        />

        <Separator />

        <ToolbarSelect
          options={FONT_SIZES}
          command="fontSize"
          onCommand={handleCommand}
          defaultValue="3"
          title="Font Size"
          width="w-20"
          isDisabled={isSourceMode}
        />

        <Separator />

        <div className="flex items-center shrink-0">
          <ToolbarButton
            icon="mdi:format-bold"
            label="Bold (Ctrl+B)"
            command="bold"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-italic"
            label="Italic (Ctrl+I)"
            command="italic"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-underline"
            label="Underline (Ctrl+U)"
            command="underline"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-strikethrough"
            label="Strikethrough"
            command="strikeThrough"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
        </div>

        <Separator />

        <div className="flex items-center shrink-0">
          <ToolbarButton
            icon="mdi:format-list-bulleted"
            label="Bullet List"
            command="insertUnorderedList"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-list-numbered"
            label="Numbered List"
            command="insertOrderedList"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-indent-decrease"
            label="Decrease Indent"
            command="outdent"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-indent-increase"
            label="Increase Indent"
            command="indent"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
        </div>

        <Separator />

        <div className="flex items-center shrink-0">
          <ToolbarButton
            icon="mdi:format-align-left"
            label="Align Left"
            command="justifyLeft"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-align-center"
            label="Align Center"
            command="justifyCenter"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-align-right"
            label="Align Right"
            command="justifyRight"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-align-justify"
            label="Justify"
            command="justifyFull"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
        </div>

        <Separator />

        <div className="flex items-center shrink-0">
          <ToolbarButton
            icon="mdi:link-variant"
            label="Insert Link"
            command="insertLink"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon={isUploading ? "mdi:loading" : "mdi:image"}
            label={isUploading ? "Uploading..." : "Insert Image"}
            command="insertImage"
            onCommand={handleCommand}
            isDisabled={isSourceMode || isUploading}
          />
        </div>

        <Separator />

        <div className="flex items-center shrink-0">
          <ToolbarButton
            icon="mdi:code-tags"
            label="Code Block"
            command="formatBlock"
            cmdValue="PRE"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
          <ToolbarButton
            icon="mdi:format-clear"
            label="Clear Formatting"
            command="removeFormat"
            onCommand={handleCommand}
            isDisabled={isSourceMode}
          />
        </div>

        <Separator />

        <div className="flex items-center shrink-0">
          <ToolbarButton
            icon={isSourceMode ? "mdi:eye-outline" : "mdi:xml"}
            label={isSourceMode ? "Visual Mode" : "HTML Source"}
            command="toggleSource"
            onCommand={handleCommand}
            isActive={isSourceMode}
          />
        </div>

        <Separator />

        <div className="flex items-center shrink-0">
          <ToolbarButton
            icon="mdi:spellcheck"
            label={isSpellCheck ? "Spell Check: On" : "Spell Check: Off"}
            command="toggleSpellCheck"
            onCommand={handleCommand}
            isActive={isSpellCheck}
            isDisabled={isSourceMode}
          />
        </div>
      </div>

      {/* Source mode: raw HTML textarea */}
      <textarea
        value={sourceHtml}
        onChange={(e) => handleSourceChange(e.target.value)}
        className="min-h-[300px] w-full p-4 font-mono text-sm text-foreground bg-surface-tertiary outline-none resize-y leading-relaxed"
        style={{ minHeight: "300px" }}
        spellCheck={false}
        placeholder="<!-- HTML source code -->"
        hidden={!isSourceMode}
        aria-hidden={!isSourceMode}
        tabIndex={isSourceMode ? 0 : -1}
      />

      {/* Visual editor */}
      <div hidden={isSourceMode} aria-hidden={isSourceMode}>
        <EditorArea
          ref={editorRef}
          placeholder={placeholder}
          spellCheck={isSpellCheck}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onClick={handleEditorClick}
        />
      </div>

      {/* Floating Image Controls Overlay */}
      {imageControls && !isSourceMode && (
        <ImageControls
          top={imageControls.top}
          left={imageControls.left}
          onResize={handleResize}
          onDelete={handleDeleteImage}
          onClose={() => setImageControls(null)}
        />
      )}

      <InsertLinkModal
        isOpen={linkDialog.isOpen}
        initialLabel={linkDialog.selectedText}
        onConfirm={handleLinkConfirm}
        onClose={handleLinkClose}
      />

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}

export default memo(TextEditor);
