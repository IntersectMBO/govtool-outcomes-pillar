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
  setSortOpen: Dispatch<SetStateAction<boolean>>;
  closeFilters: () => void;
  filtersOpen: boolean;
  setFiltersOpen: Dispatch<SetStateAction<boolean>>;
  closeSorts: () => void;
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
    setSortOpen,
    closeFilters,
    filtersOpen,
    setFiltersOpen,
    closeSorts,
  } = props;

  const {
    palette: { neutralGray },
  } = theme;

  const {isMobile} = useScreenDimension();

  return (
    <Box display="flex" justifyContent="space-between" marginBottom={4} gap={isMobile ? 1 : 2}>
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
        setFiltersOpen={setFiltersOpen}
        closeSorts={closeSorts}
      />
      <SortComponent
        selectedSorting={selectedSorting}
        setSelectedSorting={setSelectedSorting}
        sortOptions={sortOptions}
        closeFilters={closeFilters}
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
      />
    </Box>
  );
}
