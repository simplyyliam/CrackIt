import { useEffect, useRef, useState } from "react";
import { Box } from "./Box";
import { CodeInput } from "./CodeInput";
import { Container } from "./wrapper";
import gsap from "gsap";

function Game() {
  const dialRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // current dial number (0–59)
  const currentNumber = Math.round((((rotation % 360) + 360) % 360) / 6);

  useEffect(() => {
    const dial = dialRef.current;
    if (!dial) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const sensitivity = 0.5;
      const newRotation = rotationRef.current + deltaX * sensitivity;

      gsap.set(dial, {
        rotate: newRotation,
        transformOrigin: "center center",
      });

      setRotation(newRotation);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      setIsDragging(false);

      const deltaX = e.clientX - startX;
      rotationRef.current += deltaX * 0.5;

      // snap to nearest 6°
      const snapped = Math.round(rotationRef.current / 6) * 6;
      rotationRef.current = snapped;

      gsap.to(dial, {
        rotate: snapped,
        duration: 0.2,
        ease: "power2.out",
        transformOrigin: "center center",
      });

      setRotation(snapped);
    };

    const handleOnScroll = (e: WheelEvent) => {
      const step = e.deltaY > 0 ? 6 : -6;
      rotationRef.current += step;

      gsap.to(dial, {
        rotate: rotationRef.current,
        duration: 0.2,
        ease: "power2.out",
        transformOrigin: "center center",
      });

      setRotation(rotationRef.current);
    };

    dial.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    dial.addEventListener("wheel", handleOnScroll);

    return () => {
      dial.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      dial.removeEventListener("wheel", handleOnScroll);
    };
  }, [isDragging, startX]);


  return (
    <Container>
      <Box>
        <div className="flex flex-col items-center font-MONO gap-2.5">
          <h1 className="text-2xl font-medium">Verify that you are a human</h1>
          <p className="text-lg opacity-50 text-center">
            Can you crack your way and enter the hidden 4-digit code before the
            timer runs out..
          </p>
        </div>

        <div className="flex items-center justify-center gap-5">
          <CodeInput></CodeInput>
          <CodeInput></CodeInput>
          <CodeInput></CodeInput>
          <CodeInput></CodeInput>
        </div>
      </Box>
      <Box>
        <span ref={indicatorRef} className="rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            color="#000000"
            fill="none"
          >
            <path
              d="M5.59347 9.22474C7.83881 5.62322 8.96148 3.82246 10.4326 3.28C11.445 2.90667 12.555 2.90667 13.5674 3.28C15.0385 3.82246 16.1612 5.62322 18.4065 9.22474C20.9338 13.2785 22.1975 15.3054 21.9749 16.9779C21.8222 18.125 21.2521 19.173 20.3762 19.9163C19.0993 21 16.7328 21 12 21C7.26716 21 4.90074 21 3.62378 19.9163C2.74792 19.173 2.17775 18.125 2.02509 16.9779C1.80252 15.3054 3.06617 13.2785 5.59347 9.22474Z"
              stroke="#141B34"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        {/* Dial Lock */}
        <div
          ref={dialRef}
          className="flex items-center justify-center rounded-full w-[349px] h-[349px] border-2 border-stone-100 font-MONO cursor-grab"
        >
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i / 60) * 360;
            const r = 160;
            const x = r * Math.cos((angle - 90) * (Math.PI / 180));
            const y = r * Math.sin((angle - 90) * (Math.PI / 180));

            return (
              <div
                key={i}
                className="absolute text-[16px] font-medium"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                {i % 5 === 0 ? i : ""}
              </div>
            );
          })}

          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i / 60) * 360;
            const r = 160;
            const x = r * Math.cos((angle - 90) * (Math.PI / 180));
            const y = r * Math.sin((angle - 90) * (Math.PI / 180));

            return (
              <div
                key={`${i}`}
                className="absolute bg-black"
                style={{
                  width: i % 5 === 0 ? "" : "1px",
                  height: i % 5 === 0 ? "12px" : "6px",
                  transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
                  transformOrigin: "center",
                }}
              ></div>
            );
          })}
          {currentNumber}
        </div>
      </Box>
    </Container>
  );
}

export default Game;
