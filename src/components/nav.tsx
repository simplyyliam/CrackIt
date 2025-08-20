function Nav() {
  return (
    <div className="flex items-center justify-between w-full py-2.5">
      <div className="flex items-center justify-center gap-2.5">
        <svg
          width="37"
          height="23"
          viewBox="0 0 37 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.863636"
            width="35.5455"
            height="21.2727"
            rx="4.13636"
            stroke="black"
          />
          <path
            d="M6.38635 14.28L5.81635 13.86L7.05635 12.16L5.06635 11.5L5.27635 10.84L7.26635 11.48V9.32001H8.00635V11.48L9.99635 10.84L10.2064 11.5L8.21635 12.16L9.45635 13.86L8.88635 14.28L7.63635 12.56L6.38635 14.28Z"
            fill="black"
          />
          <path
            d="M17.0227 14.28L16.4527 13.86L17.6927 12.16L15.7027 11.5L15.9127 10.84L17.9027 11.48V9.32H18.6427V11.48L20.6327 10.84L20.8427 11.5L18.8527 12.16L20.0927 13.86L19.5227 14.28L18.2727 12.56L17.0227 14.28Z"
            fill="black"
          />
          <path
            d="M27.6591 14.28L27.0891 13.86L28.3291 12.16L26.3391 11.5L26.5491 10.84L28.5391 11.48V9.32H29.2791V11.48L31.2691 10.84L31.4791 11.5L29.4891 12.16L30.7291 13.86L30.1591 14.28L28.9091 12.56L27.6591 14.28Z"
            fill="black"
          />
        </svg>
        <h1 className="text-xl font-MONO">CrackIt</h1>
      </div>
      <div className="flex items-center justify-center gap-2.5">
        <h1 className="text-xl font-MONO">Levels</h1>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          color="#000000"
          fill="none"
        >
          <path
            d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
            stroke="currentColor"
            stroke-width="1.5"
          ></path>
          <path
            d="M11.9955 3H12.0045M11.9961 21H12.0051M18.3588 5.63599H18.3678M5.63409 18.364H5.64307M5.63409 5.63647H5.64307M18.3582 18.3645H18.3672M20.991 12.0006H21M3 12.0006H3.00898"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default Nav;
