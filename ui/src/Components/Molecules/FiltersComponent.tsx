import { Box } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { useScreenDimension } from "../../hooks/useDimensions";
import { useOnClickOutside } from "../../hooks/useOnclickOutside";

interface FilterComponentProps {
  selectedFilters: string[];
  setSelectedFilters: Dispatch<SetStateAction<string[]>>;
  closeFilters: () => void;
  options: {
    key: string;
    label: string;
  }[];
  title?: string;
}
export default function FiltersComponent({
  selectedFilters,
  setSelectedFilters,
  closeFilters,
  options,
  title,
}: FilterComponentProps) {
  

  const { isMobile } = useScreenDimension();

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="absolute"
      sx={{
        background: "#FBFBFF",
        boxShadow: "1px 2px 11px 0px #00123D5E",
        borderRadius: "10px",
        padding: "12px 0px",
        width: {
          xxs: "250px",
          md: "415px",
        },
        zIndex: "1",
        right: isMobile ? "59px" : "115px",
        top: "53px",
      }}
    ></Box>
  );
}
