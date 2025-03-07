import {
  Box,
  Divider,
  Typography,
  Button,
  Menu,
  Fade,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { theme } from "../../theme";
import { useEffect, useState } from "react";
import UpDownArrowsIcon from "../../Assets/Icons/UpdownArrows";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { GOVERNANCE_ACTION_SORT_OPTIONS } from "../../consts/sort-options";

export default function SortComponent() {
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortParams, setSortParams] = useSearchParams();

  useEffect(() => {
    const currentSort = sortParams.get("sort");
    if (!currentSort) {
      const newParams = new URLSearchParams(sortParams);
      newParams.set("sort", "newestFirst");
      setSortParams(newParams);
    }
  }, []);

  const handleShowOptions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const setSorts = (option: string) => {
    const newParams = new URLSearchParams(sortParams);
    if (option) {
      newParams.set("sort", option);
    } else {
      newParams.delete("sort");
    }
    setSortParams(newParams);
  };

  const sortValue = () => {
    return sortParams.get("sort")?.toString() || "";
  };

  const getDisplayLabel = (value: string) => {
    const option = GOVERNANCE_ACTION_SORT_OPTIONS.find(
      (opt) => opt.value === value
    );
    return option?.displayLabel || value;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button
        id="sort-button"
        data-testid="sort-button"
        aria-controls={open ? "sort-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          backgroundColor: open ? "secondary.main" : "neutralWhite",
          border: 1,
          borderColor: open ? "secondary.main" : "secondaryBlue",
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
        <Typography
          sx={{
            color: isHovered || open ? "neutralWhite" : "primaryBlue",
            fontWeight: 500,
            paddingX: 0.5,
            whiteSpace: "nowrap",
          }}
        >
          Sort{sortValue() ? `: ${getDisplayLabel(sortValue())}` : ""}
        </Typography>
      </Button>
      <Menu
        id="sort-menu"
        data-testid="sort-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        sx={{ marginTop: 1 }}
      >
        <FormControl>
          <Box
            display="flex"
            justifyContent="space-between"
            px="20px"
            alignItems="center"
          >
            <Typography
              sx={{ fontSize: 14, fontWeight: 500, color: "#9792B5" }}
            >
              Sort Governance Actions
            </Typography>
          </Box>
          <Divider sx={{ marginTop: 1, backgroundColor: "neutralGray" }} />
          <RadioGroup
            id="sort-radio-buttons-group"
            data-testid="sort-radio-buttons-group"
            aria-labelledby="sort-radio-buttons-group"
            name="sort-radio-buttons-group"
            value={sortValue()}
          >
            {GOVERNANCE_ACTION_SORT_OPTIONS.map((option, index) => (
              <Box
                id={`${option.dataTestId}-radio-wrapper`}
                data-testid={`${option.dataTestId}-radio-wrapper`}
                key={index}
                paddingX="20px"
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#E6EBF7" },
                }}
                bgcolor={
                  sortValue() === option.value ? "#FFF0E7" : "transparent"
                }
                onClick={() => setSorts(option.value)}
              >
                <FormControlLabel
                  value={option.value}
                  control={
                    <Radio
                      id={`${option.dataTestId}-radio`}
                      data-testid={`${option.value.toLocaleLowerCase()}-radio`}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSorts(option.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  }
                  label={option.label}
                  onClick={(e) => e.stopPropagation()}
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      </Menu>
    </Box>
  );
}
