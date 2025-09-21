import Header from "./Header"
import { Route, Routes } from "react-router"
import Email from "./Email"

export default function App() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Email/>}></Route>
        <Route path="*" element={<Email/>}></Route>
      </Routes>
    </div>
  )
}
