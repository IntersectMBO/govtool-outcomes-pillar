import { Box, Typography } from "@mui/material";
export type Vote = "yes" | "no" | "abstain";

const borderColorMap: Record<string, string> = {
  yes: "#C0E4BA",
  no: "#EDACAC",
  abstain: "#99ADDE",
  notvoted: "#EAE9F0",
};

const bgColorMap: Record<string, string> = {
  yes: "#F0F9EE",
  no: "#FBEBEB",
  abstain: "#E6EBF7",
  notvoted: "#F5F5F8",
};

const voteLabelKey: Record<string, string> = {
  yes: "Yes",
  no: "No",
  abstain: "Abstain",
  notvoted: "Not Voted",
};

const ccVoteLabelKey: Record<string, string> = {
  yes: "Constituional",
  no: "Unconstitutional",
  abstain: "Abstain",
  notvoted: "Not Voted",
};

type VoteExtended = Vote | "notVoted";

export const GovActionVotePill = ({
  vote,
  width,
  maxWidth,
  isCC,
}: {
  vote: VoteExtended;
  width?: number;
  maxWidth?: number;
  isCC?: boolean;
}) => {
  const voteKey = vote.toLocaleLowerCase();

  const bgColor = bgColorMap[voteKey];
  const borderColor = borderColorMap[voteKey];
  const labelKey = isCC ? ccVoteLabelKey[voteKey] : voteLabelKey[voteKey];

  return (
    <Box
      py={0.75}
      px={2.25}
      border={1}
      borderColor={borderColor}
      bgcolor={bgColor}
      borderRadius={100}
      textAlign="center"
      minWidth="50px"
      maxWidth={maxWidth ? `${maxWidth}px` : "auto"}
      width={width ? `${width}px` : "auto"}
    >
      <Typography
        textTransform="uppercase"
        fontSize={12}
        fontWeight={400}
        lineHeight="16px"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
      >
        {labelKey}
      </Typography>
    </Box>
  );
};
