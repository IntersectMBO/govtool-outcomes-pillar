import { NavLink, To } from "react-router-dom";
import { Box, Divider, Skeleton, Typography } from "@mui/material";
import { useScreenDimension } from "../../hooks/useDimensions";
import { MetadataValidationStatus } from "../../types/api";
import { getMetadataDataMissingStatusTranslation } from "../../lib/getMetadataDataMissingStatusTranslation";

type BreadcrumbsLegacyProps = {
  elementOne: string;
  elementOnePath: To;
  elementTwo: string;
  isMetadataLoading?: boolean | null;
  isDataMissing: MetadataValidationStatus | null;
};

export const BreadcrumbsLegacy = ({
  elementOne,
  elementOnePath,
  elementTwo,
  isMetadataLoading,
  isDataMissing,
}: BreadcrumbsLegacyProps) => {
  const { isMobile } = useScreenDimension();
  const showLoader =
    isMetadataLoading ||
    (!(
      isDataMissing && getMetadataDataMissingStatusTranslation(isDataMissing)
    ) &&
      !elementTwo);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        margin: `2px 0 ${isMobile ? "44px" : "24px"}`,
      }}
    >
      <NavLink to={elementOnePath} style={{ textDecorationColor: "#0033AD" }}>
        <Typography
          color="primary"
          variant="caption"
          sx={{
            whiteSpace: "nowrap",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {elementOne}
        </Typography>
      </NavLink>
      <Divider
        orientation="vertical"
        flexItem
        color="textBlack"
        sx={{ margin: "0 6px" }}
      />
      {showLoader ? (
        <Skeleton variant="rounded" width={200} height={14} />
      ) : (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: 12,
          }}
        >
          {(isDataMissing &&
            getMetadataDataMissingStatusTranslation(
              isDataMissing as MetadataValidationStatus
            )) ||
            elementTwo}
        </Typography>
      )}
    </Box>
  );
};
