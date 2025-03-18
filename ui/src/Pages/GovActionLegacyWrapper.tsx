import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetGovernanceActionQuery } from "../hooks/useGetGovernanceActionQuery";
import { useMetadata } from "../hooks/useMetadata";
import GovernanceActionLegacy from "../Components/Legacy/GovernanceActionLegacy";
import { BreadcrumbsLegacy } from "../Components/Molecules/BreadcrumbsLegacy";
import { IconCheveronLeft } from "@intersect.mbo/intersectmbo.org-icons-set";
import { NavLink } from "react-router-dom";

type GovernanceActionWrapperProps = {
  id: string;
};
const GovActionLegacyWrapper = ({ id }: GovernanceActionWrapperProps) => {
  const { governanceAction, isGovernanceActionLoading } =
    useGetGovernanceActionQuery(id);
  const { metadata, isMetadataLoading } = useMetadata(governanceAction, {
    skipConditionCheck: true,
  });

  const renderGovernanceAction = () => {
    if (isGovernanceActionLoading || isMetadataLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minHeight: "75vh",
          }}
        >
          <CircularProgress size={28} />
        </Box>
      );
    }

    return (
      <GovernanceActionLegacy
        {...governanceAction}
        {...metadata}
        title={governanceAction?.title || metadata?.data?.title}
        abstract={
          governanceAction?.abstract || (metadata?.data?.abstract as string)
        }
        rationale={
          governanceAction?.rationale || (metadata?.data?.rationale as string)
        }
        motivation={
          governanceAction?.motivation || (metadata?.data?.motivation as string)
        }
      />
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        height: "100%",
      }}
    >
      <Box>
        <BreadcrumbsLegacy
          elementOne="Outcomes"
          elementOnePath="/outcomes"
          elementTwo={governanceAction?.title || metadata?.data?.title}
          isMetadataLoading={isMetadataLoading}
          isDataMissing={metadata?.metadataStatus || null}
        />
        <NavLink
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            gap: "3px",
            margin: "0px",
            padding: "0px",
            color: "#0033AD",
            textDecoration: "none",
            fontWeight: 400,
          }}
          to={"/outcomes"}
        >
          <IconCheveronLeft
            style={{
              fontSize: "20px",
              marginLeft: 0,
              paddingLeft: 0,
            }}
            fill="#0033AD"
          />
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "20px",
              color: "inherit",
            }}
          >
            Back
          </Typography>
        </NavLink>
      </Box>
      {renderGovernanceAction()}
    </Box>
  );
};

export default GovActionLegacyWrapper;
