import { NavLink } from "react-router-dom";
import { Button } from "../Atoms/Button";

type ViewDetailsLinkProps = {
  id: string;
};
function ViewDetailsLink({ id }: ViewDetailsLinkProps) {
  return (
    <NavLink
      data-testid={`${id}-view-details`}
      to={`/outcomes/governance_actions/${id}`}
      color="inherit"
      style={{
        display: "block",
        width: "100%",
        textDecoration: "none",
      }}
    >
      <Button
        variant="contained"
        sx={{
          borderRadius: "50px",
          color: "neutralWhite",
          backgroundColor: "primaryBlue",
          width: "100%",
        }}
        aria-label={`${id}-view-details`}
      >
        View Details
      </Button>
    </NavLink>
  );
}

export default ViewDetailsLink;
