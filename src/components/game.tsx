import { useEffect, useRef } from "react";
import { Box } from "./Box";
import { CodeInput } from "./CodeInput";
import { Container } from "./wrapper";
import gsap from "gsap";

function Game() {
  const dialRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dial = dialRef.current;
    if (!dial) return;

    let isDragging = false;
    let startX = 0;

    const rotationRef = { value: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;

      const sensitivity = 0.5;
      const newRotation = rotationRef.value + deltaX * sensitivity;

      gsap.set(dial, {
        rotate: newRotation,
        transformOrigin: "center center",
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;

      const deltaX = e.clientX - startX;
      rotationRef.value += deltaX * 0.5;
    };

    dial.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      dial.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <Container className="">
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
                className="absolute text-xs"
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
          CrackIt
        </div>
      </Box>
    </Container>
  );
}

export default Game;
