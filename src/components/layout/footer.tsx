export const Footer = () => {
  return (
    <footer className="text-surface relative flex flex-col items-center bg-[#100e0e]/50 text-center text-gray-200 backdrop-blur-md">
      <div className="container flex h-full flex-col items-center justify-center  py-6 md:flex-row md:items-start md:justify-between md:gap-0 md:py-8">
        <div className="flex flex-col items-center justify-center space-y-2 py-2 text-left text-xs text-foreground md:items-start md:justify-center ">
          <p>Tel (+216) 24 002 024</p>
          <p>E-mail support@ecomness.com</p>
          <p>P8M8+J66, Rue de Palestine, Ezzahra 2034.</p>
        </div>
        <div className="flex h-full flex-row items-center justify-center space-x-2">
          <a
            href="https://www.facebook.com/ecomness"
            type="button"
            title=""
            aria-label="Facebook"
            className="text-surface rounded-full bg-transparent p-3 font-medium uppercase leading-normal hover:scale-110"
            data-twe-ripple-init>
            <span className="[&>svg]:h-5 [&>svg]:w-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 320 512">
                <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
              </svg>
            </span>
          </a>

          <a
            href="https://www.instagram.com/ecomness/"
            type="button"
            aria-label="Instagram"
            className="text-surface rounded-full bg-transparent p-3 font-medium uppercase leading-normal hover:scale-110"
            data-twe-ripple-init>
            <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </span>
          </a>

          <a
            href="https://www.tiktok.com/@ecomness"
            type="button"
            aria-label="tiktok"
            className="text-surface rounded-full bg-transparent p-3 font-medium uppercase leading-normal hover:scale-110"
            data-twe-ripple-init>
            <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="52"
                height="52"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#c9de00"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M16.083 2h-4.083a1 1 0 0 0 -1 1v11.5a1.5 1.5 0 1 1 -2.519 -1.1l.12 -.1a1 1 0 0 0 .399 -.8v-4.326a1 1 0 0 0 -1.23 -.974a7.5 7.5 0 0 0 1.73 14.8l.243 -.005a7.5 7.5 0 0 0 7.257 -7.495v-2.7l.311 .153c1.122 .53 2.333 .868 3.59 .993a1 1 0 0 0 1.099 -.996v-4.033a1 1 0 0 0 -.834 -.986a5.005 5.005 0 0 1 -4.097 -4.096a1 1 0 0 0 -.986 -.835z"
                  strokeWidth="0"
                  fill="currentColor"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <div className="w-full bg-[#100e0e]/70 p-4 text-center text-xs text-foreground">
        © {new Date().getFullYear()} Copyright ECOMNESS GROUP
      </div>
    </footer>
  );
};
