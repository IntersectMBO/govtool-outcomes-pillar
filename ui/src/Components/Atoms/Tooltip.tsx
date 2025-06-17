import { Box, Tooltip as MUIToolTip } from "@mui/material";
import { Typography } from "./Typography";
import React from "react";

export type TooltipProps = {
  heading?: string;
  paragraphOne?: string;
  paragraphTwo?: string;
  paragraphThree?: string;
  paragraphFour?: string;
  children: React.ReactElement<any>;
};

export const Tooltip = ({
  heading,
  paragraphOne,
  paragraphTwo,
  paragraphThree,
  paragraphFour,
  children,
}: TooltipProps) => (
  <MUIToolTip
    enterTouchDelay={0}
    leaveTouchDelay={1000}
    title={
      <>
        {heading && (
          <Typography variant="body1" fontWeight={400} color={"arcticWhite"}>
            {heading}
          </Typography>
        )}
        {[paragraphOne, paragraphTwo, paragraphThree, paragraphFour]
          .filter(Boolean)
          .map((paragraph, index) => (
            <Typography
              key={index}
              variant="body2"
              fontWeight={400}
              color={"rgb(170, 170, 170)"}
              sx={{
                mt: heading && index === 0 ? 0.5 : index > 0 ? 0.5 : 0,
              }}
            >
              {paragraph}
            </Typography>
          ))}
      </>
    }
    arrow
    slotProps={{
      tooltip: {
        sx: {
          backgroundColor: "rgb(36, 34, 50)",
          borderRadius: 1,
          p: 1,
          m: 0,
        },
      },
      arrow: {
        sx: {
          color: "rgb(36, 34, 50)",
        },
      },
    }}
  >
    {children}
  </MUIToolTip>
);
