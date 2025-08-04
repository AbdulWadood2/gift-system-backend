export enum AppName {
  LEKLOK = 'leklok',
}

export enum VerificationType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  MEDIA = 'media',
  PUBLIC_FIGURE = 'public_figure',
  NON_PROFIT = 'non_profit',
  EDUCATIONAL = 'educational',
  GOVERNMENT = 'government',
  INFLUENCER = 'influencer',
  SELLER = 'seller',
  ARTIST = 'artist',
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review',
  REVOKED = 'revoked',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}
