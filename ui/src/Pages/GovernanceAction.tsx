import { Box, CircularProgress, Grid, Skeleton } from "@mui/material";
import { Breadcrumbs } from "../Components/Molecules/Breadcrumbs";
import { useGetGovernanceActionQuery } from "../hooks/useGetGovernanceActionQuery";
import Header from "../Components/SingleAction/Header";
import { useMetadata } from "../hooks/useMetadata";
import ReasoningElement from "../Components/SingleAction/ReasoningElement";
import References from "../Components/SingleAction/References";
import ActionIdentity from "../Components/SingleAction/ActionIdentity";
import { encodeCIP129Identifier } from "../lib/utils";
import GovernanceVotingUI from "../Components/SingleAction/GovernanceVotingUI";
import { DataMissingInfoBox } from "../Components/Molecules/DataMissingInfoBox";

type GovernanceActionProps = {
  id: string;
};
function GovernanceAction({ id }: GovernanceActionProps) {
  const { governanceAction, isGovernanceActionLoading } =
    useGetGovernanceActionQuery(id);
  const { metadata, metadataValid, isMetadataLoading } =
    useMetadata(governanceAction);

  const abstractText = governanceAction?.abstract || metadata?.data?.abstract;
  const motivationText =
    governanceAction?.motivation || metadata?.data?.motivation;
  const rationaleText =
    governanceAction?.rationale || metadata?.data?.rationale;

  const hasAnyContent = abstractText || motivationText || rationaleText;

  const idCIP129 = encodeCIP129Identifier({
    txID: governanceAction?.tx_hash,
    index: governanceAction?.index.toString(16).padStart(2, "0"),
    bech32Prefix: "gov_action",
  });

  return (
    <Box
      data-testid={`single-action-${idCIP129}-page`}
      display="flex"
      flex={1}
      flexDirection="column"
      width="100%"
    >
      {isGovernanceActionLoading && (
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
      )}
      {!isGovernanceActionLoading && (
        <>
          <Breadcrumbs
            elementOne="Outcomes"
            elementOnePath="/outcomes"
            elementTwo={governanceAction?.title || metadata?.data?.title}
            isMetadataLoading={isMetadataLoading}
            isDataMissing={metadata?.metadataStatus || null}
          />
          <Grid container spacing={3} marginTop={0.5}>
            <Grid item xs={12} lg={7} sx={{ marginBottom: { xs: 3, lg: 0 } }}>
              <Box
                data-testid={`single-action-${idCIP129}-description`}
                sx={{
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
                }}
              >
                {governanceAction && (
                  <Box display="flex" flexDirection="column" gap="1.5rem">
                    <Header
                      title={governanceAction?.title || metadata?.data?.title}
                      isGovernanceActionLoading={isGovernanceActionLoading}
                      isMetadataLoading={isMetadataLoading}
                      governanceAction={governanceAction}
                      isDataMissing={metadata?.metadataStatus || null}
                    />
                    <DataMissingInfoBox
                      isDataMissing={metadata?.metadataStatus || null}
                    />
                    <ActionIdentity governanceAction={governanceAction} />
                    {!hasAnyContent &&
                      (!governanceAction || isMetadataLoading) && (
                        <>
                          <Skeleton variant="rounded" width="20%" height={15} />
                          <Skeleton
                            variant="rounded"
                            width="100%"
                            height={400}
                          />
                        </>
                      )}
                    {abstractText && metadataValid && (
                      <ReasoningElement
                        label="Abstract"
                        text={
                          governanceAction?.abstract ||
                          (metadata?.data?.abstract as string)
                        }
                      />
                    )}
                    {motivationText && metadataValid && (
                      <ReasoningElement
                        label="Motivation"
                        text={
                          governanceAction?.motivation ||
                          (metadata?.data?.motivation as string)
                        }
                      />
                    )}
                    {rationaleText && metadataValid && (
                      <ReasoningElement
                        label="Rationale"
                        text={
                          governanceAction?.rationale ||
                          (metadata?.data?.rationale as string)
                        }
                      />
                    )}
                    {metadataValid &&
                      metadata?.data?.references &&
                      metadata?.data?.references.length > 0 && (
                        <References links={metadata?.data?.references} />
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
        </>
      )}
    </Box>
  );
}

export default GovernanceAction;
