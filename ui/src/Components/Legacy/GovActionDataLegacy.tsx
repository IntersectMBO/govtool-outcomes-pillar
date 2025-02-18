import { GovActionWithMetadata } from "../../types/api";
import { Box } from "@mui/material";
import GovActionTitleLegacy from "./GovActionTitleLegacy";
import GovActionTypeChip from "./GovActionTypeChip";
import GovActionDatesInfo from "./GovActionDatesInfo";
import GovActionElement from "./GovActionElement";
import { encodeCIP129Identifier } from "../../lib/utils";
import { useEffect, useState } from "react";

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
  body,
  url,
  data_hash,
}: GovActionWithMetadata) => {
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  useEffect(() => {
    setShareableLink(window.location.href);
  }, []);
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
        extra={{ externalMetadataLink: shareableLink as string }}
      />
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
      <GovActionElement
        title="Governance Action ID:"
        description={{
          type: "text",
          content: encodeCIP129Identifier({
            txID: tx_hash,
            index: index.toString(16).padStart(2, "0"),
            bech32Prefix: "gov_action",
          }),
          isCopyable: true,
          truncate: true,
        }}
      />
      <GovActionElement
        title="Legacy Governance Action ID (CIP-105):"
        description={{
          type: "text",
          content: tx_hash,
          isCopyable: true,
          truncate: true,
        }}
      />
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
      <GovActionElement
        title="Metadata anchor link"
        description={{
          type: "link",
          content: url,
          truncate: true,
        }}
      />
      <GovActionElement
        title="Metadata anchor hash"
        description={{
          type: "text",
          content: data_hash,
          isCopyable: true,
          truncate: true,
        }}
      />
      {body?.references && (
        <GovActionElement
          title="Supporting links"
          description={{
            type: "linkArray",
            content: body.references,
            truncate: true,
          }}
        />
      )}
    </Box>
  );
};

export default GovActionDataLegacy;
