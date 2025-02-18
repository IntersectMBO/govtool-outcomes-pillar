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
  const { metadata, metadataValid, isMetadataLoading } = useMetadata(
    governanceAction,
    {
      skipConditionCheck: true,
    }
  );

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
        title={governanceAction?.title || metadata?.body?.title}
        abstract={governanceAction?.abstract || metadata?.body?.abstract}
        rationale={governanceAction?.rationale || metadata?.body?.rationale}
        motivation={governanceAction?.motivation || metadata?.body?.motivation}
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
      <BreadcrumbsLegacy
        elementOne="Governance Actions"
        elementOnePath="/outcomes"
        elementTwo={governanceAction?.title || metadata?.body?.title}
        isMetadataLoading={isMetadataLoading}
      />
      <NavLink
        style={{
          display: "flex",
          alignItems: "center",
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
      {renderGovernanceAction()}
    </Box>
  );
};

export default GovActionLegacyWrapper;
