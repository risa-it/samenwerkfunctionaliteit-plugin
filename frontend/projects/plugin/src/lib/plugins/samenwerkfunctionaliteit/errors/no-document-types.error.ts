export class NoDocumentTypesFoundError extends Error {
  constructor(
    public readonly caseDefinitionKey: string,
    public readonly caseDefinitionVersionTag: string,
  ) {
    super(
      `No document types found for caseDefinitionKey: ${caseDefinitionKey}, caseDefinitionVersionTag: ${caseDefinitionVersionTag}`,
    );

    this.name = 'NoDocumentTypesFoundError';
  }
}
