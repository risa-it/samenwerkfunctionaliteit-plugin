export class NoActieverzoekIdError extends Error {
  constructor(
  ) {
    super(
      `No actieverzoekId found in document`,
    );

    this.name = 'NoActieverzoekIdError';
  }
}
