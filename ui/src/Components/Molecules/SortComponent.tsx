import {
  Box,
  Checkbox,
  Divider,
  FormLabel,
  Typography,
  Button,
  Menu,
  MenuItem,
  Fade,
} from "@mui/material";
import { theme } from "../../theme";
import { Dispatch, SetStateAction, useState } from "react";
import UpDownArrowsIcon from "../../Assets/Icons/UpdownArrows";
import React from "react";

interface SortComponentProps {
  selectedSorting: string;
  setSelectedSorting: Dispatch<SetStateAction<string>>;
  sortOptions: {
    value: string;
    label: string;
  }[];
  anchorEl: null | HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>;
  sortOpen: boolean;
}

export default function SortComponent({
  selectedSorting,
  setSelectedSorting,
  sortOptions,
  sortOpen,
  anchorEl,
  setAnchorEl,
}: SortComponentProps) {
  const {
    palette: { primaryBlue, neutralWhite },
  } = theme;

  const [isHovered, setIsHovered] = useState(false);
  const handleShowOptions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        id="fade-button"
        aria-controls={sortOpen ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={sortOpen ? "true" : undefined}
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
        onClick={handleShowOptions}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
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
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={sortOpen}
        onClose={handleClose}
        TransitionComponent={Fade}
        sx={{marginTop: 1}}
      >
        <MenuItem>
          <Box display="flex" justifyContent="space-between" marginBottom={1} width="100%">
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
        </MenuItem>
        {sortOptions.map((option, index) => (
          <MenuItem>
            <Box
              sx={{
                width: "100%",
                marginBottom: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
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
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
