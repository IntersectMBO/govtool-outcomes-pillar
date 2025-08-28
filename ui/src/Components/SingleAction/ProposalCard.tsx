import { Box, Button } from "@mui/material";

import { Link } from "react-router-dom";
import { formatTimeStamp } from "../../lib/utils";
import { theme } from "../../theme";
import { Typography } from "../Atoms/Typography";
import { useTranslation } from "../../contexts/I18nContext";

const ProposalCard = ({ proposal }: { proposal: any }) => {
  const { t } = useTranslation();
  const {
    palette: { customDivider },
  } = theme;

  return (
    <Box
      data-testid={`proposal-${
        proposal?.attributes?.content?.attributes?.gov_action_type?.attributes
          ?.gov_action_type_name
          ? proposal?.attributes?.content?.attributes?.gov_action_type?.attributes?.gov_action_type_name?.toLowerCase()
          : ""
      }-card`}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Box display={"flex"} flexDirection={"row"} gap={2}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          gap={1}
          py={1}
          px={1}
          sx={{
            backgroundColor: customDivider.primary,
            borderRadius: "14px",
          }}
        >
          <Typography
            variant="body2"
            component="p"
            color="textBlack"
            data-testid="proposed-date-wrapper"
          >
            {t("proposalDiscussion.proposedOn")}
            <Box component="span" data-testid="proposed-date" ml={0.5}>
              {formatTimeStamp(proposal?.attributes?.createdAt, "short")}
            </Box>
          </Typography>
        </Box>
        <Box>
          <Link
            to={`/proposal_discussion/${proposal?.id}`}
            data-testid={`proposal-${proposal?.id}-view-details-link-wrapper`}
          >
            <Button
              variant="contained"
              data-testid={`proposal-${proposal?.id}-view-details`}
              fullWidth
            >
              {t("outcome.seeDiscussion")}
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ProposalCard;
