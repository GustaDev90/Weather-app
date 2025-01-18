"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw, LogOut } from "lucide-react";
import { signOut, signIn, useSession } from "next-auth/react";

export default function Page() {
  const apiKey = "162217b4a78b14c093d6a30b3d818269";

  const { data: session } = useSession();

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = async () => {
    setIsLoading(true);
    setWeather(null);
    setError(null);

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP ERROR: ${response.status}`);
      }

      setTimeout(() => {
        setWeather(data);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }

    if (city.trim() === "") {
      setError("Please enter a location.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  const handleReset = () => {
    setCity("");
    setWeather(null);
    setError(null);
  };

  return (
    <div>
      <header className="h-screen flex items-center justify-center flex-col gap-6">
        <section>
          {session ? (
            <Button 
              variant="outline" 
              onClick={() => signOut()}
            >
              <LogOut size={20} className="absolute cursor-pointer -scale-x-100" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => signIn()}
            >
              Sign in
            </Button>
          )}
        </section>

        <h1 className="text-4xl sm:text-6xl md:text-6xl font-bold">
          Weather
        </h1>

        {weather && <p className="text-2xl font-mono">Location: {weather.name}</p>}

        <main className="text-center">
          {error && <p className="text-red-500">{error}</p>}
          
          {weather && (
            <div className="bg-white p-4 rounded rounded-xl flex gap-10">
              <div className="text-xl">
                <p>Temperature: {weather.main.temp} °C</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
                <p>Condition: {weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Pressure: {weather.main.pressure} hPa</p>
                <p>Visibility: {weather.visibility} meters</p>
                <p>Cloudiness: {weather.clouds.all}%</p>
              </div>
            </div>
          )}
        </main>

        <div className="flex gap-2">
          <Input
            type="text"
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a location"
            className="border-black-500 border-2 px-6 rounded-md w-94 h-12 sm:w-64"
          />
          
          <Button
            onClick={fetchWeather}
            disabled={isLoading}
            className="py-6 px-5 w-full"
          >
            {isLoading ? (
              <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white rounded-full dark:text-white" />
            ) : "Search"}
          </Button>
          
          <Button
            className="py-6 px-10 bg-white text-black border border-gray-300 hover:bg-gray-100 font-bold py-6 px-6 text-sm"
            onClick={handleReset}
          >
            <RotateCcw />
          </Button>
        </div>
      </header>
    </div>
  );
}
