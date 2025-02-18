import { NavLink, To } from "react-router-dom";
import { Box, Divider, Skeleton, Typography } from "@mui/material";
import { useScreenDimension } from "../../hooks/useDimensions";

type BreadcrumbsLegacyProps = {
  elementOne: string;
  elementOnePath: To;
  elementTwo: string;
  isMetadataLoading?: boolean | null;
};

export const BreadcrumbsLegacy = ({
  elementOne,
  elementOnePath,
  elementTwo,
  isMetadataLoading,
}: BreadcrumbsLegacyProps) => {
  const { isMobile } = useScreenDimension();
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
      {isMetadataLoading ? (
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
          {(!elementTwo && "Data not processable!") || elementTwo}
        </Typography>
      )}
    </Box>
  );
};
