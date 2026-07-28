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
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";
import { useSearchParams } from "react-router";
import { GOVERNANCE_ACTION_SORT_OPTIONS } from "../../consts/sort-options";
import { useTranslation } from "../../contexts/I18nContext";
import { theme } from "../../theme";
import {
  IconCheveronDown,
  IconCheveronUp,
} from "@intersect.mbo/intersectmbo.org-icons-set";

export default function SortComponent() {
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortParams, setSortParams] = useSearchParams();
  const { t } = useTranslation();

  const {
    palette: {
      badgeColors: { grey },
    },
  } = theme;

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
          backgroundColor: "white",
          border: 1,
          borderColor: "borderGrey",
          borderRadius: 1,
          fontSize: 14,
          fontWeight: 400,
          height: 48,
          paddingRight: "4px",
          paddingLeft: "12px",
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleShowOptions}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Typography
            sx={{
              color: isHovered || open ? "textBlack" : grey,
              fontWeight: 400,
              paddingX: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            {t("outcomesList.sort.title")}
            {sortValue() ? `: ${getDisplayLabel(sortValue())}` : ""}
          </Typography>
          <Box
            sx={{
              padding: "2px",
              borderRadius: "50%",
              color: "action.active",
              transition:
                "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              "&:hover": {
                backgroundColor: "action.hover",
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "28px",
              height: "28px",
            }}
          >
            {open ? (
              <IconCheveronUp width={18} height={18} fill="textBlack" />
            ) : (
              <IconCheveronDown width={18} height={18} fill="textBlack" />
            )}
          </Box>
        </Box>
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
              {t("outcomesList.sort.fullTitle")}
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
