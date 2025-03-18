import { Box, Grid, Typography } from "@mui/material";
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
          fontSize: "0.875rem",
          color: "neutralGray",
          fontWeight: 500,
          marginBottom: 1,
        }}
      >
        Supporting Links
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {links &&
            links.map((link, index) => (
              <Grid item xs={6} key={index}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 400,
                      color: "textBlack",
                      marginBottom: 0.5,
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
                      gap="0.25rem"
                    >
                      <img
                        alt="Link icon."
                        height={15}
                        width={15}
                        src="/icons/Link.svg"
                      />
                      <Typography
                        sx={(theme) => ({
                          fontSize: "0.75rem",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          padding: 1,
                          borderRadius: "0.25rem",
                          width: "100%",
                          color: "primaryBlue",
                          "&:hover": {
                            boxShadow: theme.shadows[1],
                          },
                        })}
                      >
                        {link?.uri}
                      </Typography>
                    </Box>
                  </a>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default References;
