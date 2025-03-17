import { NavLink, To } from "react-router-dom";
import { Box, Divider, Skeleton } from "@mui/material";
import { Typography } from "../Atoms/Typography";
import { MetadataValidationStatus } from "../../types/api";
import { getMetadataDataMissingStatusTranslation } from "../../lib/getMetadataDataMissingStatusTranslation";

type BreadcrumbsProps = {
  elementOne: string;
  elementOnePath: To;
  elementTwo: string;
  isMetadataLoading?: boolean | null;
  isDataMissing: MetadataValidationStatus | null;
};

export const Breadcrumbs = ({
  elementOne,
  elementOnePath,
  elementTwo,
  isMetadataLoading,
  isDataMissing,
}: BreadcrumbsProps) => {
  const showLoader =
    isMetadataLoading ||
    (!(
      isDataMissing && getMetadataDataMissingStatusTranslation(isDataMissing)
    ) &&
      !elementTwo);

  return (
    <Box
      data-testid="breadcrumb-component"
      sx={{
        display: "flex",
        alignItems: "center",
        margin: "2px 0 20px",
      }}
    >
      <img
        src="/icons/ArrowLeftThin.svg"
        alt="arrow"
        style={{ marginRight: "6px" }}
      />
      <NavLink to={elementOnePath} style={{ textDecorationColor: "#0033AD" }}>
        <Typography
          color="primaryBlue"
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
        sx={{ margin: "0 12px" }}
      />
      {showLoader ? (
        <Skeleton variant="rounded" width={200} height={15} />
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
