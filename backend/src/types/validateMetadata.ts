import { MetadataValidationStatus } from "src/enums/ValidationErrors";

export enum MetadataStandard {
  CIP108 = "CIP108",
  CIP119 = "CIP119",
}

export type ValidateMetadataResult = {
  metadataStatus?: MetadataValidationStatus;
  metadataValid: boolean;
  data?: any;
};
