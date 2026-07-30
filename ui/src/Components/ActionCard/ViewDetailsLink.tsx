import { NavLink } from "react-router";
import { Button } from "../Atoms/Button";
import { useTranslation } from "../../contexts/I18nContext";

type ViewDetailsLinkProps = {
  id: string;
};
function ViewDetailsLink({ id }: ViewDetailsLinkProps) {
  const { t } = useTranslation();
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
          color: "white",
          backgroundColor: "primaryBlue",
          width: "100%",
        }}
        aria-label={`${id}-view-details`}
      >
        {t("outcome.viewDetails")}
      </Button>
    </NavLink>
  );
}

export default ViewDetailsLink;
