import { Box, Icon, Tooltip } from "@mui/material";
import { IconInformationCircle } from "@intersect.mbo/intersectmbo.org-icons-set";
import { MetadataValidationStatus } from "../../types/api";
import { getMetadataDataMissingStatusTranslation } from "../../lib/getMetadataDataMissingStatusTranslation";
import { Typography } from "../Atoms/Typography";
import { useTranslation } from "../../contexts/I18nContext";

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
  const { t } = useTranslation();

  const showLoader =
    isMetadataLoading ||
    (!(
      isDataMissing && getMetadataDataMissingStatusTranslation(t, isDataMissing)
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
          {t("loaders.loadingTitle")}
        </Typography>
      ) : (
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            lineHeight: "24px",
            lineClamp: 2,
            wordBreak: "break-word",
            transition: "opacity 0.5s ease-in-out",
            opacity: 1,
            color: isDataMissing ? "errorRed" : "inherit",
          }}
        >
          {(isDataMissing &&
            getMetadataDataMissingStatusTranslation(
              t,
              isDataMissing as MetadataValidationStatus
            )) ||
            title}
        </Typography>
      )}
      {isDataMissing && typeof isDataMissing === "string" && (
        <Tooltip
          title={
            <Box sx={{ bgcolor: "rgb(36, 34, 50)", p: 1, borderRadius: 1 }}>
              <Typography variant="body1" fontWeight={400} color={"white"}>
                {getMetadataDataMissingStatusTranslation(
                  t,
                  isDataMissing as MetadataValidationStatus
                )}
              </Typography>
              <Typography variant="body2" fontWeight={400} color={"gray"}>
                {t("dataMissingErrors.dataMissingTooltipExplanation")}
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
