import { MetadataValidationStatus } from "../types/api";

export const dataMissingErrors = {
  dataMissingTooltipExplanation:
    "Please click “View Details” for more information.",
  dataMissing: "Data Missing",
  notVerifiable: "Data Not Verifiable",
  incorrectFormat: "Data Formatted Incorrectly",
};

// Governance Action metadata error messages
export const gaMetadataErrorMessages = {
  [MetadataValidationStatus.URL_NOT_FOUND]:
    "The data that was originally used when this Governance Action was created has not been found.",
  [MetadataValidationStatus.INVALID_JSONLD]:
    "The data that was originally used when this Governance Action was created has been formatted incorrectly.",
  [MetadataValidationStatus.INVALID_HASH]:
    "The data that was originally used when this Governance Action was created has changed.",
  [MetadataValidationStatus.INCORRECT_FORMAT]:
    "The data that was originally used when this Governance Action was created has been formatted incorrectly.",
};

// Governance Action metadata error descriptions
export const gaMetadataErrorDescriptions = {
  [MetadataValidationStatus.URL_NOT_FOUND]:
    "GovTool uses external sources for Governance Action data, and these sources are maintained by the proposers of the Actions. This error means that GovTool cannot locate the data on the URL specified when the Governance Action was originally posted.",
  [MetadataValidationStatus.INVALID_JSONLD]:
    "GovTool uses external sources for Governance Action data, and these sources are maintained by the proposers of the Actions. This error means that the data stored by the Proposer does not match the data format as defined by the Cardano community.",
  [MetadataValidationStatus.INVALID_HASH]:
    "GovTool uses external sources for Governance Action data, and these sources are maintained by the proposers of the Actions. This error means that the data stored by the Proposer does not match the data when the Governance Action was originally posted.",
  [MetadataValidationStatus.INCORRECT_FORMAT]:
    "GovTool uses external sources for Governance Action data, and these sources are maintained by the proposers of the Actions. This error means that the data stored by the Proposer does not match the data format as defined by the Cardano community.",
};
