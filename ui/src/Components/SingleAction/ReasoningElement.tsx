import { Box, Typography } from "@mui/material";
import Markdown from "react-markdown";
type ReasoningElementProps = {
  label: string;
  text: string;
};
function ReasoningElement({ label, text }: ReasoningElementProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 500,
          lineHeight: "1rem",
          color: "neutralGray",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
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
          marginTop: 1,
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
                    fontSize: "1rem",
                    fontWeight: 400,
                    lineHeight: "1.5rem",
                    maxWidth: "auto",
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
