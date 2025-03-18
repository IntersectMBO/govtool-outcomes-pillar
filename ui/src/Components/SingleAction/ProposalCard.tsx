import {
  IconChatAlt,
  IconInformationCircle,
  IconLink,
  IconShare,
} from "@intersect.mbo/intersectmbo.org-icons-set";
import {
  Badge,
  BadgeProps,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  Stack,
  Tooltip,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatTimeStamp } from "../../lib/utils";
import Markdown from "react-markdown";
import { useSnackbar } from "../../contexts/Snackbar";

const ProposalCard = ({ proposal }: { proposal: any }) => {
  const [proposalLink, setProposalLink] = useState("");
  const { addSuccessAlert } = useSnackbar();

  useEffect(() => {
    let domain = new URL(window.location.href);
    let origin = domain.origin;
    setProposalLink(`${origin}/proposal_discussion/`);
  }, [proposalLink]);

  interface CardStatusBadgeProps extends BadgeProps {
    draft?: boolean;
    submitted?: boolean;
  }

  const filterProps = ({ draft, submitted, ...rest }: CardStatusBadgeProps) =>
    rest;

  const CardStatusBadge = styled(
    ({ draft, submitted, ...rest }: CardStatusBadgeProps) => (
      <Badge {...filterProps(rest)} />
    )
  )(({ draft = false, submitted = false }) => ({
    width: "100%",
    height: "100%",
    "& .MuiBadge-badge": {
      transform: "translate(-25px, -15px)",
      color: submitted ? "white" : draft ? "#212A3D" : "#315E29",
      backgroundColor: submitted ? "#506288" : draft ? "#D6D8FF" : "#C0E4BA",
      padding: "14px 12px",
      borderRadius: 100,
    },
  }));

  const CardContentComponent = ({ proposal }: { proposal: any }) => {
    function copyToClipboard(value: string) {
      navigator.clipboard.writeText(value);
      addSuccessAlert("Copied to clipboard!");
    }

    return (
      <Card
        raised
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: alpha("#FFFFFF", 0.3),
          minHeight: "400px",
        }}
      >
        <CardHeader
          action={
            proposal?.attributes?.content?.attributes?.is_draft ? null : (
              <Tooltip title="Share Proposal">
                <IconButton
                  id="share-button-card"
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                  onClick={() =>
                    copyToClipboard(`${proposalLink}${proposal?.id}`)
                  }
                  data-testid={`proposal-${proposal?.id}-share-button`}
                >
                  <IconShare width="24" height="24" fill="textBlack" />
                </IconButton>
              </Tooltip>
            )
          }
          title={
            <>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  lineClamp: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                data-testid={`proposal-${proposal?.id}-title`}
              >
                {proposal?.attributes?.content?.attributes?.prop_name}
              </Typography>
              <Typography
                variant="body2"
                component={"h5"}
                sx={{
                  color: "#242232",
                }}
                mt={1}
              >
                @{proposal?.attributes?.user_govtool_username}
              </Typography>
            </>
          }
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Box display={"flex"} flexDirection={"column"} gap={2} mb={3}>
            <Box>
              <Typography variant="caption" component="p" color="#506288">
                Abstract
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "unset",
                  overflow: "hidden",
                  flexDirection: "column",
                  fontFamily: "Poppins, Arial",
                }}
              >
                <Markdown
                  components={{
                    // eslint-disable-next-line
                    p(props) {
                      const { children } = props;
                      return (
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 400,
                            lineHeight: "20px",
                            maxWidth: "auto",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            color: "#242232",
                            WebkitLineClamp: 2,
                          }}
                        >
                          {children}
                        </Typography>
                      );
                    },
                  }}
                >
                  {proposal?.attributes?.content?.attributes?.prop_abstract.toString() ??
                    ""}
                </Markdown>
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" component="p" color="#506288">
                Governance Action Type
              </Typography>
              <Typography
                variant="body2"
                component="p"
                color="#242232"
                data-testid="governance-action-type"
              >
                {
                  proposal?.attributes?.content?.attributes?.gov_action_type
                    ?.attributes?.gov_action_type_name
                }
              </Typography>
            </Box>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            mt={"auto"}
            gap={3}
            pt={3}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={1}
              py={1}
              px={1}
              sx={{
                backgroundColor: "#B8CDFF",
                borderRadius: "14px",
              }}
            >
              <Tooltip title={"Proposal Date"}>
                <Box display={"flex"} alignItems={"center"}>
                  <IconInformationCircle color="textBlack" />
                </Box>
              </Tooltip>
              <Typography
                variant="body2"
                component="p"
                color="text.black"
                data-testid={
                  proposal?.attributes?.content?.attributes?.is_draft
                    ? "not-submitted-text"
                    : "proposed-date-wrapper"
                }
              >
                {proposal?.attributes?.content?.attributes?.is_draft
                  ? "Not submitted"
                  : `Proposed on: `}
                {!proposal?.attributes?.content?.attributes?.is_draft && (
                  <span data-testid="proposed-date">
                    {formatTimeStamp(proposal?.attributes?.createdAt, "short")}
                  </span>
                )}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              gap={2}
            >
              {proposal?.attributes?.content?.attributes?.is_draft ? null : (
                <Box display={"flex"} gap={1}>
                  <Tooltip title={"Comments Number"}>
                    <Box display={"flex"} alignItems={"center"}>
                      <IconButton
                        data-testid={`proposal-${proposal?.id}-comment-count`}
                        disabled={true}
                      >
                        <Badge
                          sx={{
                            "& .MuiBadge-badge": {
                              transform: "translate(40px, -30px) !important",
                              color: "white !important",
                              backgroundColor: "#CC0000",
                              padding: "unset !important",
                              borderRadius: "none !important",
                            },
                          }}
                          badgeContent={
                            proposal?.attributes?.prop_comments_number || 0
                          }
                          aria-label="comments"
                          showZero
                        ></Badge>
                        <IconChatAlt />
                      </IconButton>
                    </Box>
                  </Tooltip>
                </Box>
              )}

              <Box flexGrow={1}>
                <Link
                  to={`/proposal_discussion/${proposal?.id}`}
                  data-testid={`proposal-${proposal?.id}-view-details-link-wrapper`}
                >
                  <Button
                    variant="contained"
                    data-testid={`proposal-${proposal?.id}-view-details`}
                    fullWidth
                  >
                    View Details
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <div
      data-testid={`proposal-${
        proposal?.attributes?.content?.attributes?.gov_action_type?.attributes
          ?.gov_action_type_name
          ? proposal?.attributes?.content?.attributes?.gov_action_type?.attributes?.gov_action_type_name?.toLowerCase()
          : ""
      }-card`}
      style={{
        height: "100%",
      }}
    >
      <CardStatusBadge
        data-testid={`proposal-${proposal?.id}-status`}
        badgeContent={
          proposal?.attributes?.content?.attributes?.prop_submitted
            ? "Submitted for vote"
            : "Active"
        }
        aria-label="status-badge"
        submitted={
          proposal?.attributes?.content?.attributes?.prop_submitted
            ? true
            : false
        }
        showZero
      >
        <CardContentComponent proposal={proposal} />
      </CardStatusBadge>
    </div>
  );
};

export default ProposalCard;
