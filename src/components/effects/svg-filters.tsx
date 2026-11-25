export function SvgFilters() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden"
    >
      <defs>
        {/* Gooey fluid filter: combines blur and high alpha contrast */}
        <filter id="navGoo" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>

        {/* Glass distortion filter for organic physical glass refraction */}
        <filter id="glassDistortion" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04 0.04"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="distort"
          />
        </filter>

        {/* Panel glass distortion for larger surface backgrounds */}
        <filter id="glassDistortionPanel" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.02"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Water ripple subtle motion filter */}
        <filter id="waterRipple" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01 0.05"
            numOctaves="2"
            result="rippleNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="rippleNoise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </defs>
    </svg>
  );
}
