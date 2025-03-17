import { Avatar, Box } from "@mui/material";
import { Typography } from "../Atoms/Typography";
import CloseIcon from "../../Assets/Icons/CloseIcon";
import CheckMarkIcon from "../../Assets/Icons/CheckMarkIcon";
import { errorRed, successGreen } from "../../consts/colors";

type OutcomeIndicatorProps = {
  title: string;
  passed: boolean;
  isDisplayed: boolean;
  isLoading?: boolean;
  dataTestId?: string;
};

export const OutcomeIndicator = ({
  title,
  passed,
  isDisplayed,
  isLoading = true,
  dataTestId,
}: OutcomeIndicatorProps) => {
  return (
    <Box
      data-testid={dataTestId}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Avatar
        data-testid="outcome-icon"
        sx={{
          bgcolor: isLoading
            ? "gray"
            : !isDisplayed
            ? "gray"
            : passed
            ? successGreen.c600
            : errorRed.c500,
          width: 35,
          height: 35,
          mb: 1,
          opacity: !isDisplayed ? 0.6 : 1,
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        {passed ? (
          <CheckMarkIcon width={13} height={13} />
        ) : (
          <CloseIcon width={11} height={11} />
        )}
      </Avatar>
      <Typography
        data-testid="voter-type-label"
        variant="caption"
        color={!isDisplayed ? "text.disabled" : "textGray"}
      >
        {title}
      </Typography>
    </Box>
  );
};
