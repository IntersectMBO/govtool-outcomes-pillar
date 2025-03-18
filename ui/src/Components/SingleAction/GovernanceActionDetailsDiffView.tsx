import { diffLines, formatLines } from "unidiff";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import "react-diff-view/style/index.css";
import { Box, Typography } from "@mui/material";

import "./react-diff-view.overrides.css";

type Props = {
  oldJson?: JSON | Record<string, unknown> | null;
  newJson?: JSON | Record<string, unknown> | null;
};

export const GovernanceActionDetailsDiffView = ({
  oldJson,
  newJson,
}: Props) => {
  const diffText = formatLines(
    diffLines(
      JSON.stringify(oldJson, null, 2),
      JSON.stringify(newJson, null, 2)
    )
  );

  const [diff] = parseDiff(diffText, {});

  if (!oldJson && !newJson) return;

  return (
    <Box>
      <Box
        data-testid="parameter-changes-labels"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: "neutralGray",
            lineHeight: "20px",
            fontWeight: 600,
          }}
        >
          Existing
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            color: "neutralGray",
            lineHeight: "20px",
            fontWeight: 600,
          }}
        >
          Proposed
        </Typography>
      </Box>
      <Diff
        data-testid="parameters-diff-value"
        viewType="split"
        diffType={diff.type}
        hunks={diff.hunks || []}
      >
        {(hunks) =>
          hunks.map((hunk) => (
            // Hunk component does not allow to pass children as a prop
            // but that is the typing issue as passing the children
            // is recommended by documentation approach.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            <Hunk key={hunk.content} hunk={hunk}>
              {hunk.content}
            </Hunk>
          ))
        }
      </Diff>
    </Box>
  );
};
