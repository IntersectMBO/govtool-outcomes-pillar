import { GovActionWithMetadata } from "../../types/api";
import { Box } from "@mui/material";
import GovActionTitleLegacy from "./GovActionTitleLegacy";
import GovActionTypeChip from "./GovActionTypeChip";
import GovActionDatesInfo from "./GovActionDatesInfo";
import GovActionElement from "./GovActionElement";
import { encodeCIP129Identifier, getFullGovActionId } from "../../lib/utils";
import { useEffect, useState } from "react";
import GovernanceActionElement from "../SingleAction/GovernanceActionElement";
import { DataMissingInfoBox } from "../Molecules/DataMissingInfoBox";

const GovActionDataLegacy = ({
  title,
  type,
  expiry_date,
  time,
  epoch_no,
  expiration,
  tx_hash,
  index,
  abstract,
  motivation,
  rationale,
  data,
  url,
  data_hash,
  metadataStatus,
  metadataValid,
}: GovActionWithMetadata) => {
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  useEffect(() => {
    setShareableLink(window.location.href);
  }, []);

  const idCIP129 = encodeCIP129Identifier({
    txID: tx_hash,
    index: index.toString(16).padStart(2, "0"),
    bech32Prefix: "gov_action",
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <GovActionTitleLegacy
        title={title}
        isDataMissing={metadataStatus || null}
        extra={{ externalMetadataLink: shareableLink as string }}
      />
      <DataMissingInfoBox isDataMissing={metadataStatus || null} />
      <GovActionElement
        title="Governance Action Type:"
        description={{
          type: "chip",
          content: <GovActionTypeChip type={type} />,
          isCopyable: false,
          truncate: false,
        }}
      />
      <GovActionDatesInfo
        submitted={{
          date: time,
          epoch: epoch_no,
        }}
        expires={{
          epoch: expiration,
          date: expiry_date,
        }}
      />
      <GovernanceActionElement
        title="Governance Action ID:"
        type="text"
        content={idCIP129}
        isCopyable
      />
      <GovernanceActionElement
        title="Legacy Governance Action ID (CIP-105):"
        type="text"
        content={getFullGovActionId(tx_hash, index)}
        isCopyable
      />
      {metadataValid && (
        <>
          <GovActionElement
            title="Abstract:"
            description={{
              type: "text",
              content: abstract as string,
              isCopyable: false,
              truncate: false,
              isMarkdown: true,
            }}
          />
          <GovActionElement
            title="Motivation:"
            description={{
              type: "text",
              content: motivation as string,
              isCopyable: false,
              truncate: false,
              isMarkdown: true,
            }}
          />
          <GovActionElement
            title="Rationale:"
            description={{
              type: "text",
              content: rationale as string as string,
              isCopyable: false,
              truncate: false,
              isMarkdown: true,
            }}
          />
        </>
      )}
      <GovernanceActionElement
        title="Metadata anchor link"
        type="link"
        content={url}
        isCopyable
      />
      <GovernanceActionElement
        title="Metadata anchor hash"
        type="text"
        content={data_hash}
        isCopyable
      />
      {metadataValid && data?.references && (
        <GovActionElement
          title="Supporting links"
          description={{
            type: "linkArray",
            content: data.references,
            truncate: true,
          }}
        />
      )}
    </Box>
  );
};

export default GovActionDataLegacy;
