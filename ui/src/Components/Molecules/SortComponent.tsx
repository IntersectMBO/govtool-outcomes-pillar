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
import { useEffect, useState } from "react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "../../contexts/I18nContext";
import { theme } from "../../theme";
import {
  IconCheveronDown,
  IconCheveronUp,
} from "@intersect.mbo/intersectmbo.org-icons-set";

interface FilterOption {
  value: string;
  label: string;
  displayLabel?: string;
  dataTestId: string;
}

interface RadioComponentProps {
  queryParam: string;
  options: FilterOption[];
  defaultValue?: string;
  titleTranslationKey: string;
  fullTitleTranslationKey: string;
  testIdPrefix?: string;
}

export default function RadioComponent({
  queryParam,
  options,
  defaultValue,
  titleTranslationKey,
  fullTitleTranslationKey,
  testIdPrefix = "filter",
}: RadioComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const {
    palette: {
      badgeColors: { grey },
    },
  } = theme;

  useEffect(() => {
    const currentValue = searchParams.get(queryParam);
    if (!currentValue && defaultValue) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(queryParam, defaultValue);
      setSearchParams(newParams);
    }
  }, [queryParam, defaultValue, searchParams, setSearchParams]);

  const handleShowOptions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const setFilterValue = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(queryParam, value);
    } else {
      newParams.delete(queryParam);
    }
    setSearchParams(newParams);
  };

  const getCurrentValue = () => {
    return searchParams.get(queryParam)?.toString() || "";
  };

  const getDisplayLabel = (value: string) => {
    const option = options.find((opt) => opt.value === value);
    return option?.displayLabel || option?.label || value;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const currentValue = getCurrentValue();

  return (
    <Box>
      <Button
        id={`${testIdPrefix}-button`}
        data-testid={`${testIdPrefix}-button`}
        aria-controls={open ? `${testIdPrefix}-menu` : undefined}
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
            {t(titleTranslationKey)}
            {currentValue ? `: ${getDisplayLabel(currentValue)}` : ""}
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
        id={`${testIdPrefix}-menu`}
        data-testid={`${testIdPrefix}-menu`}
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
              {t(fullTitleTranslationKey)}
            </Typography>
          </Box>
          <Divider sx={{ marginTop: 1, backgroundColor: "neutralGray" }} />
          <RadioGroup
            id={`${testIdPrefix}-radio-buttons-group`}
            data-testid={`${testIdPrefix}-radio-buttons-group`}
            aria-labelledby={`${testIdPrefix}-radio-buttons-group`}
            name={`${testIdPrefix}-radio-buttons-group`}
            value={currentValue}
          >
            {options.map((option, index) => (
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
                  currentValue === option.value ? "#FFF0E7" : "transparent"
                }
                onClick={() => setFilterValue(option.value)}
              >
                <FormControlLabel
                  value={option.value}
                  control={
                    <Radio
                      id={`${option.dataTestId}-radio`}
                      data-testid={`${option.value.toLowerCase()}-radio`}
                      onChange={(e) => {
                        e.stopPropagation();
                        setFilterValue(option.value);
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
