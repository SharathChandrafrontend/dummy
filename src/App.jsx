import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/dashboard/Dashboard";
import Transaction from "./Components/transaction/Transactions";
import ViewTransaction from "./Components/transaction/viewTransaction";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/transactions" element={<Transaction/>} />
          <Route path="/:transactionId/viewTransaction" element={<ViewTransaction/>} />
          {/* <Route path="/review-segments" element={<ReviewSegments/>}/> */}
        </Routes>
      </BrowserRouter>
  );
}

export default App;
