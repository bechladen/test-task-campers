export function formatPrice(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0,00'
  return n.toFixed(2).replace('.', ',')
}

