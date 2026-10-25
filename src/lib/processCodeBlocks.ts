/**
 * Injects visual-only `.code-lang-label` and `.code-line-numbers` elements
 * into every <pre> inside a container. These are appended AFTER the code
 * content so the cursor naturally stays away from them during editing.
 *
 * Call `getCleanHtml` (in the editor hook) to strip them before saving.
 */
export function processCodeBlocks(container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>("pre").forEach((pre) => {
    pre.querySelector(".code-lang-label")?.remove();
    pre.querySelector(".code-line-numbers")?.remove();

    const lang = pre.dataset.language ?? "code";

    const label = document.createElement("div");
    label.className = "code-lang-label";
    label.contentEditable = "false";
    label.setAttribute("aria-hidden", "true");
    label.textContent = lang;
    pre.appendChild(label);

    const codeEl = pre.querySelector("code") ?? pre;
    const rawText = codeEl.innerText ?? "";
    const lines = rawText.split("\n");
    const lineCount = lines.at(-1) === "" ? lines.length - 1 : lines.length;
    if (lineCount < 1) return;

    const nums = document.createElement("div");
    nums.className = "code-line-numbers";
    nums.contentEditable = "false";
    nums.setAttribute("aria-hidden", "true");

    for (let i = 1; i <= lineCount; i++) {
      const span = document.createElement("span");
      span.textContent = String(i);
      nums.appendChild(span);
    }
    pre.appendChild(nums);
  });
}
