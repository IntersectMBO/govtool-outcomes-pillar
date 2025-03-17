import { Chip } from "@mui/material";
import { errorRed, primaryBlue, successGreen } from "../../consts/colors";

type StatusChipProps = {
  status: string;
  isUppercase?: boolean;
  bgColor?: string;
};

const bgColorMap: Record<StatusChipProps["status"], string> = {
  Live: successGreen.c100,
  Ratified: successGreen.c100,
  Enacted: successGreen.c100,
  Expired: errorRed.c100,
  "Not Ratified": primaryBlue.c100,
};

function StatusChip({ status, isUppercase, bgColor }: StatusChipProps) {
  const label = isUppercase ? status.toLocaleUpperCase() : status;

  return (
    <Chip
      label={label}
      sx={{
        backgroundColor: bgColor ? bgColor : bgColorMap[status],
        borderRadius: 100,
        height: "auto",
        py: 0.75,
        px: 2.25,
        "& .MuiChip-label": {
          fontSize: 12,
          fontWeight: 400,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          color: "textBlack",
          px: 0,
          py: 0,
        },
      }}
    />
  );
}

export default StatusChip;
