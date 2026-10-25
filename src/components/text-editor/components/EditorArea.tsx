import React, { forwardRef, memo } from "react";

interface EditorAreaProps {
  placeholder?: string;
  spellCheck?: boolean;
  onInput: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}

const EditorAreaComponent = forwardRef<HTMLDivElement, EditorAreaProps>(
  ({ placeholder, spellCheck = false, onInput, onKeyDown, onClick }, ref) => {
    return (
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck={spellCheck}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onClick={onClick}
        data-placeholder={placeholder}
        className="rich-content min-h-[300px] p-4 outline-none focus:outline-none text-foreground cursor-text
          empty:before:content-[attr(data-placeholder)] empty:before:text-foreground/30 empty:before:pointer-events-none"
        style={{
          minHeight: "300px",
          wordBreak: "break-word",
        }}
      />
    );
  },
);

EditorAreaComponent.displayName = "EditorArea";

export const EditorArea = memo(EditorAreaComponent);
