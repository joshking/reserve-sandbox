"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import CategorySelector from "@/components/CategorySelector"
import DtfTable from "@/components/DtfTable"

export default function Home() {
  const [category, setCategory] = useState("index")

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <Navbar />
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <HeroSection />
        <CategorySelector selected={category} onSelect={setCategory} />
        <DtfTable category={category} />
      </div>
    </div>
  )
}
