import { Box, Icon } from "@mui/material";
import { IconInformationCircle } from "@intersect.mbo/intersectmbo.org-icons-set";
import { MetadataValidationStatus } from "../../types/api";
import { getMetadataDataMissingStatusTranslation } from "../../lib/getMetadataDataMissingStatusTranslation";
import { dataMissingErrors } from "../../consts/dataMissingErrors";
import { Tooltip } from "../Atoms/Tooltip";
import { Typography } from "../Atoms/Typography";

type GovernanceActionCardHeaderProps = {
  title?: string;
  isDataMissing: MetadataValidationStatus | null;
  dataTestId: string;
  isMetadataLoading: boolean;
};

export const GovernanceActionCardHeader = ({
  title,
  isDataMissing,
  dataTestId,
  isMetadataLoading,
}: GovernanceActionCardHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: "20px",
        overflow: "hidden",
        gap: 1,
      }}
      data-testid={dataTestId}
    >
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 600,
          lineHeight: "24px",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          wordBreak: "break-word",
          transition: "filter 0.5s ease-in-out, opacity 0.5s ease-in-out",
          filter: isMetadataLoading ? "blur(5px)" : "none",
          opacity: isMetadataLoading ? 0.6 : 1,
          color: isMetadataLoading
            ? "gray"
            : isDataMissing
            ? "errorRed"
            : "inherit",
        }}
      >
        {isDataMissing
          ? getMetadataDataMissingStatusTranslation(
              isDataMissing as MetadataValidationStatus
            )
          : title || "Loading title..."}
      </Typography>
      {isDataMissing && typeof isDataMissing === "string" && (
        <Tooltip
          heading={getMetadataDataMissingStatusTranslation(
            isDataMissing as MetadataValidationStatus
          )}
          paragraphOne={dataMissingErrors.dataMissingTooltipExplanation}
          placement="bottom-end"
          arrow
        >
          <Icon>
            <IconInformationCircle width={19} height={19} />
          </Icon>
        </Tooltip>
      )}
    </Box>
  );
};
