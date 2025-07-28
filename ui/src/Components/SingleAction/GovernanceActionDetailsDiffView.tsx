import { diffLines, formatLines } from "unidiff";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import "react-diff-view/style/index.css";
import { Box, Typography } from "@mui/material";

import "./react-diff-view.overrides.css";
import { useTranslation } from "../../contexts/I18nContext";

type Props = {
  oldJson?: JSON | Record<string, unknown> | null;
  newJson?: JSON | Record<string, unknown> | null;
};

export const GovernanceActionDetailsDiffView = ({
  oldJson,
  newJson,
}: Props) => {
  const { t } = useTranslation();

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
          {t("outcome.existing")}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            color: "neutralGray",
            lineHeight: "20px",
            fontWeight: 600,
          }}
        >
          {t("outcome.proposed")}
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
