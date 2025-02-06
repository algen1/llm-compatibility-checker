import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const fetchHuggingFaceModels = async () => {
  const response = await fetch("https://huggingface.co/api/models");
  const models = await response.json();
  return models.slice(0, 10).map((model) => ({
    name: model.id,
    ram: 16,
    gpuVram: 6,
  }));
};

export default function CompatibilityChecker() {
  const [systemSpecs, setSystemSpecs] = useState({ ram: "", gpuVram: "" });
  const [results, setResults] = useState([]);
  const [llmModels, setLlmModels] = useState([]);

  const checkCompatibility = () => {
    const userRam = parseInt(systemSpecs.ram);
    const userGpuVram = parseInt(systemSpecs.gpuVram);

    if (isNaN(userRam) || isNaN(userGpuVram)) {
      alert("Please enter valid numbers for RAM and GPU VRAM.");
      return;
    }

    const compatibilityResults = llmModels.map((model) => ({
      ...model,
      canRun:
        userRam >= model.ram &&
        (userGpuVram >= model.gpuVram || model.gpuVram === 0),
    }));

    setResults(compatibilityResults);
  };

  React.useEffect(() => {
    fetchHuggingFaceModels().then(setLlmModels);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          LLM Compatibility Checker
        </h1>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter your RAM (GB)"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            value={systemSpecs.ram}
            onChange={(e) =>
              setSystemSpecs({ ...systemSpecs, ram: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Enter your GPU VRAM (GB)"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            value={systemSpecs.gpuVram}
            onChange={(e) =>
              setSystemSpecs({ ...systemSpecs, gpuVram: e.target.value })
            }
          />
          <button
            onClick={checkCompatibility}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-200"
          >
            Check Compatibility
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {results.map((model, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                model.canRun ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {model.canRun ? (
                <CheckCircle className="text-white" />
              ) : (
                <XCircle className="text-white" />
              )}
              <div className="flex-1">
                <p className="text-lg font-medium">{model.name}</p>
                <p className="text-sm text-gray-300">
                  Requires: {model.ram}GB RAM, {model.gpuVram}GB GPU VRAM
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
