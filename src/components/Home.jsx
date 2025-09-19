import React from "react";
import { Bus, MapPin, Clock, Users } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden pt-12">
        <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Fastest Bus Routes & Fares Across Sri Lanka
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Find your route, check fares, and travel smarter with Businfo.click. Your journey starts with a click.
            </p>
            <a
              href="/fares"
              className="inline-block px-6 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
            >
              Find Fares
            </a>
          </div>

          <div className="md:w-1/2 flex justify-center relative">
            <div className="w-64 h-64 bg-yellow-300 rounded-full relative animate-bounce">
              <Bus size={120} className="absolute top-1/4 left-1/4 text-blue-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Stats Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-12 text-center">
        <div className="bg-white rounded-xl shadow p-6">
          <Bus className="text-blue-600 mx-auto mb-2" size={36} />
          <p className="text-2xl font-bold">500+</p>
          <p className="text-gray-700">Routes Covered</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <MapPin className="text-green-600 mx-auto mb-2" size={36} />
          <p className="text-2xl font-bold">2000+</p>
          <p className="text-gray-700">Stations Covered</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <Clock className="text-yellow-600 mx-auto mb-2" size={36} />
          <p className="text-2xl font-bold">24/7</p>
          <p className="text-gray-700">Real-time Info</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <Users className="text-red-600 mx-auto mb-2" size={36} />
          <p className="text-2xl font-bold">100k+</p>
          <p className="text-gray-700">Passengers Served</p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800">
            How It Works
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Select your origin and destination, check fares, and see all available routes instantly. Businfo.click makes commuting hassle-free.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <Bus className="text-blue-600 mx-auto" size={36} />
              <h3 className="font-bold text-lg">Search Routes</h3>
              <p className="text-gray-600 text-sm">
                Enter your starting point and destination to find the best routes.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <MapPin className="text-green-600 mx-auto" size={36} />
              <h3 className="font-bold text-lg">View Stops</h3>
              <p className="text-gray-600 text-sm">
                See all the stops covered by the bus, including fare stages and timings.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <Clock className="text-yellow-600 mx-auto" size={36} />
              <h3 className="font-bold text-lg">Travel Smart</h3>
              <p className="text-gray-600 text-sm">
                Plan your journey efficiently with real-time updates and info.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg md:text-xl mb-6">
          Explore routes, check fares, and travel smarter with Businfo.click
        </p>
        <a
          href="/routes"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Find Your Route
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
