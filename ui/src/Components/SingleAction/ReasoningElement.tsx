import { Box, Typography } from "@mui/material";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useScreenDimension } from "../../hooks/useDimensions";

type ReasoningElementProps = {
  label: string;
  text: string;
  dataTestId?: string;
};
function ReasoningElement({ label, text, dataTestId }: ReasoningElementProps) {
  const { isMobile, screenWidth } = useScreenDimension();

  return (
    <Box
      data-testid={dataTestId}
      sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: "100%" }}
    >
      <Typography
        data-testid={`${label}-label`}
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: "textGray",
        }}
      >
        {label}
      </Typography>
      <Box
        data-testid={`${label}-content`}
        sx={{
          display: "flex",
          alignItems: "unset",
          overflow: "hidden",
          flexDirection: "column",
          fontFamily: "Poppins, Arial",
          width: "100%",
        }}
      >
        <Markdown
          className="markdown-content-wrapper"
          components={{
            p(props) {
              const { children } = props;
              return (
                <Typography
                  component="p"
                  sx={{
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    maxWidth: "auto",
                    color: "textBlack",
                    whiteSpace: "pre-wrap",
                    width: "100%",
                  }}
                >
                  {children}
                </Typography>
              );
            },
            table(props) {
              const { children } = props;
              return (
                <Box
                  sx={{
                    display: "block",
                    overflow: "scroll",
                    maxWidth: isMobile ? `${screenWidth - 64}px` : "100%",
                    marginY: 2,
                    WebkitOverflowScrolling: "touch",
                    touchAction: "pan-x pan-y",
                  }}
                  className="markdown-table-wrapper"
                >
                  <table>{children}</table>
                </Box>
              );
            },
          }}
          remarkPlugins={[remarkMath, remarkBreaks, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {text?.toString()}
        </Markdown>
      </Box>
    </Box>
  );
}

export default ReasoningElement;
