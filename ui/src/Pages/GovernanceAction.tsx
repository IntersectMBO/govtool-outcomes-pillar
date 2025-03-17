import { Box, CircularProgress, Grid, Skeleton } from "@mui/material";
import { Breadcrumbs } from "../Components/Molecules/Breadcrumbs";
import { useGetGovernanceActionQuery } from "../hooks/useGetGovernanceActionQuery";
import Header from "../Components/SingleAction/Header";
import { useMetadata } from "../hooks/useMetadata";
import ReasoningElement from "../Components/SingleAction/ReasoningElement";
import References from "../Components/SingleAction/References";
import ActionIdentity from "../Components/SingleAction/ActionIdentity";
import { encodeCIP129Identifier } from "../lib/utils";
import GovernanceVotingUI from "../Components/SingleAction/GovernanceVoting";
import { DataMissingInfoBox } from "../Components/Molecules/DataMissingInfoBox";
import GovernanceActionElement from "../Components/SingleAction/GovernanceActionElement";

type GovernanceActionProps = {
  id: string;
};

function GovernanceAction({ id }: GovernanceActionProps) {
  const { governanceAction, isGovernanceActionLoading } =
    useGetGovernanceActionQuery(id);
  const { metadata, metadataValid, isMetadataLoading } =
    useMetadata(governanceAction);

  const content = {
    title: governanceAction?.title || metadata?.data?.title,
    abstract: governanceAction?.abstract || metadata?.data?.abstract,
    motivation: governanceAction?.motivation || metadata?.data?.motivation,
    rationale: governanceAction?.rationale || metadata?.data?.rationale,
    references: metadata?.data?.references || [],
  };

  const hasAnyContent =
    content.abstract || content.motivation || content.rationale;
  const isDataMissing = metadata?.metadataStatus || null;

  const idCIP129 = encodeCIP129Identifier({
    txID: governanceAction?.tx_hash,
    index: governanceAction?.index.toString(16).padStart(2, "0"),
    bech32Prefix: "gov_action",
  });

  if (isGovernanceActionLoading) {
    return (
      <Box
        data-testid={`single-action-${idCIP129}-page`}
        display="flex"
        flex={1}
        flexDirection="column"
        width="100%"
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            minHeight: "75vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  const contentContainerStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0px 4px 15px 0px #DDE3F5",
    borderRadius: "20px",
    padding: 2,
    backgroundColor: !metadataValid
      ? "rgba(251, 235, 235, 0.50)"
      : "rgba(255, 255, 255, 0.3)",
    ...(!metadataValid && {
      border: "1px solid #F6D5D5",
    }),
  };

  return (
    <Box
      data-testid={`single-action-${idCIP129}-page`}
      display="flex"
      flex={1}
      flexDirection="column"
      width="100%"
    >
      <Breadcrumbs
        elementOne="Outcomes"
        elementOnePath="/outcomes"
        elementTwo={content.title}
        isMetadataLoading={isMetadataLoading}
        isDataMissing={isDataMissing}
      />

      <Grid container spacing={3} marginTop={0.5}>
        <Grid item xs={12} lg={7} sx={{ marginBottom: { xs: 3, lg: 0 } }}>
          <Box
            data-testid={`single-action-${idCIP129}-description`}
            sx={contentContainerStyle}
          >
            {governanceAction && (
              <Box display="flex" flexDirection="column" gap={3}>
                <Header
                  title={content.title}
                  isGovernanceActionLoading={isGovernanceActionLoading}
                  isMetadataLoading={isMetadataLoading}
                  governanceAction={governanceAction}
                  isDataMissing={isDataMissing}
                />

                <DataMissingInfoBox isDataMissing={isDataMissing} />
                <ActionIdentity
                  governanceAction={governanceAction}
                  metadata={metadata}
                />

                {!hasAnyContent && (!governanceAction || isMetadataLoading) && (
                  <>
                    <Skeleton variant="rounded" width="20%" height={15} />
                    <Skeleton variant="rounded" width="100%" height={400} />
                  </>
                )}

                {metadataValid && (
                  <>
                    {content.abstract && (
                      <ReasoningElement
                        label="Abstract"
                        text={content.abstract as string}
                      />
                    )}

                    {content.motivation && (
                      <ReasoningElement
                        label="Motivation"
                        text={content.motivation as string}
                      />
                    )}

                    {content.rationale && (
                      <ReasoningElement
                        label="Rationale"
                        text={content.rationale as string}
                      />
                    )}
                  </>
                )}
                <GovernanceActionElement
                  title="Metadata anchor link"
                  type="link"
                  content={governanceAction?.url}
                  isCopyable
                />
                <GovernanceActionElement
                  title="Metadata anchor hash"
                  type="text"
                  content={governanceAction?.data_hash}
                  isCopyable
                />
                {metadataValid && content.references.length > 0 && (
                  <References links={content.references} />
                )}
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} lg={5} sx={{ position: "relative" }}>
          <Box
            data-testid={`single-action-${idCIP129}-outcome-numbers`}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0px 4px 15px 0px #DDE3F5",
              borderRadius: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              padding: 2,
              position: "sticky",
              top: "96px",
              zIndex: 100,
            }}
          >
            <GovernanceVotingUI action={governanceAction} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GovernanceAction;
