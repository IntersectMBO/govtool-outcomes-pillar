import { Box, Typography } from "@mui/material";
import { useTranslation } from "../../contexts/I18nContext";
import GovernanceActionAuthor from "./GovernanceActionAuthor";

type GovernanceActionAuthorsProps = {
  authors: any[];
  metadataUrl?: string;
};

function GovernanceActionAuthors({
  authors,
  metadataUrl,
}: GovernanceActionAuthorsProps) {
  const { t } = useTranslation();

  return (
    <Box
      data-testid="single-action-authors"
      display="flex"
      flexDirection="column"
      gap={0.5}
    >
      <Typography
        sx={{
          color: "textGray",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {t("outcome.authors.title")}
      </Typography>
      {authors && authors.length > 0 ? (
        <Box display="flex" gap={2} flexWrap="wrap">
          {authors.map((author: any, index) => (
            <GovernanceActionAuthor
              key={index}
              author={author}
              metadataUrl={metadataUrl}
            />
          ))}
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 400,
            color: "neutralGray",
            p: 0,
          }}
        >
          {t("outcome.authors.noDataAvailable")}
        </Typography>
      )}
    </Box>
  );
}

export default GovernanceActionAuthors;
