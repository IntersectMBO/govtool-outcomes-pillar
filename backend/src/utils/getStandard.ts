import { MetadataValidationStatus } from "src/enums/ValidationErrors";
import { MetadataStandard } from "src/types/validateMetadata";
/**
 * Retrieves the metadata standard from the given data.
 * @param data - The data containing the metadata.
 * @returns The metadata standard if found, otherwise undefined.
 */
export const getStandard = (
  data: Record<string, unknown>
): MetadataStandard | undefined => {
  if (JSON.stringify(data).includes(MetadataStandard.CIP119)) {
    return MetadataStandard.CIP119;
  }
  if (JSON.stringify(data).includes(MetadataStandard.CIP108)) {
    return MetadataStandard.CIP108;
  }
  throw MetadataValidationStatus.INCORRECT_FORMAT;
};
