import { Box } from "./Box";
import { CodeInput } from "./CodeInput";
import { Container } from "./wrapper";

function Game() {
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
        <div className="flex items-center justify-center rounded-full w-[349px] h-[349px] border-2 border-stone-100 font-MONO">
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

          {Array.from({length: 60}).map((_, i) => {
            const angle = (i / 60) * 360;
            const r = 160;
            const x = r * Math.cos((angle - 90) * (Math.PI / 180));
            const y = r * Math.sin((angle - 90) * (Math.PI / 180));

            return (
              <div key={`${i}`} className="absolute bg-black" style={{
                width: i % 5 === 0 ? "" : "1px",
                height: i % 5 === 0 ? "12px" : "6px",
                transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
                transformOrigin: "center"
                
              }}></div>
            )
          })}
          CrackIt
        </div>
      </Box>
    </Container>
  );
}

export default Game;
