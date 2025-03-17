import { Avatar, Box } from "@mui/material";
import { Typography } from "../Atoms/Typography";
import CloseIcon from "../../Assets/Icons/CloseIcon";
import CheckMarkIcon from "../../Assets/Icons/CheckMarkIcon";
import { errorRed, successGreen } from "../../consts/colors";
type OutcomeIndicatorProps = {
  title: string;
  passed: boolean;
  isDisplayed: boolean;
};
export const OutcomeIndicator = ({
  title,
  passed,
  isDisplayed,
}: OutcomeIndicatorProps) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Avatar
        sx={{
          bgcolor: !isDisplayed
            ? "gray"
            : passed
            ? successGreen.c600
            : errorRed.c500,
          width: 35,
          height: 35,
          mb: 1,
          opacity: !isDisplayed ? 0.6 : 1,
        }}
      >
        {passed ? (
          <CheckMarkIcon width={13} height={13} />
        ) : (
          <CloseIcon width={11} height={11} />
        )}
      </Avatar>
      <Typography
        variant="caption"
        color={!isDisplayed ? "text.disabled" : "textGray"}
      >
        {title}
      </Typography>
    </Box>
  );
};
