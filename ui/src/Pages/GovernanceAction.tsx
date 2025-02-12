import {
  Box,
  ButtonBase,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { Breadcrumbs } from "../Components/Molecules/Breadcrumbs";
import { useGetGovernanceActionQuery } from "../hooks/useGetGovernanceActionQuery";
import Header from "../Components/SingleAction/Header";
import { useMetadata } from "../hooks/useMetadata";
import { useSnackbar } from "../contexts/Snackbar";
import ReasoningElement from "../Components/SingleAction/ReasoningElement";
import References from "../Components/SingleAction/References";
import ActionIdentity from "../Components/SingleAction/ActionIdentity";

type GovernanceActionProps = {
  id: string;
};
function GovernanceAction({ id }: GovernanceActionProps) {
  const { governanceAction, isGovernanceActionLoading } =
    useGetGovernanceActionQuery(id);
  const { metadata, metadataValid, isMetadataLoading } = useMetadata(
    governanceAction,
    {
      skipConditionCheck: true,
    }
  );
  const { addSuccessAlert } = useSnackbar();

  const onCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    addSuccessAlert("Copied to clipboard!");
  };

  const abstractText = governanceAction?.abstract || metadata?.body?.abstract;
  const motivationText =
    governanceAction?.motivation || metadata?.body?.motivation;
  const rationaleText =
    governanceAction?.rationale || metadata?.body?.rationale;

  const hasAnyContent = abstractText || motivationText || rationaleText;

  return (
    <Box display="flex" flex={1} flexDirection="column" width="100%">
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
            elementOne="Governance Actions"
            elementOnePath="/outcomes"
            elementTwo={governanceAction?.title || metadata?.body?.title}
            isMetadataLoading={isMetadataLoading}
          />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {isGovernanceActionLoading || isMetadataLoading ? (
              <Skeleton variant="rounded" width="75%" height={32} />
            ) : (
              <Typography
                fontWeight={500}
                fontSize="1.75rem"
                lineHeight="2.25rem"
              >
                {governanceAction?.title || metadata?.body?.title}
              </Typography>
            )}
            <ButtonBase
              onClick={onCopy}
              sx={(theme) => ({
                alignItems: "center",
                bgcolor: "#F7F9FB",
                borderRadius: 50,
                boxShadow: theme.shadows[1],
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                padding: 1.5,
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: theme.shadows[3],
                },
              })}
            >
              <img
                alt="Share icon."
                height={24}
                width={24}
                src="/icons/Share.svg"
              />
            </ButtonBase>
          </Box>
          <Grid container spacing={3} sx={{ marginTop: 4 }}>
            <Grid item xs={12} lg={8} sx={{ marginBottom: { xs: 3, lg: 0 } }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0px 4px 15px 0px #DDE3F5",
                  borderRadius: "1.25rem",

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
                      dateSubmitted={governanceAction?.time}
                      epochSubmitted={governanceAction?.epoch_no}
                      status={governanceAction?.status}
                    />
                    {!metadataValid && (
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: "errorRed" }}>
                          Data not processable!
                        </Typography>
                      </Box>
                    )}
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
                    {abstractText && (
                      <ReasoningElement
                        label="Abstract"
                        text={
                          governanceAction?.abstract || metadata?.body?.abstract
                        }
                      />
                    )}
                    {motivationText && (
                      <ReasoningElement
                        label="Motivation"
                        text={
                          governanceAction?.motivation ||
                          metadata?.body?.motivation
                        }
                      />
                    )}
                    {rationaleText && (
                      <ReasoningElement
                        label="Rationale"
                        text={
                          governanceAction?.rationale ||
                          metadata?.body?.rationale
                        }
                      />
                    )}
                    {metadata?.body?.references.length > 0 && (
                      <References links={metadata?.body?.references} />
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0px 4px 15px 0px #DDE3F5",
                  borderRadius: "1.25rem",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  padding: 2,
                }}
              >
                <Typography>Voting Outcomes Tab</Typography>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default GovernanceAction;
