type CheckMarkIconProps = {
  width?: number;
  height?: number;
};
function CheckMarkIcon({ width = 24, height = 24 }: CheckMarkIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 9 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 3L3.5 5L7.5 1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CheckMarkIcon;
