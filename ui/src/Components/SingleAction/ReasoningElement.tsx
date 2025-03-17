import { Box, Typography } from "@mui/material";
import Markdown from "react-markdown";
type ReasoningElementProps = {
  label: string;
  text: string;
  dataTestId?: string;
};
function ReasoningElement({ label, text, dataTestId }: ReasoningElementProps) {
  return (
    <Box
      data-testid={dataTestId}
      sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
    >
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: "textGray",
        }}
      >
        {label}
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
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "24px",
                    maxWidth: "auto",
                    color: "textBlack",
                  }}
                >
                  {children}
                </Typography>
              );
            },
          }}
        >
          {text?.toString()}
        </Markdown>
      </Box>
    </Box>
  );
}

export default ReasoningElement;
