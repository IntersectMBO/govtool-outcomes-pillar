type ShareIconProps = {
  width?: number;
  height?: number;
};
function ShareIcon({ width = 24, height = 24 }: ShareIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 4C16.8954 4 16 4.89543 16 6C16 6.32338 16.076 6.62613 16.2102 6.89402C16.5398 7.5519 17.2185 8 18 8C19.1046 8 20 7.10457 20 6C20 4.89543 19.1046 4 18 4ZM14 6C14 3.79086 15.7909 2 18 2C20.2091 2 22 3.79086 22 6C22 8.20914 20.2091 10 18 10C16.7951 10 15.7158 9.4672 14.9832 8.62643L9.91189 11.1621C9.96964 11.4327 10 11.7131 10 12C10 12.2869 9.96964 12.5673 9.91189 12.8379L14.9832 15.3736C15.7158 14.5328 16.7951 14 18 14C20.2091 14 22 15.7909 22 18C22 20.2091 20.2091 22 18 22C15.7909 22 14 20.2091 14 18C14 17.7131 14.0304 17.4327 14.0881 17.1621L9.0168 14.6264C8.2842 15.4672 7.20485 16 6 16C3.79086 16 2 14.2091 2 12C2 9.79086 3.79086 8 6 8C7.20485 8 8.2842 8.5328 9.0168 9.37357L14.0881 6.83791C14.0304 6.5673 14 6.28691 14 6ZM6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14C6.78153 14 7.46021 13.5519 7.78979 12.894C7.924 12.6261 8 12.3234 8 12C8 11.6766 7.924 11.3739 7.78979 11.106C7.46021 10.4481 6.78153 10 6 10ZM18 16C17.2185 16 16.5398 16.4481 16.2102 17.106C16.076 17.3739 16 17.6766 16 18C16 19.1046 16.8954 20 18 20C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16Z"
        fill="#212A3D"
      />
    </svg>
  );
}

export default ShareIcon;
