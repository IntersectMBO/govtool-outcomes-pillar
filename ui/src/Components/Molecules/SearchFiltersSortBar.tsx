import { Box, InputBase } from "@mui/material";
import { useEffect, useState } from "react";
import { IconSearch } from "@intersect.mbo/intersectmbo.org-icons-set";
import { theme } from "../../theme";
import FiltersComponent from "./FiltersComponent";
import SortComponent from "./SortComponent";
import { useScreenDimension } from "../../hooks/useDimensions";
import { useSearchParams } from "react-router-dom";

export default function SearchFiltersSortBar() {
  const {
    palette: { neutralGray },
  } = theme;

  const { isMobile } = useScreenDimension();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        newParams.set("q", searchTerm);
      } else {
        newParams.delete("q");
      }
      setSearchParams(newParams);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams, searchParams]);

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      alignItems={isMobile ? "stretch" : "center"}
      justifyContent="space-between"
      gap={isMobile ? 1 : 1.5}
    >
      <InputBase
        id="search-input"
        inputProps={{ "data-testid": "search-input" }}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Action..."
        value={searchTerm}
        startAdornment={
          <IconSearch width={18} height={18} fill={neutralGray} />
        }
        sx={{
          bgcolor: "neutralWhite",
          border: 1,
          borderColor: "secondaryBlue",
          borderRadius: 50,
          fontSize: 11,
          fontWeight: 500,
          height: 48,
          padding: "16px 24px",
          "& .MuiInputBase-input": {
            paddingLeft: "4px",
          },
        }}
      />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        gap={isMobile ? 1 : 1.5}
      >
        <FiltersComponent />
        <SortComponent />
      </Box>
    </Box>
  );
}
