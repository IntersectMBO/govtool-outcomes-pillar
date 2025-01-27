import { Box, InputBase } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { IconSearch } from "@intersect.mbo/intersectmbo.org-icons-set";
import { theme } from "../../theme";
import FiltersComponent from "./FiltersComponent";

interface SearchFiltersSortBarProps {
  searchText: string;
  selectedFilters: string[];
  setSearchText: Dispatch<SetStateAction<string>>;
  setSelectedFilters: Dispatch<SetStateAction<string[]>>;
  closeFilters: () => void;
  options: {
    key: string;
    label: string;
  }[];
  title?: string;
}

export default function SearchFiltersSortBar({
  ...props
}: SearchFiltersSortBarProps) {
  const {
    searchText,
    setSearchText,
    selectedFilters,
    setSelectedFilters,
    closeFilters,
    options,
    title,
  } = props;
  const {
    palette: { neutralGray },
  } = theme;

  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      marginBottom={2}
    >
      <Box>
        <InputBase
          inputProps={{ "data-testid": "search-input" }}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search Action..."
          value={searchText}
          startAdornment={
            <IconSearch width={18} height={18} fill={neutralGray} />
          }
          sx={{
            bgcolor: "neutralWhite",
            border: 1,
            borderColor: "secondaryBlue",
            borderRadius: 50,
            fontSize: 14,
            fontWeight: 500,
            height: 48,
            padding: "16px 24px",
            maxWidth: "100%",
          }}
        />
      </Box>
      <Box>
        <FiltersComponent
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          closeFilters={closeFilters}
          options={options}
          title={title}
        />
      </Box>
    </Box>
  );
}
