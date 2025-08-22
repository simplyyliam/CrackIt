import { useEffect, useRef, useState } from "react";
import { Box } from "./Box";
import { CodeInput } from "./CodeInput";
import { Container } from "./wrapper";
import gsap from "gsap";

function Game() {
  const dialRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);

  const [rotation, setRotation] = useState(0);
  const [targetCode, setTargetCode] = useState<number[]>([]);
  const [solvedCode, setSolvedCode] = useState<(number | null)[]>([]);
  const [stepIndex, setStepIndex] = useState(0); // progress through sequence
  const [lastDirection, setLastDirection] = useState<"cw" | "ccw" | null>(null);
  const [hasWrapped, setHasWrapped] = useState(false); //State to see if we passed 0

  // current dial number (0–59)
  const angle = ((rotation % 360) + 360) % 360;
  const currentNumber = (60 - Math.round(angle / 6)) % 60;

  // Setup random combination once
  useEffect(() => {
    const digits = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 60)
    );
    setTargetCode(digits);
    setSolvedCode(Array(4).fill(null));
    setStepIndex(0);
    setLastDirection(null);
    setHasWrapped(false);
  }, []);

  // --- DIAL TURNING LOGIC ---
  useEffect(() => {
    const dial = dialRef.current;
    if (!dial) return;

    let isDragging = false;
    let startX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const sensitivity = 0.5;
      const newRotation = rotationRef.current - deltaX * sensitivity;

      const dir = deltaX > 0 ? "ccw" : "cw";
      setLastDirection(dir as "cw" | "ccw");

      gsap.set(dial, { rotate: newRotation, transformOrigin: "center center" });
      setRotation(newRotation);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;

      const deltaX = e.clientX - startX;
      rotationRef.current -= deltaX * 0.5;

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
      const step = e.deltaY > 0 ? -6 : 6;
      rotationRef.current += step;

      const dir = step > 0 ? "cw" : "ccw";
      setLastDirection(dir);

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
  }, []);

  // --- LOCK LOGIC ---
  useEffect(() => {
    if (targetCode.length === 0) return;
    if (stepIndex >= targetCode.length) return;

    const target = targetCode[stepIndex];

    // Step rules
    if (stepIndex === 0) {
      // Step 1: Must rotate clockwise to target
      if (lastDirection === "cw" && currentNumber === target) {
        const newSolved = [...solvedCode];
        newSolved[stepIndex] = target;
        setSolvedCode(newSolved);
        setStepIndex(1);
      }
    } else if (stepIndex === 1) {
      // Step 2: Must rotate CCW, pass previous once, land on target
      if (lastDirection === "ccw") {
        if (currentNumber === target && hasWrapped) {
          const newSolved = [...solvedCode];
          newSolved[stepIndex] = target;
          setSolvedCode(newSolved);
          setStepIndex(2);
          setHasWrapped(false);
        }
        if (currentNumber === solvedCode[0]) {
          setHasWrapped(true);
        }
      }
    } else if (stepIndex === 2) {
      // Step 3: Rotate CW directly to target
      if (lastDirection === "cw" && currentNumber === target) {
        const newSolved = [...solvedCode];
        newSolved[stepIndex] = target;
        setSolvedCode(newSolved);
        setStepIndex(3);
      }
    } else if (stepIndex === 3) {
      // Step 4: Rotate CCW to final target
      if (lastDirection === "ccw" && currentNumber === target) {
        const newSolved = [...solvedCode];
        newSolved[stepIndex] = target;
        setSolvedCode(newSolved);
        setStepIndex(4); // solved!
      }
    }
  }, [
    currentNumber,
    targetCode,
    stepIndex,
    lastDirection,
    hasWrapped,
    solvedCode,
  ]);

  return (
    <Container>
      <Box>
        <div className="flex flex-col items-center font-MONO gap-2.5">
          <h1 className="text-2xl font-medium">Verify that you are a human</h1>
          <p className="text-lg opacity-50 text-center">
            Turn the dial like a real safe to crack the 4-digit code.
          </p>
        </div>

        <div className="flex items-center justify-center gap-5">
          {solvedCode.map((digit, i) => (
            <CodeInput key={i}>{digit}</CodeInput>
          ))}
        </div>
      </Box>

      <Box>
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
