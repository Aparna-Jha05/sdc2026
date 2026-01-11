"use client";

import { useState, useEffect, useRef } from 'react';
import { useAppState } from '@/context/app-state-context';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// Consolidated simulation hook
export function useSimulatedData() {
    const { crisisMode } = useAppState();

    // Thermodynamics
    const [thermodynamics, setThermodynamics] = useState({
        coreA: 600,
        coreB: 600,
        powerOutput: 18.4,
        isCogenerationActive: true,
    });

    // Global
    const [global, setGlobal] = useState({
        externalPressure: 50.1,
    });

    // Biometrics
    const [biometrics, setBiometrics] = useState({
        o2Saturation: 98.2,
        waterFlow: 1200,
    });

    useInterval(() => {
        // Thermodynamics Simulation
        let { coreA, coreB } = thermodynamics;
        let newPowerOutput;
        if (crisisMode) {
            newPowerOutput = 1.84 + (Math.random() - 0.5) * 0.4;
            coreA -= 20;
            coreB -= 20;
        } else {
            coreA += (Math.random() - 0.5) * 5;
            coreB += (Math.random() - 0.5) * 5;

            if (Math.random() < 0.05) coreA += (Math.random() - 0.5) * 150;
            if (Math.random() < 0.05) coreB += (Math.random() - 0.5) * 150;
            
            const avgTemp = (coreA + coreB) / 2;
            const tempFactor = 1 - (Math.abs(600 - avgTemp) / 400);
            newPowerOutput = 18.4 * tempFactor + (Math.random() - 0.5) * 0.2;
        }

        setThermodynamics({
            coreA: Math.max(200, Math.min(800, coreA)),
            coreB: Math.max(200, Math.min(800, coreB)),
            powerOutput: Math.max(crisisMode ? 0 : 15, Math.min(18.8, newPowerOutput)),
            isCogenerationActive: newPowerOutput > 16.5 && !crisisMode,
        });

        // Global Simulation
        setGlobal({
            externalPressure: 50.1 + (Math.random() - 0.5) * 0.2,
        });
        
        // Biometrics Simulation
        setBiometrics({
            o2Saturation: 98.2 + (Math.random() - 0.5) * 0.5,
            waterFlow: 1200 + (Math.random() - 0.5) * 50,
        });

    }, 2000);

    return { thermodynamics, global, biometrics };
}

// A simple hook to simulate a single number value
export function useSimulatedNumber(baseValue: number, jitter: number, interval: number, clampMin = -Infinity, clampMax = Infinity) {
  const [value, setValue] = useState(baseValue);

  useInterval(() => {
    let newValue = value + (Math.random() - 0.5) * jitter;
    newValue = Math.max(clampMin, Math.min(clampMax, newValue));
    setValue(newValue);
  }, interval);

  return value;
}
