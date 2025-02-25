"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RetroGrid } from "@/components/magicui/retro-grid"
import { HyperText } from "@/components/magicui/hyper-text"
import { RotateCcw, LogOut } from "lucide-react"
import { signOut, signIn, useSession } from "next-auth/react"

export default function Main () {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API;
  
  const { data: session } = useSession()
  
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [city, setCity] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchWeather = async () => {
    setIsLoading(true)
    
    setWeather(null)
    setError(null)
    
    setCity("")

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,)
      const data = await response.json()
      setWeather(data)
      
      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`)
      }
      
    } catch (error) {
       setError("Please enter a valid location to proceed.")
       setIsLoading(false)
      
    } finally {
       setIsLoading(false)
    }
    
    if (!city.trim()) {
      setError("Please enter a location.")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
       fetchWeather();
    }
  }

  const handleReload = () => {
    setCity("")
    setWeather(null)
    setError(null)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <RetroGrid />
       <header className="p-4 flex justify-start">
        {session ? (
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut size={20} className="cursor-pointer -scale-x-100" />
          </Button>
        ) : (
          <Button
            onClick={() => signIn("github")}
            className="flex items-center justify-center mr-auto gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#24292e] hover:bg-[#2f363d] rounded-md transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Sign up with GitHub
          </Button>
        )}
       </header>

      <div className="flex-grow flex items-center justify-center flex-col gap-6">
        <HyperText text="Weather App" className="text-7xl font-bold text-center">Check Weather</HyperText>
        <p>Type your location, and check the weather! 🌤 </p>

        {weather && (
          <div>
            <img
              src={`https://flagcdn.com/w320/${weather.sys.country.toLowerCase()}.png`}
              alt={`${weather.sys.country} flag`}
              className="w-16 h-12 m-auto rounded-xl"
            />
            <p className="text-2xl font-mono mt-4">Location: {weather.name}</p>
          </div>
        )}

        <main className="text-center">
          {error && <p className="text-red-500">{error}</p>}

          {weather && (
            <div className="bg-white p-4 rounded rounded-xl flex gap-10">
              <div className="text-xl">
                <p>Temperature: <strong>{weather.main.temp}</strong> °C</p>
                <p>Wind Speed: <strong>{weather.wind.speed}</strong> m/s</p>
                <p>Condition: <strong>{weather.weather[0].description}</strong></p>
                <p>Humidity: <strong>{weather.main.humidity}</strong>%</p>
                <p>Pressure: <strong>{weather.main.pressure}</strong> hPa</p>
                <p>Visibility: <strong>{weather.visibility}</strong> meters</p>
                <p>Cloudiness: <strong>{weather.clouds.all}</strong>%</p>
              </div>
            </div>
          )}
        </main>

        <div className="flex gap-2">
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            placeholder="Enter a location"
            className="focus:outline-none focus:ring-0 border border-black px-6 rounded-md w-48 h-12 sm:w-64"
          />
          <Button onClick={fetchWeather} disabled={isLoading} className="py-6 px-5 w-full">
            {isLoading ? (
              <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white rounded-full dark:text-white" />
            ) : (
              "Search"
            )}
          </Button>
          <Button
            onClick={handleReload}
            variant="outline"
            className="w-20 rounded-full h-12 p-4"
          >
          <RotateCcw size={100} />
         </Button>
        </div>
      </div>
    </main>
  )
}

