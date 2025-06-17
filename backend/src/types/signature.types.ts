export interface AuthorWitness {
  witnessAlgorithm: string;
  publicKey: string;
  signature: string;
}

export interface Author {
  name: string;
  witness: AuthorWitness;
}

export interface SignatureVerificationDto {
  author: Author;
  metadataUrl: string;
}

export interface SignatureVerificationResult {
  isValid: boolean;
  author: string;
  message?: string;
  error?: string;
}
