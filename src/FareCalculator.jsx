import React, { useEffect, useState, useRef } from "react";
import allSectionsData from "./data/all_section.json";
import fareStagesData from "./data/fare_stages.json";
import allRoutesData from "./data/allroutes.json";

const FareCalculator = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [fareResults, setFareResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allSections, setAllSections] = useState([]);

  // Indexed maps for O(1) lookups
  const [sectionMap, setSectionMap] = useState({});
  const [fareStageMap, setFareStageMap] = useState({});
  const [routeMap, setRouteMap] = useState({});

  // Suggestions visibility
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  // Refs for click outside detection
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    // Build sectionMap: { route_no: { section_name: sectionObj } }
    const sMap = {};
    const uniqueSections = new Set();
    allSectionsData.forEach((sec) => {
      if (!sMap[sec.route_no]) sMap[sec.route_no] = {};
      sMap[sec.route_no][sec.section_name] = sec;
      uniqueSections.add(sec.section_name);
    });

    // Build fareStageMap: { fare_stage: {normal, semi, ac} }
    const fMap = {};
    fareStagesData.forEach((f) => {
      fMap[f.fare_stage] = f;
    });

    // Build routeMap: { Route_No: { Origin, Destination } }
    const rMap = {};
    allRoutesData.forEach((r) => {
      rMap[r.Route_No] = r;
    });

    setSectionMap(sMap);
    setFareStageMap(fMap);
    setRouteMap(rMap);
    setAllSections(Array.from(uniqueSections).sort());
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculation logic with pre-indexed maps
  const calculateFare = () => {
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

      // Check all routes where both origin & destination exist
      Object.keys(sectionMap).forEach((routeNo) => {
        const originSec = sectionMap[routeNo][origin];
        const destSec = sectionMap[routeNo][destination];

        if (originSec && destSec) {
          const sectionDiff = Math.abs(
            destSec.section_id - originSec.section_id
          );

          const fareData = fareStageMap[sectionDiff];
          if (!fareData) return;

          // Build fare result entry
          const routeInfo = routeMap[routeNo];
          results.push({
            route_no: routeNo,
            route_name: routeInfo
              ? `${routeInfo.Origin} - ${routeInfo.Destination}`
              : "Unknown",
            normal: fareData.normal,
            semi: fareData.semi,
            ac: fareData.ac,
          });
        }
      });

      // Sort results by route_no ascending
      results.sort((a, b) => a.route_no.localeCompare(b.route_no));

      setFareResults(results);
      setLoading(false);
    }, 300); // slight delay for UX
  };

  // Filter suggestions based on input
  const filteredOriginSections = allSections.filter((sec) =>
    sec.toLowerCase().includes(origin.toLowerCase())
  );
  const filteredDestinationSections = allSections.filter((sec) =>
    sec.toLowerCase().includes(destination.toLowerCase())
  );

  const swapOriginDestination = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const clearSelections = () => {
    setOrigin("");
    setDestination("");
    setFareResults([]);
  };

  // Handle suggestion click
  const selectOrigin = (val) => {
    setOrigin(val);
    setShowOriginSuggestions(false);
  };
  const selectDestination = (val) => {
    setDestination(val);
    setShowDestinationSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
          Bus Fare Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Origin Input with suggestions */}
          <div className="relative" ref={originRef}>
            <label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Origin
            </label>
            <input
              id="origin"
              type="text"
              placeholder="Type origin..."
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setShowOriginSuggestions(true);
              }}
              onFocus={() => setShowOriginSuggestions(true)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoComplete="off"
            />
            {showOriginSuggestions && filteredOriginSections.length > 0 && (
              <ul className="absolute z-10 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                {filteredOriginSections.map((sec) => (
                  <li
                    key={sec}
                    onClick={() => selectOrigin(sec)}
                    className="cursor-pointer px-3 py-2 hover:bg-indigo-100"
                  >
                    {sec}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destination Input with suggestions */}
          <div className="relative" ref={destinationRef}>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Destination
            </label>
            <input
              id="destination"
              type="text"
              placeholder="Type destination..."
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowDestinationSuggestions(true);
              }}
              onFocus={() => setShowDestinationSuggestions(true)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoComplete="off"
            />
            {showDestinationSuggestions && filteredDestinationSections.length > 0 && (
              <ul className="absolute z-10 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                {filteredDestinationSections.map((sec) => (
                  <li
                    key={sec}
                    onClick={() => selectDestination(sec)}
                    className="cursor-pointer px-3 py-2 hover:bg-indigo-100"
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
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition disabled:opacity-50"
            title="Swap Origin and Destination"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
            <span>Swap</span>
          </button>

          <button
            onClick={clearSelections}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Clear
          </button>

          <button
            onClick={calculateFare}
            disabled={loading || !origin || !destination || origin === destination}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center space-x-2 justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Calculating...</span>
              </div>
            ) : (
              "Calculate Fare"
            )}
          </button>
        </div>

        {/* Results */}
        <div>
          {fareResults.length === 0 && !loading && (
            <p className="text-center text-gray-500 text-lg mt-8">
              {origin && destination
                ? "No routes found between selected origin and destination."
                : "Please select origin and destination to calculate fare."}
            </p>
          )}

          {fareResults.length > 0 && (
            <>
              <p className="mb-4 text-indigo-700 font-semibold text-center">
                Found {fareResults.length} route
                {fareResults.length > 1 ? "s" : ""}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {fareResults.map((fare, idx) => (
                  <div
                    key={idx}
                    className="border border-indigo-200 rounded-lg p-5 shadow-sm hover:shadow-md transition bg-white"
                  >
                    <div className="mb-2">
                      <h2 className="text-lg font-bold text-indigo-800">
                        {fare.route_name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Route No:</span>{" "}
                        {fare.route_no}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="rounded-md p-3 text-center bg-orange-100 text-orange-800">
                        <p className="text-sm font-semibold">Normal</p>
                        <p className="text-lg font-bold">Rs. {fare.normal}</p>
                      </div>
                      <div className="rounded-md p-3 text-center bg-blue-100 text-blue-800">
                        <p className="text-sm font-semibold">Semi</p>
                        <p className="text-lg font-bold">Rs. {fare.semi}</p>
                      </div>
                      <div className="rounded-md p-3 text-center bg-green-100 text-green-800">
                        <p className="text-sm font-semibold">AC</p>
                        <p className="text-lg font-bold">Rs. {fare.ac}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Bus Fare Calculator. All rights reserved.
      </footer>
    </div>

  );
};

export default FareCalculator;
