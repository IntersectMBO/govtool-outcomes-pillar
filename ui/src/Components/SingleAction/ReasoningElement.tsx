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
  return (
    <Box
      data-testid={dataTestId}
      sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: "auto" }}
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
          width: "auto",
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
                    color: "textBlack",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {children}
                </Typography>
              );
            },
            img(props) {
              const { ref, ...imgProps } = props;
              return (
                <Box
                  component="img"
                  {...imgProps}
                  sx={{
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                    marginY: 2,
                  }}
                />
              );
            },
            table(props) {
              const { children } = props;
              return (
                <div className="markdown-table-wrapper">
                  <table>{children}</table>
                </div>
              );
            },
            ul(props) {
              return (
                <Box
                  component="ul"
                  sx={{
                    pl: 4,
                    color: "textBlack",
                    fontSize: 16,
                    lineHeight: 1.7,
                    listStyleType: "disc",
                  }}
                >
                  {props.children}
                </Box>
              );
            },
            ol(props) {
              return (
                <Box
                  component="ol"
                  sx={{
                    pl: 4,
                    color: "textBlack",
                    fontSize: 16,
                    lineHeight: 1.7,
                    listStyleType: "decimal",
                  }}
                >
                  {props.children}
                </Box>
              );
            },
            li(props) {
              return (
                <Box
                  component="li"
                  sx={{
                    color: "textBlack",
                    fontSize: 16,
                    lineHeight: 1.7,
                    mb: 0.5,
                  }}
                >
                  {props.children}
                </Box>
              );
            },
            strong(props) {
              return (
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: "textBlack",
                    fontSize: 16,
                    lineHeight: 1.7,
                  }}
                >
                  {props.children}
                </Typography>
              );
            },
            em(props) {
              return (
                <Typography
                  component="span"
                  sx={{
                    fontStyle: "italic",
                    color: "textBlack",
                    fontSize: 16,
                    lineHeight: 1.7,
                  }}
                >
                  {props.children}
                </Typography>
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
