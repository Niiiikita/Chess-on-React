export default function BishopWhite(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 64 64"
      {...props}
    >
      <path
        fill="#fff"
        d="m32 7 18 18-4 25H20L10 40V29z"
      />
      <path
        fill="#acbdc5"
        d="M33.4 8.2 15.2 26.5c-4.3 4.3-4.3 11.3 0 15.6l5.9 5.9H24c13.3 0 24-10.1 24-22.5V22l6 14-6 12v8h8c2.2 0 4 1.8 4 4v2h-4v2H40c-4.4 0-8-3.6-8-8 0 4.4-3.6 8-8 8H4v-4c0-2.2 1.8-4 4-4h8v-7.4L12.4 45c-5.8-5.9-5.8-15.3 0-21.2L30.6 5.4l2.8 2.8z"
      />
      <path
        fill="#314a52"
        d="M51.6 23.7c5.8 5.9 5.8 15.3 0 21.2L48 48.6V56h-4v-9.1l4.8-4.8c4.3-4.3 4.3-11.3 0-15.6L29.1 6.7C28.4 6 28 5.1 28 4c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.1-.5 2.1-1.2 2.8l16.8 16.9zM30 26v6h-6v4h6v6h4v-6h6v-4h-6v-6h-4zm2 30c0 4.4 3.6 8 8 8h20v-4H40c-2.2 0-4-1.8-4-4h-4z"
      />
    </svg>
  );
}
