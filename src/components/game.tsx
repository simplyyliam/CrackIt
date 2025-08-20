import { Box } from "./Box"
import { CodeInput } from "./CodeInput"
import { Container } from "./wrapper"

function Game() {
  return (
    <Container className="">
        <Box>
            <div className="flex flex-col items-center font-MONO gap-2.5">
                <h1 className="text-2xl font-medium">Verify that you are a human</h1>
                <p className="text-lg opacity-50 text-center">Can you crack your way and enter the hidden 4-digit code before the timer runs out..</p>
            </div>

            <div className="flex items-center justify-center gap-5">
                <CodeInput></CodeInput>
                <CodeInput></CodeInput>
                <CodeInput></CodeInput>
                <CodeInput></CodeInput>
            </div>
        </Box>
        <Box>
            <div className="flex items-center justify-center rounded-full w-[349px] h-[349px] border-2 border-stone-100">CrackIt</div>
        </Box>
    </Container>
  )
}

export default Game