import { bech32 } from "bech32";
import { Buffer } from "buffer";
import {
  EpochParams,
  GovernanceActionType,
  Status,
  StatusTimes,
} from "../types/api";

import {
  PPU_ECONOMIC_GROUP_PARAMS_KEYS,
  PPU_GOVERNANCE_GROUP_PARAMS_KEYS,
  PPU_NETWORK_GROUP_PARAMS_KEYS,
  PPU_TECHNICAL_GROUP_PARAMS_KEYS,
} from "../consts/params";
import { VoterType } from "../models/voters";

const LOVELACE = 1000000;
export function formatTimeStamp(
  timeStamp: string,
  format: "short" | "full" = "full"
): string {
  const date = new Date(timeStamp);

  if (format === "short") {
    return date
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .replace(",", "");
  }

  return date
    .toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(",", "");
}

/**
 * Encodes a CIP129 identifier based on the provided transaction ID, index, and bech32 prefix.
 * @param txID - The transaction ID.
 * @param index - The index.
 * @param bech32Prefix - The bech32 prefix.
 * @returns The generated CIP129 identifier.
 */
export const encodeCIP129Identifier = ({
  txID,
  index,
  bech32Prefix,
}: {
  txID: string;
  index?: string;
  bech32Prefix: string;
}) => {
  if (!txID) return "";
  const govActionBytes = Buffer.from(index ? txID + index : txID, "hex");
  const words = bech32.toWords(govActionBytes);
  return bech32.encode(bech32Prefix, words);
};

/**
 * Decodes a CIP129 identifier.
 * @param cip129Identifier - The CIP129 identifier to decode.
 * @returns An object containing the decoded transaction ID, index, and prefix.
 */
export const decodeCIP129Identifier = (cip129Identifier: string) => {
  const { prefix, words } = bech32.decode(cip129Identifier);
  const buffer = Buffer.from(bech32.fromWords(words));
  const txID = buffer.subarray(0, 32).toString("hex");
  const index = buffer.subarray(32).toString("hex");
  return { txID, index, prefix };
};

export const getFullGovActionId = (txHash: string, index: number | string) =>
  `${txHash}#${index}`;

export function getProposalStatus(status: Status): string {
  if (status.enacted_epoch !== null) {
    return "Enacted";
  }
  if (status.expired_epoch !== null) {
    return "Expired";
  }
  if (status.dropped_epoch !== null) {
    return "Not Ratified";
  }
  if (status.ratified_epoch !== null) {
    return "Ratified";
  }
  if (
    status.enacted_epoch === null &&
    status.expired_epoch === null &&
    status.ratified_epoch === null &&
    status.dropped_epoch === null
  ) {
    return "Live";
  }
  return "Unknown";
}

export function getStatusDetails(status: Status, statusTimes: StatusTimes) {
  const currentStatus = getProposalStatus(status);

  let statusEpoch: number | null = null;
  let statusDate: string | null = null;

  switch (currentStatus) {
    case "Enacted":
      statusEpoch = status.enacted_epoch;
      statusDate = statusTimes.enacted_time;
      break;
    case "Expired":
      statusEpoch = status.expired_epoch;
      statusDate = statusTimes.expired_time;
      break;
    case "Ratified":
      statusEpoch = status.ratified_epoch;
      statusDate = statusTimes.ratified_time;
      break;
    case "Not Ratified":
      statusEpoch = status.dropped_epoch;
      statusDate = statusTimes.dropped_time;
      break;
    case "Live":
      statusEpoch = null;
      statusDate = null;
      break;
  }

  return {
    statusEpoch,
    statusDate: statusDate ? formatTimeStamp(statusDate) : null,
  };
}
export function contentPreview(
  content: string,
  maxLength: number = 30
): string {
  if (!content) return "";
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
}

export const removeMarkdown = (markdown?: string | number) => {
  if (!markdown) return "";

  return String(markdown)
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/`{1,2}([^`]+)`{1,2}/g, "$1")
    .replace(/^\s{0,3}>\s?/g, "")
    .replace(/^\s{1,3}([-*+]|\d+\.)\s+/g, "")
    .replace(
      /^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm,
      "$1$3$4$6"
    )
    .replace(/\n{2,}/g, "\n")
    .replace(/([\\`*{}[\]()#+\-.!_>])/g, "$1");
};

export const getGovActionVotingThresholdKey = ({
  govActionType,
  protocolParams,
  voterType,
}: {
  govActionType: GovernanceActionType;
  protocolParams?: Partial<EpochParams> | null;
  voterType?: VoterType;
}) => {
  switch (govActionType) {
    case GovernanceActionType.NewCommittee: {
      // TODO: handle dvt_committee_normal and pvt_committee_normal
      return voterType === "dReps"
        ? "dvt_committee_normal"
        : voterType === "sPos"
        ? "pvt_committee_normal"
        : undefined;
    }
    case GovernanceActionType.HardForkInitiation: {
      return voterType === "dReps"
        ? "dvt_hard_fork_initiation"
        : voterType === "sPos"
        ? "pvt_hard_fork_initiation"
        : undefined;
    }
    case GovernanceActionType.ParameterChange: {
      if (protocolParams) {
        const filteredProtocolParameterKeys = Object.entries(
          protocolParams
        ).map(([key, value]) => {
          if (typeof value === "number" || typeof value === "string") {
            return key;
          }
        });

        if (
          PPU_ECONOMIC_GROUP_PARAMS_KEYS.some((key) =>
            filteredProtocolParameterKeys.includes(key)
          )
        ) {
          return voterType === "dReps" ? "dvt_p_p_economic_group" : undefined;
        }
        if (
          PPU_GOVERNANCE_GROUP_PARAMS_KEYS.some((key) =>
            filteredProtocolParameterKeys.includes(key)
          )
        ) {
          return voterType === "dReps" ? "dvt_p_p_gov_group" : undefined;
        }
        if (
          PPU_NETWORK_GROUP_PARAMS_KEYS.some((key) =>
            filteredProtocolParameterKeys.includes(key)
          )
        ) {
          return voterType === "dReps"
            ? "dvt_p_p_network_group"
            : voterType === "sPos"
            ? "pvtpp_security_group"
            : undefined;
        }
        if (
          PPU_TECHNICAL_GROUP_PARAMS_KEYS.some((key) =>
            filteredProtocolParameterKeys.includes(key)
          )
        ) {
          return voterType === "dReps" ? "dvt_p_p_technical_group" : undefined;
        }
        return undefined;
      }
      break;
    }
    case GovernanceActionType.TreasuryWithdrawals:
      return voterType === "dReps" ? "dvt_treasury_withdrawal" : undefined;
    case GovernanceActionType.NewConstitution:
      return voterType === "dReps" ? "dvt_update_to_constitution" : undefined;
    case GovernanceActionType.NoConfidence:
      return voterType === "dReps"
        ? "dvt_motion_no_confidence"
        : "pvt_motion_no_confidence";
    default:
      return undefined;
  }
};

export const correctAdaFormatWithSuffix = (
  lovelace: number | undefined,
  precision = 2
) => {
  if (!lovelace) return "0";
  const ada = lovelace / LOVELACE;
  if (ada < 1000)
    return ada.toLocaleString("en-us", {
      maximumFractionDigits: precision,
    });

  const suffixes = ["k", "M", "B", "T"];
  const divisors = [1000, 1000000, 1000000000, 1000000000000];

  for (let i = 0; i < suffixes.length; i++) {
    if (ada < divisors[i] * 1000) {
      return (ada / divisors[i]).toFixed(precision) + suffixes[i];
    }
  }
};

export function getItemFromLocalStorage(key: string) {
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function setItemToLocalStorage(key: string, data: any) {
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function removeItemFromLocalStorage(key: string) {
  window.localStorage.removeItem(key);
}

export const correctVoteAdaFormat = (
  lovelace: number | undefined,
  locale: string | undefined = undefined
) => {
  if (lovelace) {
    const ada = lovelace / LOVELACE;

    return ada.toLocaleString(locale, {
      maximumFractionDigits: 3,
    });
  }
  return "0";
};
