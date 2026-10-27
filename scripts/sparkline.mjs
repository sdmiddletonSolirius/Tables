export function sparklineData(params) {
  const { label, series, width = 160, height = 40 } = params;
  if (typeof label !== "string" || !label.trim()) {
    throw new TypeError("Sparkline requires a non-empty label");
  }
  if (!Array.isArray(series) || series.length < 2 || series.some(point =>
    !point || typeof point.label !== "string" || !point.label.trim() || !Number.isFinite(point.value))) {
    throw new TypeError("Sparkline requires at least two labelled finite numeric values");
  }
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 16 || height < 16) {
    throw new RangeError("Sparkline width and height must be finite numbers of at least 16 pixels");
  }
  const values = series.map(point => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  if (!Number.isFinite(range)) {
    throw new RangeError("Sparkline value range is too large");
  }
  const points = series.map((point, index) => {
    const x = 4 + index / (series.length - 1) * (width - 8);
    const y = range === 0 ? height / 2 : 4 + (max - point.value) / range * (height - 8);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  return {
    width,
    height,
    points,
    description: `${label}: ${series.map(point => `${point.label}: ${point.value}`).join(", ")}`,
  };
}
