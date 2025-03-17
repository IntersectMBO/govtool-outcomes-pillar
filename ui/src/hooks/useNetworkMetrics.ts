import { useState, useEffect, useCallback } from "react";
import {
  EpochParams,
  GovernanceAction,
  NetworkMetrics,
  GovernanceActionType,
} from "../types/api";
import { getNetworkMetrics } from "../services/requests/getNetworkMetrics";
import { getEpochParams } from "../services/requests/getEpochParams";

/**
 * Custom hook to fetch network metrics and epoch parameters
 * @param action The governance action to get the epoch number from
 * @returns Object containing network metrics, epoch parameters, and vote display logic
 */
const BOOTSTRAPPING_PHASE_MAJOR = 9;

export const useNetworkMetrics = (action: GovernanceAction) => {
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(
    null
  );
  const [epochParams, setEpochParams] = useState<EpochParams | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const getEpochForMetrics = () => {
    if (action?.status?.ratified_epoch) return action?.status?.ratified_epoch;
    if (action?.status?.enacted_epoch) return action?.status?.enacted_epoch;
    if (action?.status?.expired_epoch) return action?.status?.expired_epoch;
    if (action?.status?.dropped_epoch) return action?.status?.dropped_epoch;
    return null;
  };

  const metricsEpoch = getEpochForMetrics();

  const isInBootstrapPhase =
    epochParams?.protocol_major === BOOTSTRAPPING_PHASE_MAJOR;
  const isFullGovernance = Number(epochParams?.protocol_major) >= 10;

  useEffect(() => {
    const fetchNetworkMetrics = async () => {
      if (!action) return;

      setIsLoading(true);
      setError(null);
      setNetworkMetrics(null);
      setEpochParams(null);

      try {
        const metrics =
          metricsEpoch !== null
            ? await getNetworkMetrics(metricsEpoch)
            : await getNetworkMetrics();

        const params =
          metricsEpoch !== null
            ? await getEpochParams(metricsEpoch)
            : await getEpochParams();

        setNetworkMetrics(metrics);
        setEpochParams(params);
      } catch (error) {
        console.error("Failed to fetch network metrics:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkMetrics();
  }, [action, metricsEpoch]);

  /**
   * Determines if DRep vote totals should be displayed based on governance action type and phase.
   * @param governanceActionType - The type of governance action.
   * @param isSecurityGroup - Whether this is a security parameter group (optional).
   * @returns {boolean} Whether DRep vote totals are displayed.
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
   * @param governanceActionType - The type of governance action.
   * @param isSecurityGroup - Whether this is a security parameter group.
   * @returns {boolean} Whether SPO vote totals are displayed.
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
   * @param governanceActionType - The type of governance action.
   * @returns {boolean} Whether CC vote totals are displayed.
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
    networkMetrics,
    epochParams,
    isLoading,
    error,
    metricsEpoch,

    // Governance phase flags
    isInBootstrapPhase,
    isFullGovernance,

    // Vote display logic
    areDRepVoteTotalsDisplayed,
    areSPOVoteTotalsDisplayed,
    areCCVoteTotalsDisplayed,
  };
};
