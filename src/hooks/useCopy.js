import { useEffect, useRef, useState } from "react";

// Copie un texte ; si l'API presse-papier est indisponible, on sélectionne
// le nœud fourni pour que Ctrl+C suffise.
export function useCopy(textReference) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      const node = textReference.current;
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = globalThis.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return [copied, copy];
}
