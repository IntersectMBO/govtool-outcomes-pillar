import { Card, Typography } from "@mui/material";
import { useTranslation } from "../../contexts/I18nContext";

type ActionsEmptyStateProps = {
  title: string;
  description: string;
  dataTestId?: string;
};

export const ActionsEmptyState = ({
  title,
  description,
  dataTestId = "empty-state-placeholder",
}: ActionsEmptyStateProps) => {
  const { t } = useTranslation();
  return (
    <Card
    data-testid={dataTestId}
      variant="outlined"
      elevation={0}
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        py: 5,
        px: 1,
        width: "auto",
      }}
    >
      <Typography fontSize={22} fontWeight={500}>
        {t(title)}
      </Typography>
      <Typography fontWeight={400}>{t(description)}</Typography>
    </Card>
  );
};
