import { Box, Icon, Skeleton, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Tooltip } from "../Atoms/Tooltip";
import {
  IconCheckCircle,
  IconInformationCircle,
  IconXCircle,
} from "@intersect.mbo/intersectmbo.org-icons-set";
import { successGreen } from "../../consts/colors";
import { SignatureVerificationResult } from "../../types/api";
import { verifyAuthorWitnessSet } from "../../services/requests/verifyAuthorWitnessSet";
import { useTranslation } from "../../contexts/I18nContext";

type GovernanceActionAuthorProps = {
  author: any;
  metadataUrl?: string;
};

function GovernanceActionAuthor({
  author,
  metadataUrl,
}: GovernanceActionAuthorProps) {
  const [verificationResult, setVerificationResult] =
    useState<SignatureVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const getValue = (field: any) => {
    if (typeof field === "string") return field;
    if (field && typeof field === "object" && field["@value"])
      return field["@value"];
    return "";
  };

  const authorData = {
    name: getValue(author?.name),
    witnessAlgorithm: getValue(author?.witness?.witnessAlgorithm),
    publicKey: getValue(author?.witness?.publicKey),
    signature: getValue(author?.witness?.signature),
  };

  useEffect(() => {
    const verifySignature = async () => {
      if (
        !metadataUrl ||
        !authorData.name ||
        !authorData.witnessAlgorithm ||
        !authorData.publicKey ||
        !authorData.signature
      ) {
        return;
      }

      setIsLoading(true);
      try {
        const verificationData = {
          author: {
            name: authorData.name,
            witness: {
              witnessAlgorithm: authorData.witnessAlgorithm,
              publicKey: authorData.publicKey,
              signature: authorData.signature,
            },
          },
          metadataUrl,
        };

        const result = await verifyAuthorWitnessSet(verificationData);
        setVerificationResult(result);
      } catch (error) {
        console.error("Error verifying signature:", error);
        setVerificationResult({
          isValid: false,
          author: authorData.name,
          error: "Failed to verify signature",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifySignature();
  }, [author, metadataUrl]);

  const renderVerificationIcon = () => {
    if (isLoading) {
      return <Skeleton variant="circular" width={20} height={20} />;
    }

    if (verificationResult?.isValid) {
      return (
        <Tooltip heading={t("outcome.authors.witnessVerified")}>
          <Icon>
            <IconCheckCircle fill={successGreen.c400} width={20} height={20} />
          </Icon>
        </Tooltip>
      );
    }

    if (verificationResult && !verificationResult.isValid) {
      return (
        <Tooltip
          paragraphOne={t("outcome.authors.verificationFailed")}
          paragraphTwo={
            verificationResult.message ||
            verificationResult.error ||
            "Invalid signature"
          }
        >
          <Icon>
            <IconXCircle fill="#ef4444" width={19} height={19} />
          </Icon>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      {renderVerificationIcon()}
      <Typography
        sx={{
          color: "textBlack",
          fontWeight: 400,
          fontSize: 16,
        }}
      >
        {authorData.name}
      </Typography>
      <Tooltip
        heading={`${t("outcome.authors.witnessAlgorithm")}: ${
          authorData.witnessAlgorithm
        }`}
        paragraphOne={`${t("outcome.authors.publicKey")}: ${
          authorData.publicKey
        }`}
        paragraphTwo={`${t("outcome.authors.signature")}: ${
          authorData.signature
        }`}
      >
        <Icon>
          <IconInformationCircle width={19} height={19} />
        </Icon>
      </Tooltip>
    </Box>
  );
}

export default GovernanceActionAuthor;
