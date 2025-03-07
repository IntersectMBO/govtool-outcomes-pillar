type UpDownArrowsIconProps = {
  width?: number;
  height?: number;
  color?: "string";
};

export default function UpDownArrowsIcon({
  width,
  height,
  color,
}: UpDownArrowsIconProps) {
  return (
    <>
      <svg
        width={width}
        height={height}
        viewBox="0 0 19 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.375 13.1666L5.54167 16.3333L8.70833 13.1666"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.54163 16.3333V3.66663"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.625 6.83329L13.4583 3.66663L10.2916 6.83329"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.4584 3.66663V16.3333"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
