export const ConfidentialityTypes = {
  Confidential: 'CONFIDENTIAL',
  StrictlyConfidential: 'STRICTLY_CONFIDENTIAL',
} as const;

export type ConfidentialityType =
  (typeof ConfidentialityTypes)[keyof typeof ConfidentialityTypes];

export function confidentialityTypeToTranslationKey(
  confidentialityType: ConfidentialityType,
): string {
  switch (confidentialityType) {
    case ConfidentialityTypes.Confidential:
      return 'samenwerkfunctionaliteit.types.confidentiality.confidential';
    case ConfidentialityTypes.StrictlyConfidential:
      return 'samenwerkfunctionaliteit.types.confidentiality.strictlyConfidential';
    default:
      throw new Error(`Unknown notificatie type: ${confidentialityType}`);
  }
}
