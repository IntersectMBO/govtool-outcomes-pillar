import { Card, Typography } from "@mui/material";
import { primaryBlue } from "../../consts/colors";

export const ActionsEmptyState = () => {
  return (
    <Card
      variant="outlined"
      elevation={0}
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        borderColor: primaryBlue.c100,
        gap: 1,
        py: 5,
        width: "-webkit-fill-available",
      }}
    >
      <Typography fontSize={22} fontWeight={500}>
        No governance actions found
      </Typography>
      <Typography fontWeight={400}>
        Governance actions are searchable by their ID both CIP-105 (legacy) and
        CIP-129 formats, title and abstract contents.
      </Typography>
    </Card>
  );
};
