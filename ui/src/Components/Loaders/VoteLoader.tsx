import { Skeleton, Box } from "@mui/material";

export const VoteLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        width: "auto",
        gap: "16px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Box>
        <Skeleton
          variant="text"
          width="120px"
          height={20}
          sx={{ marginBottom: "4px" }}
        />
        <Skeleton variant="text" width="280px" height={16} />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
        }}
      >
        <Box sx={{ minWidth: "80px", textAlign: "right" }}>
          <Skeleton variant="text" width={50} height={20} />
        </Box>

        <Box sx={{ minWidth: "80px", textAlign: "center" }}>
          <Skeleton
            variant="rounded"
            width={60}
            height={24}
            sx={{ borderRadius: "12px", margin: "0 auto" }}
          />
        </Box>

        <Box sx={{ minWidth: "60px", textAlign: "center" }}>
          <Skeleton variant="text" width={40} height={20} />
        </Box>

        <Box sx={{ minWidth: "60px", textAlign: "center" }}>
          <Skeleton variant="text" width={40} height={20} />
        </Box>
      </Box>

      <Box sx={{ minWidth: "140px", textAlign: "right" }}>
        <Skeleton
          variant="text"
          width={120}
          height={16}
          sx={{ marginBottom: "2px" }}
        />
        <Skeleton variant="text" width={175} height={16} />
      </Box>
    </Box>
  );
};
