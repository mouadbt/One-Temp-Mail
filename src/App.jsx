import { Button } from "@/components/ui/button"
import Header from "./Header"
import { Route, Routes } from "react-router"
import Email from "./Email"
import SMS from "./SMS"

export default function App() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Email/>}></Route>
        <Route path="/sms" element={<SMS/>}></Route>
        <Route path="*" element={<Email/>}></Route>
      </Routes>
    </div>
  )
}
