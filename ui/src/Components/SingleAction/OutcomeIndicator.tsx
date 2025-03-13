import { Avatar, Box } from "@mui/material";
import { Typography } from "../Atoms/Typography";
import CloseIcon from "../../Assets/Icons/CloseIcon";
import CheckMarkIcon from "../../Assets/Icons/CheckMarkIcon";
import { errorRed, successGreen } from "../../consts/colors";

export const OutcomeIndicator = ({
  title,
  passed,
}: {
  title: string;
  passed: boolean;
}) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Avatar
        sx={{
          bgcolor: passed ? successGreen.c500 : errorRed.c500,
          width: 35,
          height: 35,
          mb: 1,
        }}
      >
        {passed ? (
          <CheckMarkIcon width={13} height={13} />
        ) : (
          <CloseIcon width={11} height={11} />
        )}
      </Avatar>
      <Typography variant="caption" color="textGray">
        {title}
      </Typography>
    </Box>
  );
};
