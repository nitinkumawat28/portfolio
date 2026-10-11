export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function smoothstep(min: number, max: number, value: number): number {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
}

/**
 * Wraps an offset o into [-N/2, N/2] for continuous looping
 */
export function wrapOffset(offset: number, total: number): number {
  if (total <= 0) return offset;
  let wrapped = ((offset % total) + total) % total;
  if (wrapped > total / 2) {
    wrapped -= total;
  }
  return wrapped;
}
