export default function KnightBlack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 64 64"
      {...props}
    >
      <path
        fill="#acbdc5"
        d="M31 30 10 48h43.5l-3-5.5C52.8 38.3 54 33.3 54 28 54 12.5 43.5 2 28 2l3 4.5L10 24v4l5.5 4 8.5-4 7 2z"
      />
      <path
        fill="#597380"
        d="m33.3 7-2.6-3L8 23.1v5.8l2.9 2.9c2.8 2.8 7.3 3.1 10.5.7l3.1-2.3 3.3.8L8 47.6V56c0 4.4 3.6 8 8 8h30c4.4 0 8-3.6 8-8v-8l-5-4 6-20-7-10.2v.2c0 18.8-12.5 34-28 34h-6.3l22.6-19-12.7-3.2-4.6 3.5c-1.6 1.2-3.8 1-5.2-.4L12 27.2V25L33.3 7z"
      />
      <path
        fill="#314a52"
        fillRule="evenodd"
        d="M24.1 0H28c15.5 0 28 12.5 28 28 0 5.7-1.7 10.9-4.6 15.3l4.6 4.6V56c0 4.4-3.6 8-8 8h-4v-4h4c2.2 0 4-1.8 4-4v-6.4l-5.8-5.8 1-1.4c3-4 4.8-9 4.8-14.4 0-11.8-8.6-21.7-19.8-23.6l3.9 5.5-3.2 2.3L24.1 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
