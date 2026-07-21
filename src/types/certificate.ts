export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  image: string;
  credentialUrl?: string;
}