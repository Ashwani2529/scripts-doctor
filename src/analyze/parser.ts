export type Segment = { text: string };
export function splitSegments(cmd: string): Segment[] {
  const parts: Segment[] = [];
  let buf = "";
  let i = 0;
  while (i < cmd.length) {
    if (cmd[i] === "&" && cmd[i + 1] === "&") {
      if (buf.trim()) parts.push({ text: buf.trim() });
      buf = "";
      i += 2;
      continue;
    }
    if (cmd[i] === "|" && cmd[i + 1] === "|") {
      if (buf.trim()) parts.push({ text: buf.trim() });
      buf = "";
      i += 2;
      continue;
    }
    buf += cmd[i++];
  }
  if (buf.trim()) parts.push({ text: buf.trim() });
  return parts;
}
export function firstToken(segment: string): string {
  const m = segment.trim().match(/^([^\s"']+)/);
  return m ? m[1] : "";
}
