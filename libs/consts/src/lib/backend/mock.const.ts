export const MOCK_EMAIL_OPTIONS = { provider: 'local.local' };

export enum BalanceAvailable {
  Min = 1,
  Max = 50,
}

export enum MockTrainingBackgroundPicture {
  Directory = 'apps/frontend/public/img/content',
  Count = 4,
  Prefix = 'training-',
  Suffix = '.png',
}

export enum MockCertificate {
  Directory = 'apps/frontend/public/img/content/certificates-and-diplomas',
  Count = 6,
  Prefix = 'certificate-',
  Suffix = '.pdf',
}
