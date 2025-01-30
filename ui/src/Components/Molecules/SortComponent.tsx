import { Box, Checkbox, Divider, FormLabel, Typography } from "@mui/material";
import { theme } from "../../theme";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import UpDownArrowsIcon from "../../Assets/Icons/UpdownArrows";
import { useOnClickOutside } from "../../hooks/useOutsideClick";

interface SortComponentProps {
  selectedSorting: string;
  setSelectedSorting: Dispatch<SetStateAction<string>>;
  sortOptions: {
    value: string;
    label: string;
  }[];
  sortOpen: boolean;
  setSortOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SortComponent({
  selectedSorting,
  setSelectedSorting,
  sortOptions,
  sortOpen,
  setSortOpen,
}: SortComponentProps) {
  const {
    palette: { primaryBlue, boxShadow2, neutralWhite },
  } = theme;
  const handleShowSortOptions = () => {
    setSortOpen(!sortOpen);
  };
  const [isHovered, setIsHovered] = useState(false);

  const closeSortOptions = () => {
    setSortOpen(false);
  };
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, closeSortOptions);

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: sortOpen ? "secondary.main" : "neutralWhite",
        border: 1,
        borderColor: sortOpen ? "secondary.main" : "secondaryBlue",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        height: 48,
        padding: "0 16px",
        cursor: "pointer",
        ":hover": {
          backgroundColor: "secondary.main",
          borderColor: "secondary.main",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        onClick={handleShowSortOptions}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <UpDownArrowsIcon
            color={isHovered || sortOpen ? neutralWhite : primaryBlue}
          />
        </Box>
        <Typography
          sx={{
            color: isHovered || sortOpen ? "neutralWhite" : "primaryBlue",
            fontWeight: 500,
            paddingLeft: 0.5,
          }}
        >
          Sort
        </Typography>
      </Box>
      {sortOpen && (
        <Box
          sx={{
            backgroundColor: "neutralWhite",
            borderRadius: 5,
            width: 250,
            boxShadow: `${boxShadow2} 0px 8px 24px`,
            position: "absolute",
            top: 50,
            right: 10,
            padding: 2,
            zIndex: 10,
          }}
          ref={wrapperRef}
        >
          <Box display="flex" justifyContent="space-between" marginBottom={1}>
            <Typography
              sx={{ color: "neutralGray", fontWeight: 500, fontSize: "14px" }}
            >
              Sort by
            </Typography>
            <Typography
              sx={{
                color: "primaryBlue",
                fontWeight: 500,
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => setSelectedSorting("")}
            >
              Clear
            </Typography>
          </Box>
          <Divider sx={{ marginBottom: 2, backgroundColor: "neutralGray" }} />
          {sortOptions.map((option, index) => (
            <Box
              sx={{
                width: "100%",
                marginBottom: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                checked={selectedSorting === option.value}
                onChange={() => setSelectedSorting(option.value)}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
