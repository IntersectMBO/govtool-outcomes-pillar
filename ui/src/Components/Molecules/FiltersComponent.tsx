import { Box, Checkbox, Divider, FormLabel, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { IconFilter } from "@intersect.mbo/intersectmbo.org-icons-set";
import { theme } from "../../theme";

interface FilterComponentProps {
  selectedFilters: string[];
  setSelectedFilters: Dispatch<SetStateAction<string[]>>;
  options: {
    value: string;
    label: string;
  }[];
  statusOptions: {
    value: string;
    label: string;
  }[];
  filtersOpen: boolean;
  setFiltersOpen: Dispatch<SetStateAction<boolean>>;
  closeSorts: () => void;
}
export default function FiltersComponent({
  selectedFilters,
  setSelectedFilters,
  options,
  statusOptions,
  filtersOpen,
  setFiltersOpen,
  closeSorts,
}: FilterComponentProps) {
  const {
    palette: { primaryBlue, boxShadow2 },
  } = theme;

  const handleShowFilters = () => {
    closeSorts();
    setFiltersOpen(!filtersOpen);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilters((prevSelectedFilters) => {
      const updatedFilters = prevSelectedFilters.includes(value)
        ? prevSelectedFilters.filter((filter) => filter !== value) 
        : [...prevSelectedFilters, value]; 

      return updatedFilters;
    });
  };

  return (
    <Box
      position="relative"
      sx={{
        backgroundColor: "neutralWhite",
        border: 1,
        borderColor: "secondaryBlue",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        height: 48,
        padding: "0 16px 0 16px",
        cursor: "pointer",
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        onClick={handleShowFilters}
      >
        <IconFilter width={18} height={18} fill={primaryBlue} />
        <Typography
          sx={{ color: "primaryBlue", fontWeight: 500, paddingLeft: 1 }}
        >
          Filters
        </Typography>
      </Box>
      {filtersOpen && (
        <Box
          sx={{
            backgroundColor: "neutralWhite",
            borderRadius: 5,
            width: 250,
            boxShadow: `${boxShadow2} 0px 8px 24px`,
            position: "absolute",
            top: 50,
            padding: 2,
            right: 10,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography
              sx={{
                color: "neutralGray",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Governance Action Type
            </Typography>
            <Typography
              sx={{
                color: "primaryBlue",
                fontWeight: 500,
                fontSize: "14px",
              }}
              onClick={() => setSelectedFilters([])}
            >
              clear
            </Typography>
          </Box>
          <Divider
            sx={{
              marginBottom: 1,
              marginTop: 1,
              backgroundColor: "neutralGray",
            }}
          />
          {options.map((option, index) => (
            <Box
              sx={{
                width: "100%",
                marginBottom: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
              key={index}
            >
              <FormLabel sx={{ fontSize: "14px" }}>{option.label}</FormLabel>
              <Checkbox
                sx={{
                  padding: 0,
                  "& .MuiSvgIcon-root": {
                    fontSize: 18,
                  },
                }}
                name={option.value}
                checked={selectedFilters?.includes(option.value)}
                onChange={() => handleFilterChange(option.value)}
              />
            </Box>
          ))}
          <Divider
            sx={{
              marginBottom: 1,
              marginTop: 1,
              backgroundColor: "neutralGray",
            }}
          />
          <Typography
            sx={{
              color: "neutralGray",
              fontWeight: 500,
              fontSize: "14px",
              marginBottom: 1,
            }}
          >
            status
          </Typography>

          {statusOptions.map((option, index) => (
            <Box
              sx={{
                width: "100%",
                marginBottom: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
              key={index}
            >
              <FormLabel sx={{ fontSize: "14px" }}>{option.label}</FormLabel>
              <Checkbox
                sx={{
                  padding: 0,
                  "& .MuiSvgIcon-root": {
                    fontSize: 18,
                  },
                }}
                name={option.value}
                checked={selectedFilters?.includes(option.value)}
                onChange={() => handleFilterChange(option.value)}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
