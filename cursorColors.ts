export function connectionIdToColor(id: number): string {
  // deterministic hue selection for unlimited participants
  const hue = (id * 47) % 360; // 47 chosen to distribute colors
  return `hsl(${hue}, 70%, 50%)`;
}
