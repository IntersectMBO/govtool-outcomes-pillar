import { Box, Checkbox, Divider, FormLabel, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { IconFilter } from "@intersect.mbo/intersectmbo.org-icons-set";
import { theme } from "../../theme";
import { useOnClickOutside } from "../../hooks/useOutsideClick";

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
}
export default function FiltersComponent({
  selectedFilters,
  setSelectedFilters,
  options,
  statusOptions,
  filtersOpen,
  setFiltersOpen,
}: FilterComponentProps) {
  const {
    palette: { primaryBlue, boxShadow2, neutralWhite },
  } = theme;
  const [isHovered, setIsHovered] = useState(false);
  const handleShowFilters = () => {
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

  const closeFilters = () => {
    setFiltersOpen(false);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, closeFilters);

  return (
    <Box
      position="relative"
      sx={{
        backgroundColor: filtersOpen ? "secondary.main" : "neutralWhite",
        border: 1,
        borderColor: filtersOpen ? "secondary.main" : "secondaryBlue",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        height: 48,
        padding: "0 16px 0 16px",
        cursor: "pointer",
        ":hover": {
          backgroundColor: "secondary.main",
          borderColor: "secondary.main"
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        onClick={handleShowFilters}
      >
        <IconFilter
          width={18}
          height={18}
          fill={isHovered || filtersOpen ? neutralWhite : primaryBlue}
        />
        <Typography
          sx={{
            color: isHovered || filtersOpen ? "neutralWhite" : "primaryBlue",
            fontWeight: 500,
            paddingLeft: 0.5,
          }}
        >
          Filter
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
          ref={wrapperRef}
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
