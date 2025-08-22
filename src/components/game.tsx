import { useEffect, useRef, useState } from "react";
import { Box } from "./Box";
import { CodeInput } from "./CodeInput";
import { Container } from "./wrapper";
import gsap from "gsap";
import { useTimerStore } from "../stores/TimerStore";

function Game() {
  const dialRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const combonationRef = useRef<HTMLDivElement | null>(null);
  const otpRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<HTMLSpanElement | null>(null);
  const codeRef = useRef<HTMLDivElement | null>(null);
  const combonationBlocksRef = useRef<HTMLDivElement | null>(null);

  const [rotation, setRotation] = useState(0);
  const [targetCode, setTargetCode] = useState<number[]>([]);
  const [solvedCode, setSolvedCode] = useState<(number | null)[]>([]);
  const [stepIndex, setStepIndex] = useState(0); // progress through sequence
  const [lastDirection, setLastDirection] = useState<"cw" | "ccw" | null>(null);
  const [hasWrapped, setHasWrapped] = useState(false); //State to see if we passed 0
  const { timer, format, tick } = useTimerStore();
  const [showCode, setShowCode] = useState(false);

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
    timer,
  ]);

  //Zustond logic

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [tick]);

  useEffect(() => {
    const tl = gsap.timeline();
    if (timer <= 0) {
      tl.to([combonationRef.current, timerRef.current], {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.out",
      });
      tl.to(combonationRef.current, {
        display: "none",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.set(combonationBlocksRef.current, {display: "none"})
      setShowCode(true);
    }
    if (showCode) {
      gsap.to(codeRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    }

    return () => {
      tl.kill();
    };
  }, [timer, showCode]);

  return (
    <Container>
      <span ref={timerRef} className="flex w-full items-center justify-center">
        {format()}
      </span>
      <Box ref={otpRef}>
        <div className="flex flex-col items-center font-MONO gap-2.5">
          <h1 className="text-2xl font-medium">Verify that you are a human</h1>
          <p className="text-lg opacity-50 text-center">
            Turn the dial like a real safe to crack the 4-digit code.
          </p>
        </div>

        <div ref={combonationBlocksRef} className="flex items-center justify-center gap-5">
          {solvedCode.map((digit, i) => (
            <CodeInput key={i}>{digit}</CodeInput>
          ))}
        </div>
                {showCode && (
          <div
            ref={codeRef}
            className="flex items-center justify-center gap-5 opacity-0 scale-0"
          >
            {targetCode.map((digit, i) => (
              <CodeInput key={i}>{digit}</CodeInput>
            ))}
          </div>
        )}
      </Box>

      <Box ref={combonationRef}>
        <span className="rotate-180">
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
