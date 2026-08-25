export type OpenZaakId = string & {
  readonly __brand: unique symbol;
};

export function toOpenZaakId(value: string): OpenZaakId {
  // For now, just check whether the input value is a valid string
  if (typeof value !== 'string') {
    throw new Error(`${value} is not a valid Open Zaak ID.`);
  }

  return value as OpenZaakId;
}
