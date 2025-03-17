import { Box } from "@mui/material";
import { useScreenDimension } from "../../hooks/useDimensions";
import { Typography } from "../Atoms/Typography";
import CopyButton from "../Atoms/CopyButton";
import { correctVoteAdaFormat } from "../../lib/utils";

type Props = {
  receivingAddress: string;
  amount: number;
};

export const GovernanceActionCardTreasuryWithdrawalElement = ({
  receivingAddress,
  amount,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography
          data-testid="receiving-address-label"
          sx={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "20px",
            color: "textGray",
          }}
        >
          Receiving Address:
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography
            data-testid="receiving-address"
            sx={{
              color: "primaryBlue",
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "20px",
              wordBreak: "break-word",
              overflow: "hidden",
            }}
          >
            {receivingAddress}
          </Typography>
          <Box ml={1}>
            <CopyButton text={receivingAddress} />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "20px",
            color: "textGray",
          }}
          data-testid="amount-label"
        >
          Amount:
        </Typography>
        <Typography
          data-testid="amount"
          sx={{
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "20px",
          }}
        >
          ₳{correctVoteAdaFormat(amount) ?? 0}
        </Typography>
      </Box>
    </Box>
  );
};
