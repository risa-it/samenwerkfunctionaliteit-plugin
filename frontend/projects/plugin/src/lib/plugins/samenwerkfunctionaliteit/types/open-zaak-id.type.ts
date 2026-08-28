export type OpenZaakId = string & {
  readonly __brand: unique symbol;
};

export function toOpenZaakId(value: string): OpenZaakId {
  if (!isValidOpenZaakId(value)) {
    throw new Error(`${value} is not a valid Open Zaak ID.`);
  }

  return value as OpenZaakId;
}

function isValidOpenZaakId(value: string): boolean {
  return typeof value === 'string';
}
