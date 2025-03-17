import { Box, Grid, Skeleton, styled } from "@mui/material";
import { Typography } from "../Atoms/Typography";

type VoteSectionLoaderProps = {
  title?: string;
  isCC?: boolean;
};

const ProgressContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: 32,
  borderRadius: 20,
  overflow: "hidden",
});

export const VoteSectionLoader = ({
  title = "Loading...",
  isCC = false,
}: VoteSectionLoaderProps) => {
  return (
    <Box mb={3}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography
          color="textGray"
          sx={{
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {title}
        </Typography>
        <Skeleton variant="text" width={80} height={24} />
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Skeleton variant="text" width={140} height={20} />
            <Skeleton variant="text" width={30} height={20} />
            <Skeleton variant="text" width={140} height={20} />
          </Box>

          <ProgressContainer>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={32}
              sx={{ borderRadius: 20 }}
            />
          </ProgressContainer>
        </Grid>
        <Grid item xs={12}>
          <Box
            mb={0.5}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Skeleton variant="text" width={140} height={20} />
            <Skeleton variant="text" width={140} height={20} />
          </Box>

          {!isCC && <Skeleton variant="text" width={140} height={20} />}
        </Grid>
      </Grid>
    </Box>
  );
};
