import { Box, Icon, Tooltip } from "@mui/material";
import { IconInformationCircle } from "@intersect.mbo/intersectmbo.org-icons-set";
import { MetadataValidationStatus } from "../../types/api";
import { getMetadataDataMissingStatusTranslation } from "../../lib/getMetadataDataMissingStatusTranslation";
import { dataMissingErrors } from "../../consts/dataMissingErrors";
// import { Tooltip } from "../Atoms/Tooltip";
import { Typography } from "../Atoms/Typography";

type GovernanceActionCardHeaderProps = {
  title?: string;
  isDataMissing: MetadataValidationStatus | null;
  isMetadataLoading: boolean;
  dataTestId: string;
};

export const GovernanceActionCardHeader = ({
  title,
  isDataMissing,
  isMetadataLoading,
  dataTestId,
}: GovernanceActionCardHeaderProps) => {
  const showLoader =
    isMetadataLoading ||
    (!(
      isDataMissing && getMetadataDataMissingStatusTranslation(isDataMissing)
    ) &&
      !title);

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
      {showLoader ? (
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            lineHeight: "24px",
            filter: "blur(2px) brightness(0.8) grayscale(0.2)",
            transition: "filter 0.5s ease-in-out",
            wordBreak: "break-word",
            opacity: 0.7,
            color: "gray",
          }}
        >
          Loading governance action title...
        </Typography>
      ) : (
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            lineHeight: "24px",
            WebkitLineClamp: 2,
            wordBreak: "break-word",
            transition: "opacity 0.5s ease-in-out",
            opacity: 1,
            color: isDataMissing ? "errorRed" : "inherit",
          }}
        >
          {(isDataMissing &&
            getMetadataDataMissingStatusTranslation(
              isDataMissing as MetadataValidationStatus
            )) ||
            title}
        </Typography>
      )}
      {isDataMissing && typeof isDataMissing === "string" && (
        // <Tooltip
        //   heading={getMetadataDataMissingStatusTranslation(
        //     isDataMissing as MetadataValidationStatus
        //   )}
        //   paragraphOne={dataMissingErrors.dataMissingTooltipExplanation}
        //   placement="bottom-end"
        //   arrow
        // >
        //   <Icon>
        //     <IconInformationCircle width={19} height={19} />
        //   </Icon>
        // </Tooltip>
        <Tooltip
          title={
            <Box sx={{ bgcolor: "rgb(36, 34, 50)", p: 1, borderRadius: 2 }}>
              <Typography variant="body1" color={"white"}>
                {getMetadataDataMissingStatusTranslation(
                  isDataMissing as MetadataValidationStatus
                )}
              </Typography>
              <Typography variant="body2" color={"gray"}>
                {dataMissingErrors.dataMissingTooltipExplanation}
              </Typography>
            </Box>
          }
          arrow
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "transparent",
                p: 0,
                m: 0,
              },
            },
            arrow: {
              sx: {
                color: "rgb(36, 34, 50)",
              },
            },
          }}
        >
          <Icon>
            <IconInformationCircle width={19} height={19} />
          </Icon>
        </Tooltip>
      )}
    </Box>
  );
};
