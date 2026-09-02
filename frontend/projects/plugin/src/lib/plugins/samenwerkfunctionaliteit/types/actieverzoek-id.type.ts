import { isUUID, toUUID, UUID } from './uuid.type';

export type ActieverzoekId = UUID & {
  readonly __actieverzoekIdBrand: unique symbol;
};

export function toActieverzoekId(value: string): ActieverzoekId {
  return toUUID(value) as ActieverzoekId;
}

export function isActieverzoekId(value: string): value is ActieverzoekId {
  return isUUID(value);
}
