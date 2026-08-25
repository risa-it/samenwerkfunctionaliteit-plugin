export class NoLinkedUploadProcessError extends Error {
  constructor(
    public readonly caseDefinitionKey: string,
    public readonly caseDefinitionVersionTag: string,
  ) {
    super(
      `No linked Documenten API process found for caseDefinitionKey: ${caseDefinitionKey}, caseDefinitionVersionTag: ${caseDefinitionVersionTag}`,
    );

    this.name = 'NoLinkedUploadProcessError';
  }
}
