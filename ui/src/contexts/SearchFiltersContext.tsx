import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    FC,
    useRef,
  } from "react";
  import { useLocation } from "react-router-dom";
  
  import { useDebounce } from "../hooks/useDebounce";
  
  
  interface SearchFiltersSortBarContextType {
    isAdjusting: boolean;
    selectedFilters: string[];
    selectedFiltersLength: number;
    chosenSorting: string;
    closeFilters: () => void;
    closeSorts: () => void;
    debouncedSearchText: string;
    filtersOpen: boolean;
    searchText: string;
    setSelectedFilters: Dispatch<SetStateAction<string[]>>;
    setChosenSorting: Dispatch<SetStateAction<string>>;
    setFiltersOpen: Dispatch<SetStateAction<boolean>>;
    setSearchText: Dispatch<SetStateAction<string>>;
    setSortOpen: Dispatch<SetStateAction<boolean>>;
    sortOpen: boolean;
  }
  
  
  const SearchFiltersSortBarContext = createContext<
  SearchFiltersSortBarContextType | undefined
  >(undefined);
  SearchFiltersSortBarContext.displayName = "SearchFiltersSortBarContext";
  
  interface ProviderProps {
    children: React.ReactNode;
  }
  
  const SearchFiltersSortBarProvider: FC<ProviderProps> = ({ children }) => {
    const isAdjusting = useRef<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");
    const debouncedSearchText = useDebounce(searchText.trim(), 300);
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [sortOpen, setSortOpen] = useState<boolean>(false);
    const [chosenSorting, setChosenSorting] = useState<string>("");
    const [lastPath, setLastPath] = useState<string>("");
  
    const { pathname } = useLocation();
  
    const closeFilters = useCallback(() => {
      setFiltersOpen(false);
    }, []);
  
    const closeSorts = useCallback(() => {
      setSortOpen(false);
    }, []);
  
    const resetState = useCallback(() => {
      setSearchText("");
      setSelectedFilters([]);
      setChosenSorting("");
      isAdjusting.current = false;
    }, []);
  
    const userMovedToDifferentAppArea =
      pathname !== lastPath &&
      (!pathname.startsWith(lastPath) || lastPath === "" || lastPath === "/");
    const userOpenedGADetailsFromCategoryPage =
      lastPath.includes("governance_actions/category") &&
      pathname.includes("governance_actions/");
    const userMovedFromGAListToCategoryPage =
      lastPath.endsWith("governance_actions") &&
      pathname.includes("governance_actions/category");
  
    useEffect(() => {
      isAdjusting.current = true;
  
      if (
        (!pathname.includes("drep_directory") &&
          userMovedToDifferentAppArea &&
          !userOpenedGADetailsFromCategoryPage) ||
        userMovedFromGAListToCategoryPage
      ) {
        resetState();
      }
    }, [pathname, resetState]);
  
    useEffect(() => {
      setLastPath(pathname);
    }, [searchText, selectedFilters, chosenSorting]);
  
    const contextValue = useMemo(
      () => ({
        isAdjusting: isAdjusting.current,
        selectedFilters,
        SelectedFiltersLength: selectedFilters.length,
        chosenSorting,
        closeFilters,
        closeSorts,
        debouncedSearchText,
        filtersOpen,
        searchText,
        setSelectedFilters,
        setChosenSorting,
        setFiltersOpen,
        setSearchText,
        setSortOpen,
        sortOpen,
      }),
      [
        selectedFilters,
        chosenSorting,
        debouncedSearchText,
        filtersOpen,
        searchText,
        sortOpen,
        closeFilters,
        closeSorts,
        pathname,
      ],
    );
  
    return (
      <SearchFiltersSortBarContext.Provider value={contextValue}>
        {children}
      </SearchFiltersSortBarContext.Provider>
    );
  };
  
  function useSearchFiltersSortBar() {
    const context = useContext(SearchFiltersSortBarContext);
    if (!context) {
      throw new Error(
        "useSearchFiltersSortBar must be used within a SearchFiltersSortBarProvider",
      );
    }
    return context;
  }
  
  export { SearchFiltersSortBarProvider, useSearchFiltersSortBar };
  