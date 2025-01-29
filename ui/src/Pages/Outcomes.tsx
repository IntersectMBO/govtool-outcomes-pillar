import { Box } from "@mui/material";
import SearchFiltersSortBar from "../Components/Molecules/SearchFiltersSortBar";
import { GOVERNANCE_ACTION_FILTERS } from "../consts/filters";
import { GOVERNANCE_ACTION_STATUS_FILTERS } from "../consts/status-filters";
import { GOVERNANCE_ACTION_SORT_OPTIONS } from "../consts/sort-options";
import { useState } from "react";
import GovernanceActionsList from "../Components/Molecules/GovernanceActionsList";

export default function OutcomesPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filtersOpen, setFilterOpen] = useState(false);
  const [sortsOpen, setSortsOpen] = useState(false);
  const [selectedSorting, setSelectedSorting] = useState("");
  const closeFilters = () => {
    setFilterOpen(false);
  };
  const closeSorts = () => {
    setSortsOpen(false);
  };
  const governanceActions = [
    {
      dateSubmitted: "18 Jan 2024",
      epoch: 430,
      status: "Ratified",
      title: "Plutus V3 Cost Model Parameter Changes Prior to Chang#2",
      abstract:
        "In light of recent network congestion and scalability concerns I propose implementing a dynamic fee adjustment mechanism that autonomously regulates transaction fees based on network demand and resource availability.",
      governanceActionType: "Protocol Parameter Changes",
      governanceActionID: "cnewjfbe82rg39udbjwbksomething",
      cipGovernanceActionID: "cnewjfbe82rg39udbjwbksomething",
      statusDate: "22nd Jan 2024",
      statusEpoch: 440,
    },
    {
      dateSubmitted: "18 Jan 2024",
      epoch: 430,
      status: "Expired",
      title: "Plutus V3 Cost Model Parameter Changes Prior to Chang#2",
      abstract:
        "In light of recent network congestion and scalability concerns I propose implementing a dynamic fee adjustment mechanism that autonomously regulates transaction fees based on network demand and resource availability.",
      governanceActionType: "Protocol Parameter Changes",
      governanceActionID: "cnewjfbe82rg39udbjwbksomething",
      cipGovernanceActionID: "cnewjfbe82rg39udbjwbksomething",
      statusDate: "22nd Jan 2024",
      statusEpoch: 440,
    },
    {
      dateSubmitted: "18 Jan 2024",
      epoch: 430,
      status: "Enacted",
      title: "Plutus V3 Cost Model Parameter Changes Prior to Chang#2",
      abstract:
        "In light of recent network congestion and scalability concerns I propose implementing a dynamic fee adjustment mechanism that autonomously regulates transaction fees based on network demand and resource availability.",
      governanceActionType: "Protocol Parameter Changes",
      governanceActionID: "cnewjfbe82rg39udbjwbksomething",
      cipGovernanceActionID: "cnewjfbe82rg39udbjwbksomething",
      statusDate: "22nd Jan 2024",
      statusEpoch: 440,
    },
  ];

  return (
    <Box>
      <Box>
        <SearchFiltersSortBar
          filterOptions={GOVERNANCE_ACTION_FILTERS}
          statusOptions={GOVERNANCE_ACTION_STATUS_FILTERS}
          sortOptions={GOVERNANCE_ACTION_SORT_OPTIONS}
          searchText={searchText}
          setSearchText={setSearchText}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          closeFilters={closeFilters}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFilterOpen}
          closeSorts={closeSorts}
          sortOpen={sortsOpen}
          selectedSorting={selectedSorting}
          setSelectedSorting={setSelectedSorting}
          setSortOpen={setSortsOpen}
        />
      </Box>
      <Box>
        <GovernanceActionsList governanceActions={governanceActions} />
      </Box>
    </Box>
  );
}
