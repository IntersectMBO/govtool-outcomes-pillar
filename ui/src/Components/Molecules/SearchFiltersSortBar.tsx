import { Box, IconButton, InputBase } from "@mui/material";
import { useEffect, useState } from "react";
import { IconSearch, IconX } from "@intersect.mbo/intersectmbo.org-icons-set";
import { theme } from "../../theme";
import FiltersComponent from "./FiltersComponent";
import RadioComponent from "./RadioComponent";
import { useScreenDimension } from "../../hooks/useDimensions";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "../../contexts/I18nContext";
import { orange, primaryBlue } from "../../consts/colors";
import { GOVERNANCE_ACTION_FILTERS } from "../../consts/filters";
import { GOVERNANCE_ACTION_STATUS_FILTERS } from "../../consts/status-filters";
import { GOVERNANCE_ACTION_SORT_OPTIONS } from "../../consts/sort-options";
import { localStorageKeys } from "../../consts/localStorage";
import ChipWithDelete from "../Atoms/ChipWithDelete";

export default function SearchFiltersSortBar() {
  const {
    palette: { textBlack },
  } = theme;
  const { isMobile } = useScreenDimension();
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const typeFilters = searchParams.get("type")?.split(",") || [];
  const statusFilters = searchParams.get("status")?.split(",") || [];
  const currentSort = searchParams.get("sort") || "";

  useEffect(() => {
    let paramsToSet = new URLSearchParams(searchParams);
    if (!currentSort) {
      const savedSort = localStorage.getItem(localStorageKeys.SORT_STORAGE_KEY);
      if (savedSort) {
        paramsToSet.set("sort", savedSort);
      } else {
        paramsToSet.set("sort", GOVERNANCE_ACTION_SORT_OPTIONS[0].value); //newestFirst
      }
    }

    if (typeFilters.length === 0 && statusFilters.length === 0) {
      const savedFilters = localStorage.getItem(
        localStorageKeys.FILTERS_STORAGE_KEY
      );
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters);
          if (parsedFilters.type && parsedFilters.type.length > 0) {
            paramsToSet.set("type", parsedFilters.type.join(","));
          }

          if (parsedFilters.status && parsedFilters.status.length > 0) {
            paramsToSet.set("status", parsedFilters.status.join(","));
          }
        } catch (e) {
          console.error("Error parsing filters from localStorage", e);
          localStorage.removeItem(localStorageKeys.FILTERS_STORAGE_KEY);
        }
      }
    }
    setSearchParams(paramsToSet);
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (isInitializing) {
      return;
    }
    if (typeFilters.length > 0 || statusFilters.length > 0) {
      localStorage.setItem(
        localStorageKeys.FILTERS_STORAGE_KEY,
        JSON.stringify({
          type: typeFilters,
          status: statusFilters,
        })
      );
    } else {
      localStorage.removeItem(localStorageKeys.FILTERS_STORAGE_KEY);
    }
  }, [typeFilters, statusFilters]);

  useEffect(() => {
    if (isInitializing) {
      return;
    }
    if (currentSort) {
      localStorage.setItem(localStorageKeys.SORT_STORAGE_KEY, currentSort);
    } else {
      localStorage.removeItem(localStorageKeys.SORT_STORAGE_KEY);
    }
  }, [currentSort]);

  useEffect(() => {
    if (isInitializing) {
      return;
    }
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        newParams.set("q", searchTerm);
      } else {
        newParams.delete("q");
      }
      setSearchParams(newParams);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams, searchParams]);

  const handleRemoveFilter = (filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const paramName = filterType === "type" ? "type" : "status";
    const currentValue = newParams.get(paramName) || "";
    const currentValues = currentValue ? currentValue.split(",") : [];

    const updatedValues = currentValues.filter((v) => v !== value);

    if (updatedValues.length === 0) {
      newParams.delete(paramName);
    } else {
      newParams.set(paramName, updatedValues.join(","));
    }

    setSearchParams(newParams);
  };

  const getFilterLabel = (filterType: string, value: string) => {
    if (filterType === "type") {
      const found = GOVERNANCE_ACTION_FILTERS.find((f) => f.value === value);
      return found ? found.label : value;
    } else {
      const found = GOVERNANCE_ACTION_STATUS_FILTERS.find(
        (f) => f.value === value
      );
      return found ? found.label : value;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "stretch" : "center"}
        justifyContent="space-between"
        gap={isMobile ? 1 : 1.5}
      >
        <InputBase
          id="search-input"
          inputProps={{ "data-testid": "search-input" }}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("outcomesList.searchPlaceholder")}
          value={searchTerm}
          startAdornment={
            <IconSearch
              width={20}
              height={18}
              fill={primaryBlue.c200}
              strokeWidth={5}
            />
          }
          endAdornment={
            searchTerm && (
              <IconButton
                onClick={() => setSearchTerm("")}
                data-testid="clear-search-input"
                aria-label={t("outcomesList.clearSearchInput")}
                role="button"
              >
                <IconX width={18} height={18} fill={textBlack} />
              </IconButton>
            )
          }
          sx={{
            bgcolor: "white",
            border: 1,
            borderColor: "borderGrey",
            borderRadius: 1,
            fontSize: 15,
            fontWeight: 400,
            height: 48,
            paddingY: 2,
            paddingLeft: 2.5,
            "& .MuiInputBase-input": {
              paddingLeft: 1,
            },
          }}
        />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          gap={isMobile ? 1 : 1.5}
        >
          <FiltersComponent />
          <RadioComponent
            queryParam="sort"
            options={GOVERNANCE_ACTION_SORT_OPTIONS}
            defaultValue="newestFirst"
            titleTranslationKey="outcomesList.sort.title"
            fullTitleTranslationKey="outcomesList.sort.fullTitle"
            testIdPrefix="sort"
          />
        </Box>
      </Box>

      {(typeFilters.length > 0 || statusFilters.length > 0) && (
        <Box display="flex" flexWrap="wrap" gap={1} data-testid="filter-chips">
          {typeFilters.map((filter) => (
            <ChipWithDelete
              key={`type-${filter}`}
              label={getFilterLabel("type", filter)}
              onDelete={() => handleRemoveFilter("type", filter)}
              data-testid={`type-chip-${filter}`}
              color="primary"
              variant="filled"
              size="small"
              deleteIconPosition="left"
            />
          ))}
          {statusFilters.map((filter) => (
            <ChipWithDelete
              key={`status-${filter}`}
              label={getFilterLabel("status", filter)}
              onDelete={() => handleRemoveFilter("status", filter)}
              data-testid={`status-chip-${filter}`}
              color="secondary"
              variant="filled"
              size="small"
              deleteIconPosition="left"
              bgColor={orange.c200}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
