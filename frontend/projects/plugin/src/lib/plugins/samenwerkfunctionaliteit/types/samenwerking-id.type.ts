export type SamenwerkingId = string & {
  readonly __brand: unique symbol;
};

export function toSamenwerkingId(value: string): SamenwerkingId {
  if (!isValidSamenwerkingId(value)) {
    throw new Error(`${value} is not a valid Samenwerking ID.`);
  }

  return value as SamenwerkingId;
}

function isValidSamenwerkingId(value: string): boolean {
  return typeof value === 'string';
}
