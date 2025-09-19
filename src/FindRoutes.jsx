import React, { useState, useEffect, useRef } from "react";
import allSectionsData from "../data/all_section.json";
import allRoutesData from "../data/allroutes.json";
import { Bus, RefreshCw, Trash2 } from "lucide-react";

const FindRoutes = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [matchingRoutes, setMatchingRoutes] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionMap, setSectionMap] = useState({});
  const [routeMap, setRouteMap] = useState({});

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    const sMap = {};
    const uniqueSections = new Set();
    allSectionsData.forEach((sec) => {
      if (!sMap[sec.route_no]) sMap[sec.route_no] = {};
      sMap[sec.route_no][sec.section_name] = sec;
      uniqueSections.add(sec.section_name);
    });

    const rMap = {};
    allRoutesData.forEach((r) => {
      rMap[r.Route_No] = r;
    });

    setSectionMap(sMap);
    setRouteMap(rMap);
    setAllSections(Array.from(uniqueSections).sort());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginSuggestions(false);
      }
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowDestinationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const findRoutes = () => {
    if (!origin || !destination) {
      alert("Please select both origin and destination");
      return;
    }
    if (origin === destination) {
      alert("Origin and destination cannot be the same");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const results = [];
      Object.keys(sectionMap).forEach((routeNo) => {
        const originSec = sectionMap[routeNo][origin];
        const destSec = sectionMap[routeNo][destination];
        if (originSec && destSec) {
          const routeInfo = routeMap[routeNo];
          results.push({
            route_no: routeNo,
            route_name: routeInfo
              ? `${routeInfo.Origin} - ${routeInfo.Destination}`
              : "Unknown",
          });
        }
      });
      results.sort((a, b) => a.route_no.localeCompare(b.route_no));
      setMatchingRoutes(results);
      setLoading(false);
    }, 1000);
  };

  const clearSelections = () => {
    setOrigin("");
    setDestination("");
    setMatchingRoutes([]);
  };

  const swapOriginDestination = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const selectOrigin = (val) => {
    setOrigin(val);
    setShowOriginSuggestions(false);
  };
  const selectDestination = (val) => {
    setDestination(val);
    setShowDestinationSuggestions(false);
  };

  const filteredOriginSections = allSections.filter((sec) =>
    sec.toLowerCase().includes(origin.toLowerCase())
  );
  const filteredDestinationSections = allSections.filter((sec) =>
    sec.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Banner */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Bus size={36} className="text-yellow-300" />
            <h1 className="text-2xl md:text-3xl font-extrabold">
              BUSINFO.CLICK
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="/" className="hover:text-yellow-300">Home</a>
            <a href="/routes" className="hover:text-yellow-300">Routes</a>
            <a href="/contact" className="hover:text-yellow-300">Contact</a>
          </nav>
        </div>
        <div className="text-center mt-6">
          <p className="text-lg md:text-xl font-medium">
            Just Click for the, fastest fares across in Sri Lanka
          </p>
        </div>
      </header>

      {/* Highlights - Optional, but keeps the look consistent */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 text-center">
          <div className="p-4 rounded-lg bg-blue-50">
            <p className="text-2xl font-bold text-blue-700">{allRoutesData.length}</p>
            <p className="text-gray-600">Routes Available</p>
          </div>
          <div className="p-4 rounded-lg bg-green-50">
            <p className="text-2xl font-bold text-green-700">{allSections.length}</p>
            <p className="text-gray-600">Sections Covered</p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50">
            <p className="text-2xl font-bold text-yellow-700">100k+</p>
            <p className="text-gray-600">Passengers Served</p>
          </div>
        </div>
      </section>

      <main className="flex-1 p-6 flex justify-center">
        {/* Adjusted the main container class for full screen */}
        <div className="w-full bg-white rounded-xl shadow-lg p-8 md:px-12 lg:px-24">
          <h2 className="text-2xl font-extrabold text-blue-700 mb-6 text-center">
            Find Your Route
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative" ref={originRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origin
              </label>
              <input
                type="text"
                placeholder="Enter origin..."
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setShowOriginSuggestions(true);
                }}
                onFocus={() => setShowOriginSuggestions(true)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoComplete="off"
              />
              {showOriginSuggestions && filteredOriginSections.length > 0 && (
                <ul className="absolute z-10 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                  {filteredOriginSections.map((sec) => (
                    <li
                      key={sec}
                      onClick={() => selectOrigin(sec)}
                      className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                    >
                      {sec}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative" ref={destinationRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                placeholder="Enter destination..."
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setShowDestinationSuggestions(true);
                }}
                onFocus={() => setShowDestinationSuggestions(true)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoComplete="off"
              />
              {showDestinationSuggestions && filteredDestinationSections.length > 0 && (
                <ul className="absolute z-10 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                  {filteredDestinationSections.map((sec) => (
                    <li
                      key={sec}
                      onClick={() => selectDestination(sec)}
                      className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                    >
                      {sec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 space-x-4">
            <button
              onClick={swapOriginDestination}
              disabled={!origin || !destination}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition disabled:opacity-50"
            >
              <RefreshCw size={16} className="mr-2" /> Swap
            </button>

            <button
              onClick={clearSelections}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              <Trash2 size={16} className="mr-2" /> Clear
            </button>
            <button
              onClick={findRoutes}
              disabled={loading || !origin || !destination || origin === destination}
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Find Routes"}
            </button>
          </div>

          <div>
            {loading && (
              <div className="text-center py-6">
                <Bus className="animate-bounce mx-auto text-blue-600" size={40} />
                <p className="text-gray-600 mt-2">Searching for routes...</p>
              </div>
            )}

            {!loading && matchingRoutes.length === 0 && (
              <p className="text-center text-gray-500 text-lg mt-8">
                {origin && destination
                  ? "No routes found between selected origin and destination."
                  : "Please select origin and destination to find routes."}
              </p>
            )}

            {matchingRoutes.length > 0 && (
              <>
                <p className="mb-4 text-blue-700 font-semibold text-center">
                  Found {matchingRoutes.length} route{matchingRoutes.length > 1 ? "s" : ""}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {matchingRoutes.map((route, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition bg-white"
                    >
                      <h2 className="text-lg font-bold text-blue-800">
                        {route.route_name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Route No:</span>{" "}
                        {route.route_no}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-6 text-center text-sm">
        &copy; {new Date().getFullYear()} Businfo.click — All rights reserved.
      </footer>
    </div>
  );
};

export default FindRoutes;
