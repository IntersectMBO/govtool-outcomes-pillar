import { Box } from "@mui/material";
import { Typography } from "../Atoms/Typography";
import Markdown from "react-markdown";

type GovernanceActionCardElementProps = {
  title: string;
  description: string;
  type: string;
  dataTestId: string;
};

export default function GovernanceActionCardElement({
  title,
  description,
  type,
  dataTestId,
}: GovernanceActionCardElementProps) {
  const renderContent = () => {
    if (type === "text") {
      return (
        <Typography
          sx={{
            fontSize: 14,
            overflow: "hidden",
            lineHeight: "20px",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            maxWidth: "auto",
            fontWeight: 400,
          }}
        >
          {description}
        </Typography>
      );
    }

    if (type === "markdown") {
      return (
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
                      WebkitLineClamp: 2,
                    }}
                  >
                    {children}
                  </Typography>
                );
              },
            }}
          >
            {description?.toString()}
          </Markdown>
        </Box>
      );
    }
  };
  return (
    <Box data-testid={dataTestId}>
      <Typography
        sx={{
          fontSize: 12,
          color: "textGray",
          lineHeight: "16px",
          marginBottom: "4px",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>
      {renderContent()}
    </Box>
  );
}
