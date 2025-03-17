import { Box } from "@mui/material";
import { Typography } from "../Atoms/Typography";
interface Reference {
  "@type": string;
  label: string;
  uri: string;
}
type ReferencesProps = {
  links: Reference[];
};
function References({ links }: ReferencesProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 14,
          color: "textGray",
          fontWeight: 600,
          marginBottom: 1,
        }}
      >
        Supporting Links
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {links &&
          links.map((link, index) => (
            <Box key={index}>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "textBlack",
                }}
              >
                {link?.label}
              </Typography>
              <a
                href={link.uri}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap="4px"
                >
                  <img
                    alt="Link icon."
                    height={15}
                    width={15}
                    src="/icons/Link.svg"
                  />
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 400,
                      overflow: "hidden",
                      width: "100%",
                      color: "primaryBlue",
                    }}
                  >
                    {link?.uri}
                  </Typography>
                </Box>
              </a>
            </Box>
          ))}
      </Box>
    </Box>
  );
}

export default References;
