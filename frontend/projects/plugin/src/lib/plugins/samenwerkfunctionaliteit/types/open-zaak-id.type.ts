export type OpenZaakId = string & {
  readonly __brand: unique symbol;
};

export function toOpenZaakId(value: string | undefined): OpenZaakId {
  if (!isValidOpenZaakId(value)) {
    throw new Error(`${value} is not a valid Open Zaak ID, or doesn't exist.`);
  }

  return value as OpenZaakId;
}

function isValidOpenZaakId(value: string): boolean {
  return typeof value === 'string';
}
