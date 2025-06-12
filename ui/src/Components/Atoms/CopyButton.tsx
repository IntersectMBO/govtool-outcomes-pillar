import { IconButton } from "@mui/material";
import CopyIcon from "../../Assets/Icons/CopyIcon";
import { useSnackbar } from "../../contexts/Snackbar";
import { Tooltip } from "./Tooltip";
import { useTranslation } from "../../contexts/I18nContext";

type CopyButtonProps = {
  text: string;
  width?: number;
  height?: number;
  color?: string;
};

function CopyButton({
  text,
  width = 20,
  height = 20,
  color = "#0033AD",
}: CopyButtonProps) {
  const { addSuccessAlert } = useSnackbar();
  const { t } = useTranslation();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    addSuccessAlert(t("copiedToClipboard"));
  };

  return (
    <Tooltip paragraphOne={t("copyToClipboard")}>
      <IconButton
        data-testid="copy-button"
        onClick={handleCopyClick}
        size="small"
      >
        <CopyIcon width={width} height={height} color={color} />
      </IconButton>
    </Tooltip>
  );
}

export default CopyButton;
