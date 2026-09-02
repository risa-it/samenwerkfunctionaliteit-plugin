export const ActieverzoekStatusTypes = {
  Open: 'OPEN',
  InProgress: 'IN_PROGRESS',
  Rejected: 'REJECTED',
  Withdrawn: 'WITHDRAWN',
  ReportedReady: 'REPORTED_READY',
  Ready: 'READY',
} as const;

export type ActieverzoekStatusType =
  (typeof ActieverzoekStatusTypes)[keyof typeof ActieverzoekStatusTypes];

export const ActieverzoekStatusValueToKey = Object.fromEntries(
  Object.entries(ActieverzoekStatusTypes).map(([key, value]) => [value, key]),
) as {
  [V in ActieverzoekStatusType]: keyof typeof ActieverzoekStatusTypes;
};

export const ActieverzoekStatusList = Object.values(
  ActieverzoekStatusTypes,
) as ActieverzoekStatusType[];

export function getActieverzoekTypeText(
  actieverzoekStatusType: ActieverzoekStatusType,
): string {
  switch (actieverzoekStatusType) {
    case ActieverzoekStatusTypes.Open:
      return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.open';
    case ActieverzoekStatusTypes.InProgress:
      return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.inProgress';
    case ActieverzoekStatusTypes.Rejected:
      return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.rejected';
    case ActieverzoekStatusTypes.Withdrawn:
      return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.withdrawn';
    case ActieverzoekStatusTypes.ReportedReady:
      return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.reportedReady';
    case ActieverzoekStatusTypes.Ready:
      return 'samenwerkfunctionaliteit.actieverzoekStatusTypes.ready';
    default:
      throw Error('Unknown actieverzoek status type');
  }
}
