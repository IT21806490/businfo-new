// src/components/FareCalculator.jsx
import { useState } from "react";

const FareCalculator = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [fares, setFares] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatFare = (value) => (value ? `$${value}` : "N/A");

  const resetForm = () => {
    setOrigin("");
    setDestination("");
    setFares(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!origin.trim() || !destination.trim()) {
      setError("Please enter both origin and destination.");
      return;
    }

    setLoading(true);
    setError(null);
    setFares(null);

    try {
      const response = await fetch(
        `http://localhost:3000/calculate-fare?origin=${encodeURIComponent(
          origin.trim()
        )}&destination=${encodeURIComponent(destination.trim())}`
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setFares([]);
      } else {
        setFares(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred while fetching data. Please try again.");
      setFares([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-center text-green-600 mb-8">
          🚌 Bus Fare Calculator
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          aria-label="Fare Calculator Form"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label
                htmlFor="origin"
                className="block text-sm font-semibold text-gray-700"
              >
                Origin
              </label>
              <input
                type="text"
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                placeholder="Enter starting point"
                className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-gray-800"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="destination"
                className="block text-sm font-semibold text-gray-700"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                placeholder="Enter destination"
                className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-gray-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Calculating..." : "Calculate Fare"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center mt-8">
            <svg
              className="animate-spin h-8 w-8 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="status"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
                3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="mt-8 text-center text-red-600 font-medium"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Results */}
        {fares && fares.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Available Fares
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Route No.
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Route Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Normal Fare
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Semi-AC Fare
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      AC Fare
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fares.map((fare, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {fare.route_no}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {fare.route_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatFare(fare.normal)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatFare(fare.semi)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatFare(fare.ac)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {fares && fares.length === 0 && !error && !loading && (
          <p className="mt-8 text-center text-gray-500">
            No fares available for the selected route.
          </p>
        )}
      </div>
    </div>
  );
};

export default FareCalculator;
