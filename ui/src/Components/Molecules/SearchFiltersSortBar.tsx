import { Box, InputBase } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { IconSearch } from "@intersect.mbo/intersectmbo.org-icons-set";
import { theme } from "../../theme";
import FiltersComponent from "./FiltersComponent";
import SortComponent from "./SortComponent";
import { useScreenDimension } from "../../hooks/useDimensions";

interface SearchFiltersSortBarProps {
  searchText: string;
  selectedFilters: string[];
  setSearchText: Dispatch<SetStateAction<string>>;
  setSelectedFilters: Dispatch<SetStateAction<string[]>>;
  filterOptions: {
    value: string;
    label: string;
  }[];
  statusOptions: {
    value: string;
    label: string;
  }[];
  sortOptions: {
    value: string;
    label: string;
  }[];
  selectedSorting: string;
  setSelectedSorting: Dispatch<SetStateAction<string>>;
  sortOpen: boolean;
  filtersOpen: boolean;
  anchorElFilters: null | HTMLElement;
  setAnchorElFilters: Dispatch<SetStateAction<null | HTMLElement>>;
  anchorElSort: null | HTMLElement;
  setAnchorElSort: Dispatch<SetStateAction<null | HTMLElement>>;
}

export default function SearchFiltersSortBar({
  ...props
}: SearchFiltersSortBarProps) {
  const {
    searchText,
    setSearchText,
    selectedFilters,
    setSelectedFilters,
    filterOptions,
    statusOptions,
    sortOptions,
    selectedSorting,
    setSelectedSorting,
    sortOpen,
    filtersOpen,
    anchorElFilters,
    setAnchorElFilters,
    anchorElSort,
    setAnchorElSort
  } = props;

  const {
    palette: { neutralGray },
  } = theme;

  const {isMobile} = useScreenDimension();

  return (
    <Box display="flex" justifyContent="space-between" marginBottom={4} gap={isMobile ? 1 : 1.5}>
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
        }}
      />
      <FiltersComponent
        options={filterOptions}
        statusOptions={statusOptions}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        filtersOpen={filtersOpen}
        anchorEl={anchorElFilters}
        setAnchorEl={setAnchorElFilters}
      />
      <SortComponent
        selectedSorting={selectedSorting}
        setSelectedSorting={setSelectedSorting}
        sortOptions={sortOptions}
        sortOpen={sortOpen}
        anchorEl={anchorElSort}
        setAnchorEl={setAnchorElSort}
      />
    </Box>
  );
}
