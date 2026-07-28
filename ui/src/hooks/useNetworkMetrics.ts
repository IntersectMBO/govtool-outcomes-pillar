import { useQueries } from "@tanstack/react-query";
import {
  EpochParams,
  GovernanceAction,
  NetworkMetrics,
  GovernanceActionType,
} from "../types/api";
import { getNetworkMetrics } from "../services/requests/getNetworkMetrics";
import { getEpochParams } from "../services/requests/getEpochParams";
import { useCallback, useMemo } from "react";

const BOOTSTRAPPING_PHASE_MAJOR = 9;

/**
 * Custom hook to fetch network metrics and epoch parameters
 * @param action The governance action to get the epoch number from
 * @returns Object containing network metrics, epoch parameters, and vote display logic
 */
export const useNetworkMetrics = (action: GovernanceAction) => {
  const getEpochForMetrics = useMemo(() => {
    if (action?.status?.ratified_epoch) {
      return action.status.ratified_epoch;
    } else if (action?.status?.expired_epoch) {
      return action?.status?.expired_epoch;
    } else if (action?.status?.dropped_epoch) {
      return action?.status?.dropped_epoch;
    } else {
      return null;
    }
  }, [action]);

  const queries = useQueries({
    queries: [
      {
        queryKey: ["networkMetrics", getEpochForMetrics],
        queryFn: () =>
          getEpochForMetrics !== null
            ? getNetworkMetrics(getEpochForMetrics)
            : getNetworkMetrics(),
        enabled: !!action,
      },
      {
        queryKey: ["epochParams", getEpochForMetrics],
        queryFn: () =>
          getEpochForMetrics !== null
            ? getEpochParams(getEpochForMetrics)
            : getEpochParams(),
        enabled: !!action,
      },
    ],
  });

  const [metricsQuery, epochParamsQuery] = queries;

  const networkMetrics = metricsQuery.data as NetworkMetrics | undefined;
  const epochParams = epochParamsQuery.data as EpochParams | undefined;
  const isLoading = metricsQuery.isLoading || epochParamsQuery.isLoading;
  const error = metricsQuery.error || epochParamsQuery.error;

  const isInBootstrapPhase =
    epochParams?.protocol_major === BOOTSTRAPPING_PHASE_MAJOR;
  const isFullGovernance = Number(epochParams?.protocol_major) >= 10;

  /**
   * Determines if DRep vote totals should be displayed based on governance action type and phase.
   */
  const areDRepVoteTotalsDisplayed = useCallback(
    (
      governanceActionType: GovernanceActionType,
      isSecurityGroup: boolean = false
    ) => {
      if (isInBootstrapPhase) {
        return !(
          governanceActionType === GovernanceActionType.HardForkInitiation ||
          (governanceActionType === GovernanceActionType.ParameterChange &&
            !isSecurityGroup)
        );
      }

      return true;
    },
    [isInBootstrapPhase]
  );

  /**
   * Determines if SPO vote totals should be displayed based on governance action type and phase.
   */
  const areSPOVoteTotalsDisplayed = useCallback(
    (governanceActionType: GovernanceActionType, isSecurityGroup: boolean) => {
      if (isInBootstrapPhase) {
        return governanceActionType !== GovernanceActionType.ParameterChange;
      }
      if (isFullGovernance) {
        return !(
          governanceActionType === GovernanceActionType.NewConstitution ||
          governanceActionType === GovernanceActionType.TreasuryWithdrawals ||
          (governanceActionType === GovernanceActionType.ParameterChange &&
            !isSecurityGroup)
        );
      }
      return true;
    },
    [isInBootstrapPhase, isFullGovernance]
  );

  /**
   * Determines if CC vote totals should be displayed based on governance action type and phase.
   */
  const areCCVoteTotalsDisplayed = useCallback(
    (governanceActionType: GovernanceActionType) => {
      if (isFullGovernance) {
        return ![
          GovernanceActionType.NoConfidence,
          GovernanceActionType.NewCommittee,
        ].includes(governanceActionType);
      }
      return true;
    },
    [isFullGovernance]
  );

  return {
    // Network and epoch data
    networkMetrics: networkMetrics || null,
    epochParams: epochParams || null,
    isLoading,
    error,
    metricsEpoch: getEpochForMetrics,

    // Governance phase flags
    isInBootstrapPhase,
    isFullGovernance,

    // Vote display logic
    areDRepVoteTotalsDisplayed,
    areSPOVoteTotalsDisplayed,
    areCCVoteTotalsDisplayed,
  };
};
