'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChartProvider, useChart } from './lib/ChartContext';

export default function Home() {
  return (
    <ChartProvider>
      <ChartEditor />
    </ChartProvider>
  );
}

function ChartEditor() {
  const { config, setConfig, width, setWidth, height, setHeight } = useChart();

  const [presetConfigs, setPresetConfigs] = useState({
    bar: {
      name: "Bar Chart",
      config: `{
  "type": "bar",
  "data": {
    "labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    "datasets": [{
      "label": "Votes",
      "data": [12, 19, 3, 5, 2, 3],
      "backgroundColor": [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)"
      ],
      "borderColor": [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ],
      "borderWidth": 1
    }]
  },
  "options": {
    "plugins": {
      "title": {
        "display": true,
        "text": "Sample Bar Chart"
      }
    }
  }
}`
    },
    line: {
      name: "Line Chart",
      config: `{
  "type": "line",
  "data": {
    "labels": ["January", "February", "March", "April", "May", "June"],
    "datasets": [{
      "label": "Sales",
      "data": [65, 59, 80, 81, 56, 55],
      "fill": false,
      "borderColor": "rgb(75, 192, 192)",
      "tension": 0.1
    }]
  },
  "options": {
    "plugins": {
      "title": {
        "display": true,
        "text": "Monthly Sales"
      }
    }
  }
}`
    },
    pie: {
      name: "Pie Chart",
      config: `{
  "type": "pie",
  "data": {
    "labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    "datasets": [{
      "label": "Dataset",
      "data": [12, 19, 3, 5, 2, 3],
      "backgroundColor": [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(153, 102, 255, 0.8)",
        "rgba(255, 159, 64, 0.8)"
      ]
    }]
  },
  "options": {
    "plugins": {
      "title": {
        "display": true,
        "text": "Sample Pie Chart"
      }
    }
  }
}`
    },
    doughnut: {
      name: "Doughnut Chart",
      config: `{
  "type": "doughnut",
  "data": {
    "labels": ["Desktop", "Mobile", "Tablet"],
    "datasets": [{
      "data": [300, 50, 100],
      "backgroundColor": [
        "#FF6384",
        "#36A2EB",
        "#FFCE56"
      ],
      "hoverBackgroundColor": [
        "#FF6384",
        "#36A2EB",
        "#FFCE56"
      ]
    }]
  },
  "options": {
    "plugins": {
      "title": {
        "display": true,
        "text": "Traffic Sources"
      }
    }
  }
}`
    }
  });

  const generateChartUrl = () => {
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const params = new URLSearchParams({
      c: config,
      w: width,
      h: height,
    });
    return `${baseUrl}/api/chart?${params.toString()}`;
  };

  return (
    <div className="grid grid-cols-3 gap-8 h-full">
      {/* Chart Configuration */}
      <section className="col-span-1 bg-white rounded-lg p-6 shadow flex flex-col">
        <h2 className="text-2xl font-semibold mb-6">Chart Configuration</h2>
        <div className="mb-4">
          <div className="font-medium mb-2">Chart Type</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button className="px-3 py-2 rounded border font-medium flex items-center gap-2 bg-gray-900 text-white" onClick={() => setConfig(presetConfigs.bar.config)}>
              <span>📊</span> Bar Chart
            </button>
            <button className="px-3 py-2 rounded border font-medium flex items-center gap-2" onClick={() => setConfig(presetConfigs.line.config)}>
              <span>📈</span> Line Chart
            </button>
            <button className="px-3 py-2 rounded border font-medium flex items-center gap-2" onClick={() => setConfig(presetConfigs.pie.config)}>
              <span>🥧</span> Pie Chart
            </button>
            <button className="px-3 py-2 rounded border font-medium flex items-center gap-2" onClick={() => setConfig(presetConfigs.doughnut.config)}>
              <span>🍩</span> Doughnut Chart
            </button>
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Width</label>
            <input type="number" value={width} onChange={e => setWidth(e.target.value)} className="w-24 px-2 py-1 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-24 px-2 py-1 border rounded" />
          </div>
        </div>
        <div className="mb-4 flex-1 flex flex-col">
          <label className="block text-sm font-medium mb-2">Chart Configuration (Chart.js JSON)</label>
          <textarea value={config} onChange={e => setConfig(e.target.value)} className="w-full h-48 p-3 border rounded font-mono text-xs flex-1" />
        </div>
      </section>
      {/* Chart Preview */}
      <section className="col-span-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Chart Preview</h2>
        <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-lg border shadow">
          <Image
            src={generateChartUrl()}
            alt="Generated Chart"
            width={parseInt(width)}
            height={parseInt(height)}
            className="max-w-full max-h-full"
            onError={e => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIGxvYWRpbmcgY2hhcnQ8L3RleHQ+PC9zdmc+';
            }}
            unoptimized
          />
        </div>
      </section>
      {/* API Usage Examples */}
      <section className="col-span-1 bg-white rounded-lg p-6 shadow flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">API Usage Examples</h2>
        <div className="flex flex-col gap-4 text-sm">
          <div>
            <strong>JavaScript</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto text-xs">// Using fetch API\nconst response = await fetch('{generateChartUrl()}');\nconst chartBlob = await response.blob();\nconst chartUrl = URL.createObjectURL(chartBlob);\n// Display in img element\n// &lt;img src=&#123;chartUrl&#125; /&gt;</pre>
          </div>
          <div>
            <strong>Python</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto text-xs">import requests\nurl = '{generateChartUrl()}'\nresp = requests.get(url)\nwith open('chart.png', 'wb') as f:\n    f.write(resp.content)</pre>
          </div>
          <div>
            <strong>cURL</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto text-xs">curl '{generateChartUrl()}' --output chart.png</pre>
          </div>
          <div>
            <strong>HTML</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto text-xs">&lt;img src="{generateChartUrl()}" alt="Chart" /&gt;</pre>
          </div>
          <div>
            <strong>Markdown</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto text-xs">![]({generateChartUrl()})</pre>
          </div>
        </div>
      </section>
    </div>
  );
}