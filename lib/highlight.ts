// Splits `text` into segments, marking every occurrence of `needle`
// so it can be rendered in the highlight color.
export type Segment = { text: string; highlight: boolean };

export function segment(text: string, needle: string): Segment[] {
  if (!needle) return [{ text, highlight: false }];
  const out: Segment[] = [];
  let i = 0;
  while (i < text.length) {
    const idx = text.indexOf(needle, i);
    if (idx === -1) {
      out.push({ text: text.slice(i), highlight: false });
      break;
    }
    if (idx > i) out.push({ text: text.slice(i, idx), highlight: false });
    out.push({ text: needle, highlight: true });
    i = idx + needle.length;
  }
  return out.filter((s) => s.text.length > 0);
}

// Builds the full display segments: front + "도 " + back, overlap highlighted.
export function buildSegments(
  front: string,
  back: string,
  overlap: string
): Segment[] {
  return [
    ...segment(front, overlap),
    { text: '도 ', highlight: false },
    ...segment(back, overlap),
  ];
}
