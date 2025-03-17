import { IconButton, Tooltip } from "@mui/material";
import CopyIcon from "../../Assets/Icons/CopyIcon";
import { useSnackbar } from "../../contexts/Snackbar";

function CopyButton({ text }: { text: string }) {
  const { addSuccessAlert } = useSnackbar();
  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    addSuccessAlert("Copied to clipboard!");
  };

  return (
    <Tooltip title="Copy to clipboard">
      <IconButton
        data-testid="copy-button"
        onClick={handleCopyClick}
        size="small"
      >
        <CopyIcon width={16} height={16} />
      </IconButton>
    </Tooltip>
  );
}

export default CopyButton;
