import {
  Box,
  CircularProgress,
  Grid,
  Skeleton,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import { Breadcrumbs } from "../Components/Molecules/Breadcrumbs";
import { useGetGovernanceActionQuery } from "../hooks/useGetGovernanceActionQuery";
import Header from "../Components/SingleAction/Header";
import { useMetadata } from "../hooks/useMetadata";
import References from "../Components/SingleAction/References";
import ActionIdentity from "../Components/SingleAction/ActionIdentity";
import { encodeCIP129Identifier, getFullGovActionId } from "../lib/utils";
import GovernanceVotingUI from "../Components/SingleAction/GovernanceVoting";
import { DataMissingInfoBox } from "../Components/Molecules/DataMissingInfoBox";
import GovernanceActionElement from "../Components/SingleAction/GovernanceActionElement";
import { useMemo, useState } from "react";
import { ReasoningTabContent } from "../Components/SingleAction/ReasoningTabContent";
import { GovernanceActionDetailsDiffView } from "../Components/SingleAction/GovernanceActionDetailsDiffView";
import { mapArrayToObjectByKeys } from "../lib/mapArrayToObjectByKeys";
import { filterUpdatableProtocolParams } from "../lib/filterUpdatableProtocolParams";
import { useNetworkMetrics } from "../hooks/useNetworkMetrics";
import { filterOutNullParams } from "../lib/filterOutNullParams";
import { GovernanceActionType } from "../types/api";
import { GovernanceActionNewCommitteeDetailsTabContent } from "../Components/SingleAction/GovernanceActionNewCommitteeDetailsTabContent";
import { GovernanceActionNewConstitutionDetailsTabContent } from "../Components/SingleAction/GovernanceActionNewConstitutionDetailsTabContent";
import { useScreenDimension } from "../hooks/useDimensions";
import { GovernanceActionCardTreasuryWithdrawalElement } from "../Components/SingleAction/GovernanceActionCardTreasuryWithdrawalElement";
import { HardForkDetailsTabContent } from "../Components/SingleAction/HardForkDetailsTabContent";

type GovernanceActionProps = {
  id: string;
};

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const CustomTabPanel = ({ children, value, index }: TabPanelProps) =>
  value === index && <Box sx={{ overflow: "auto" }}>{children}</Box>;

type StyledTabProps = {
  label: string;
  isMobile: boolean;
};

const StyledTab = styled(({ isMobile, ...props }: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ isMobile }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: 16,
  width: !isMobile ? "auto" : "50%",

  color: "rgba(36, 34, 50, 0.5)",
  "&.Mui-selected": {
    color: "rgba(38, 37, 45, 1)",
  },
}));

function GovernanceAction({ id }: GovernanceActionProps) {
  const { isMobile } = useScreenDimension();
  const { governanceAction, isGovernanceActionLoading } =
    useGetGovernanceActionQuery(id);
  const { metadata, metadataValid, isMetadataLoading } =
    useMetadata(governanceAction);

  const { epochParams } = useNetworkMetrics(governanceAction);
  const [selectedTab, setSelectedTab] = useState<number>(0);

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

  const prevGovActionId =
    governanceAction?.prev_gov_action_index &&
    governanceAction?.prev_gov_action_tx_hash
      ? getFullGovActionId(
          governanceAction?.prev_gov_action_tx_hash,
          governanceAction?.prev_gov_action_index
        )
      : null;

  const mappedArraysToObjectsProtocolParams = useMemo(
    () =>
      mapArrayToObjectByKeys(governanceAction?.proposal_params, [
        "PlutusV1",
        "PlutusV2",
        "PlutusV3",
      ]),
    [governanceAction?.proposal_params]
  );

  const updatableProtocolParams = useMemo(
    () =>
      filterUpdatableProtocolParams(
        epochParams,
        mappedArraysToObjectsProtocolParams,
        ["id", "registered_tx_id", "key"]
      ),
    [epochParams, mappedArraysToObjectsProtocolParams]
  );

  const nonNullProtocolParams = useMemo(
    () =>
      filterOutNullParams(mappedArraysToObjectsProtocolParams, [
        "id",
        "registered_tx_id",
        "key",
      ]),
    [mappedArraysToObjectsProtocolParams]
  );

  const showReasoningTab = !isDataMissing && hasAnyContent;

  const showParametersTab =
    (governanceAction?.type === GovernanceActionType.ParameterChange ||
      governanceAction?.type === GovernanceActionType.NewConstitution) &&
    !!governanceAction?.proposal_params &&
    !!epochParams;

  const showHardforkDetailsTab =
    governanceAction?.type === GovernanceActionType.HardForkInitiation &&
    !!governanceAction?.description;

  const showNewCommitteeTab =
    governanceAction?.type === GovernanceActionType.NewCommittee &&
    !!governanceAction?.description;

  const showNewConstitutionTab =
    governanceAction?.type === GovernanceActionType.NewConstitution &&
    !!governanceAction?.description &&
    !!governanceAction?.description?.anchor;

  const tabDefinitions = useMemo(() => {
    return [
      {
        label: "Reasoning",
        dataTestId: "reasoning-tab",
        content: (
          <ReasoningTabContent
            abstract={content.abstract}
            motivation={content.motivation}
            rationale={content.rationale}
          />
        ),
        visible: showReasoningTab,
      },
      {
        label: "Parameters",
        dataTestId: "parameters-tab",
        content: (
          <GovernanceActionDetailsDiffView
            oldJson={updatableProtocolParams}
            newJson={nonNullProtocolParams}
          />
        ),
        visible: showParametersTab,
      },
      {
        label: "Details",
        dataTestId: "hardfork-details-tab",
        content: (
          <HardForkDetailsTabContent
            description={governanceAction?.description}
            prevGovActionId={prevGovActionId}
          />
        ),
        visible: showHardforkDetailsTab,
      },
      {
        label: "Parameters",
        dataTestId: "new-committee-tab",
        content: (
          <GovernanceActionNewCommitteeDetailsTabContent
            description={governanceAction?.description}
          />
        ),
        visible: showNewCommitteeTab,
      },
      {
        label: "Details",
        dataTestId: "new-constitution-tab",
        content: (
          <GovernanceActionNewConstitutionDetailsTabContent
            description={governanceAction?.description}
          />
        ),
        visible: showNewConstitutionTab,
      },
    ];
  }, [
    content.abstract,
    content.motivation,
    content.rationale,
    updatableProtocolParams,
    nonNullProtocolParams,
    governanceAction?.description,
    prevGovActionId,
    showReasoningTab,
    showParametersTab,
    showHardforkDetailsTab,
    showNewCommitteeTab,
    showNewConstitutionTab,
  ]);

  const visibleTabs = useMemo(() => {
    return tabDefinitions.filter((tab) => tab.visible);
  }, [tabDefinitions]);

  const handleChange: (
    event: React.SyntheticEvent,
    newValue: number
  ) => void = (_event, newValue) => {
    setSelectedTab(newValue);
  };

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

  const renderAllTabContent = () => {
    return tabDefinitions.map((tab, index) => (
      <CustomTabPanel
        key={tab.dataTestId}
        value={selectedTab}
        index={visibleTabs.findIndex(
          (visibleTab) => visibleTab.dataTestId === tab.dataTestId
        )}
      >
        {tab.visible && tab.content}
      </CustomTabPanel>
    ));
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

                {visibleTabs.length > 0 && (
                  <>
                    {visibleTabs.length === 1 ? (
                      visibleTabs[0].content
                    ) : (
                      <>
                        <Tabs
                          sx={{
                            display: "flex",
                            fontSize: 16,
                            fontWeight: 500,
                          }}
                          value={selectedTab}
                          indicatorColor="secondary"
                          onChange={handleChange}
                          aria-label="Governance action content description"
                        >
                          {visibleTabs.map((tab) => (
                            <StyledTab
                              key={tab.dataTestId}
                              data-testid={tab.dataTestId}
                              label={tab.label}
                              isMobile={isMobile}
                            />
                          ))}
                        </Tabs>
                        {renderAllTabContent()}
                      </>
                    )}
                  </>
                )}

                {governanceAction?.description &&
                  governanceAction?.type ===
                    GovernanceActionType.TreasuryWithdrawals &&
                  Array.isArray(governanceAction?.description) &&
                  governanceAction?.description?.map((withdrawal) => (
                    <GovernanceActionCardTreasuryWithdrawalElement
                      key={withdrawal.receivingAddress}
                      receivingAddress={withdrawal.receivingAddress}
                      amount={withdrawal.amount}
                    />
                  ))}

                {governanceAction?.type !==
                  GovernanceActionType.NewConstitution && (
                  <>
                    <GovernanceActionElement
                      title="Metadata anchor link"
                      type="link"
                      content={governanceAction?.url}
                      isCopyable
                      dataTestId="metadata-anchor-link"
                    />
                    <GovernanceActionElement
                      title="Metadata anchor hash"
                      type="text"
                      content={governanceAction?.data_hash}
                      isCopyable
                      dataTestId="metadata-anchor-hash"
                    />
                  </>
                )}

                {metadataValid && content.references.length > 0 && (
                  <References links={content.references} />
                )}
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} lg={5} sx={{ position: "relative" }}>
          <Box
            data-testid={`single-action-outcome-numbers`}
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
