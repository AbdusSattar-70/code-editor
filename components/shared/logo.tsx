function LogoIcon() {
  return (
    <svg
      className="w-8 h-8 text-blue-500"
      viewBox="0 0 84 96"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Logo</title>

      {/* Animate polygon stroke */}
      <polygon
        points="39 0 0 22 0 67 39 90 78 68 78 23"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-polygon"
      />

      {/* Visible 'L' text */}
      <text
        x="39"
        y="60"
        textAnchor="middle"
        fontSize="50"
        fill="currentColor"
        fontFamily="monospace"
      >
        L
      </text>
    </svg>
  );
}

export default LogoIcon;
