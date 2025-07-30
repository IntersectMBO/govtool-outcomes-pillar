import { diffLines, formatLines } from "unidiff";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import "react-diff-view/style/index.css";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "../../contexts/I18nContext";

type EpochDiffViewProps = {
  expirationEpoch?: number | string | null;
  newExpirationEpoch?: number | string | null;
};

export const EpochDiffView = ({
  expirationEpoch,
  newExpirationEpoch,
}: EpochDiffViewProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const oldJson = {
    [t("outcome.expirationEpoch")]: expirationEpoch ?? "-",
  };

  const newJson = {
    [t("outcome.newExpirationEpoch")]: newExpirationEpoch ?? "-",
  };

  const diffText = formatLines(
    diffLines(
      JSON.stringify(oldJson, null, 2),
      JSON.stringify(newJson, null, 2)
    )
  );

  const [diff] = parseDiff(diffText, {});

  return (
    <Box sx={{ mt: 1 }}>
      <Diff
        viewType={isSmallScreen ? "unified" : "split"}
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
