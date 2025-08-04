import { Card, Typography } from "@mui/material";
import { useTranslation } from "../../contexts/I18nContext";

type ActionsEmptyStateProps = {
  title: string;
  description: string;
};
export const ActionsEmptyState = ({
  title,
  description,
}: ActionsEmptyStateProps) => {
  const { t } = useTranslation();
  return (
    <Card
      variant="outlined"
      elevation={0}
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        py: 5,
        px: 1,
        width: "-webkit-fill-available",
      }}
    >
      <Typography fontSize={22} fontWeight={500}>
        {title}
      </Typography>
      <Typography fontWeight={400}>{description}</Typography>
    </Card>
  );
};
