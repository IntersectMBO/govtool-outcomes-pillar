import { Typography } from "@mui/material";


const AbstractLoader = () => {
  return (
    <Typography sx={{
        fontSize: 14,
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        lineHeight: "20px",
        WebkitLineClamp: 2,
        maxWidth: "auto",
        fontWeight: 400,
        filter: "blur(3px)", 
        transition: "filter 0.5s ease-in-out",
        opacity: 0.7,
        color: "gray",
      }}>
      Loading description...
    </Typography>
  );
};

export default AbstractLoader;
