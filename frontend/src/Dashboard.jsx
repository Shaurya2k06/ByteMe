import { useEffect, useRef } from "react";
import NavBar1 from "./components/NavBar1";
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

const AdminBalance = () => {
  return (
    <div className="flex-1 min-w-[250px] bg-white rounded-lg p-4 shadow-md flex flex-col justify-between gap-2 hover:shadow-2xl transition-all duration-300 h-[200px] sm:h-[221px]">
      <h3 className="text-[24px] sm:text-[32px] font-semibold text-gray-800 leading-[100%]">
        Admin Balance
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-[24px] sm:text-[32px] font-bold text-gray-800 leading-[100%]">
          10,000,000
        </span>
        <span className="text-sm sm:text-base text-gray-600">BITS</span>
      </div>
    </div>
  );
};

const TotalTransactions = () => {
  return (
    <div className="flex-1 min-w-[250px] bg-white rounded-lg p-4 shadow-md flex flex-col justify-between gap-2 hover:shadow-2xl transition-all duration-300 h-[200px] sm:h-[221px]">
      <h3 className="text-[24px] sm:text-[32px] font-semibold text-gray-800 leading-[100%]">
        Total Transactions
      </h3>
      <div className="flex items-center gap-2">
        <span className="text-[24px] sm:text-[32px] font-bold text-gray-800 leading-[100%]">
          20,000
        </span>
        <span className="text-sm sm:text-base text-green-600">+2.3%</span>
      </div>
    </div>
  );
};

const CoinFlow = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Volume of Tokens",
            data: [
              2000, 3000, 2500, 6000, 9000, 7000, 4000, 5000, 4500, 4000, 3500,
              4000,
            ],
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Volume of Tokens",
            },
          },
          x: {
            title: {
              display: true,
              text: "Time",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md flex flex-col gap-2 hover:shadow-2xl transition-all duration-300 min-h-[300px]">
      <div className="flex gap-2 items-center">
        <img src="/uparraow.svg" alt="logo" className="w-10 h-10" />
        <h3 className="text-[24px] sm:text-[32px] font-semibold text-gray-800">
          Coin Flow
        </h3>
      </div>
      <div className="w-full h-[250px] sm:h-[300px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

const SendTokens = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md flex flex-col gap-4 hover:shadow-2xl transition-all duration-300 w-full">
      <div className="flex gap-2 items-center">
        <img src="/telegram.svg" alt="logo" className="w-[27px] h-[27px]" />
        <h3 className="text-lg font-semibold text-gray-800">Send Tokens</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-800">Wallet Address</label>
          <input
            type="text"
            placeholder="Enter wallet address"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-800">No. of Tokens</label>
          <input
            type="number"
            placeholder="Enter number of tokens"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="bg-blue-600 text-white rounded-md p-2 text-base hover:bg-blue-700 active:scale-95 transition-transform duration-100">
          SEND
        </button>
      </div>
    </div>
  );
};

const ImagePlaceholder = () => {
  return (
    <div className="w-full flex justify-center items-center py-4">
      <img
        src="/dashboardimage.svg"
        alt="logo"
        className="hover:animate-wave transition-all duration-500 transform origin-bottom h-[150px] sm:h-[200px] object-contain"
      />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100 overflow-x-hidden">
      <div className="sticky top-0 z-10">
        <NavBar1 />
      </div>
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        <div className="w-full lg:w-[70%] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-10">
            <AdminBalance />
            <TotalTransactions />
          </div>
          <CoinFlow />
        </div>
        <div className="w-full lg:w-[30%] flex flex-col gap-4">
          <ImagePlaceholder />
          <SendTokens />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
