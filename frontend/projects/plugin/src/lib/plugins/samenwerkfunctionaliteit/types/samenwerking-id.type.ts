export type SamenwerkingId = string & {
  readonly __brand: unique symbol;
};
export function toSamenwerkingId(value: string): SamenwerkingId {
  // For now, just check whether the input value is a valid string
  if (typeof value !== 'string') {
    throw new Error(`${value} is not a valid Samenwerking ID.`);
  }

  return value as SamenwerkingId;
}
