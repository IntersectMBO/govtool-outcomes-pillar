import {
  CircularProgress,
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from "@mui/material";
type ButtonProps = Omit<MUIButtonProps, "size"> & {
  isLoading?: boolean;
  size?: "small" | "medium" | "large" | "extraLarge";
  dataTestId?: string;
};
export const Button = ({
  size = "large",
  variant = "contained",
  dataTestId,
  sx,
  isLoading,
  ...props
}: ButtonProps) => {
  const height = {
    extraLarge: 48,
    large: 40,
    medium: 36,
    small: 32,
  }[size];

  const px = {
    extraLarge: 3.5,
    large: 3.25,
    medium: 3,
    small: 3,
  }[size];

  return (
    <MUIButton
      data-testid={dataTestId}
      sx={{
        fontSize: size === "extraLarge" ? 16 : 14,
        height,
        px,
        whiteSpace: "nowrap",
        ...sx,
      }}
      variant={variant}
      {...props}
      disabled={isLoading || props?.disabled}
    >
      {isLoading && (
        <CircularProgress size={26} sx={{ position: "absolute" }} />
      )}
      {props.children}
    </MUIButton>
  );
};
