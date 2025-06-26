import React, { createContext, useContext, useState } from 'react';

interface ChartContextType {
  config: string;
  setConfig: (c: string) => void;
  width: string;
  setWidth: (w: string) => void;
  height: string;
  setHeight: (h: string) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const ChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<string>('');
  const [width, setWidth] = useState<string>('800');
  const [height, setHeight] = useState<string>('600');

  return (
    <ChartContext.Provider value={{ config, setConfig, width, setWidth, height, setHeight }}>
      {children}
    </ChartContext.Provider>
  );
};

export function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('useChart must be used within a ChartProvider');
  return ctx;
} 