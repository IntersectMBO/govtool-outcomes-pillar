import { IconExternalLink } from "@intersect.mbo/intersectmbo.org-icons-set";
import Markdown from "react-markdown";
import { Box, Typography, IconButton, Tooltip, Link } from "@mui/material";
import React, { useState, PropsWithChildren } from "react";
import CopyIcon from "../../Assets/Icons/CopyIcon";
import { contentPreview } from "../../lib/utils";
import { openInNewTab } from "../../lib/openInNewTab";
import { useAppContext } from "../../contexts/AppContext";

type BaseProperties = {
  isCopyable?: boolean;
  truncate?: boolean;
};

type TextContent = {
  type: "text";
  content: string | React.ReactNode;
  isMarkdown?: boolean;
} & BaseProperties;

type LinkContent = {
  type: "link";
  content: string;
} & BaseProperties;

type ChipContent = {
  type: "chip";
  content: React.ReactNode;
} & BaseProperties;

type LinkItem = {
  "@type": string;
  label: string;
  uri: string;
};

type LinkArrayContent = {
  type: "linkArray";
  content: LinkItem[];
} & BaseProperties;

type GovActionElementContent =
  | TextContent
  | LinkContent
  | ChipContent
  | LinkArrayContent;

interface GovActionElementProps {
  title: string | null;
  description: GovActionElementContent;
}

const GovActionElement = ({ title, description }: GovActionElementProps) => {
  const { ipfsGateway } = useAppContext();

  if (!description) return null;
  const isContentEmpty = () => {
    switch (description.type) {
      case "text":
        return (
          description.content == null ||
          (typeof description.content === "string" &&
            !description.content.trim())
        );

      case "link":
        return !description.content?.trim();

      case "chip":
        return !description.content;

      case "linkArray":
        return (
          !Array.isArray(description.content) ||
          !description.content.length ||
          !description.content.some((link) => link.uri && link.label)
        );

      default:
        return true;
    }
  };

  if (!title?.trim() || isContentEmpty()) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const CopyButton = ({ text }: { text: string }) => (
    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
      <IconButton onClick={() => handleCopy(text)} size="small" sx={{ ml: 1 }}>
        <CopyIcon width={16} height={16} />
      </IconButton>
    </Tooltip>
  );

  const renderMarkdownText = ({ children }: PropsWithChildren) => (
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

  const markdownComponents = {
    p: (props: PropsWithChildren) => {
      const { children } = props;
      return renderMarkdownText({ children });
    },
  };

  const renderMarkdown = (text: string) => (
    <Markdown components={markdownComponents}>{text.toString()}</Markdown>
  );

  const LinkButton = ({ url }: { url: string }) => (
    <IconButton onClick={() => openInNewTab(url, ipfsGateway)}>
      <IconExternalLink fill="#0033AD" />
    </IconButton>
  );

  const renderDescription = () => {
    switch (description.type) {
      case "text":
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {typeof description.content === "string" ? (
              <>
                {description.isMarkdown ? (
                  <Box
                    fontFamily="Poppins, Arial"
                    sx={{ width: "100%", color: "inherit" }}
                  >
                    {renderMarkdown(
                      description.truncate
                        ? contentPreview(description.content)
                        : description.content
                    )}
                  </Box>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      color: description.isCopyable ? "primary.main" : "black",
                    }}
                  >
                    {description.truncate
                      ? contentPreview(description.content)
                      : description.content}
                  </Typography>
                )}
                {description.isCopyable && (
                  <CopyButton text={description.content} />
                )}
              </>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: description.isCopyable ? "primary.main" : "black",
                }}
              >
                {description.content}
              </Typography>
            )}
          </Box>
        );

      case "link":
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <a href={description.content} style={{ textDecoration: "none" }}>
              <Typography variant="body1">
                {" "}
                {description.truncate
                  ? contentPreview(description.content)
                  : description.content}
              </Typography>
            </a>
            <LinkButton url={description.content} />
          </Box>
        );

      case "chip":
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {description.content}
          </Box>
        );

      case "linkArray":
        if (!Array.isArray(description.content)) return null;

        return (
          <Box
            component="ul"
            sx={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {(description.content as LinkItem[]).map((link, index) => (
              <li key={`${link.uri}-${index}`}>
                <Typography variant="body1">{link.label}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Link
                    sx={{
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                    onClick={() => openInNewTab(link.uri, ipfsGateway)}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "primary.main",
                      }}
                    >
                      {description.truncate
                        ? contentPreview(link.uri)
                        : link.uri}
                    </Typography>
                  </Link>
                  <LinkButton url={link.uri} />
                </Box>
              </li>
            ))}
          </Box>
        );
    }
  };

  if (!title) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography color={"textGray"} fontWeight={600} sx={{ fontSize: 14 }}>
        {title}
      </Typography>
      {renderDescription()}
    </Box>
  );
};

export default GovActionElement;
