import Nav from "./components/nav"
import { Container } from "./components/wrapper"

function App() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
        <Container>
          <Nav />
        </Container>
    </div>
  )
}

export default App