// import React from 'react';
// import { CloudRain, Droplets, Thermometer, Zap, Fan, Tv, Lamp, Wifi } from 'lucide-react';
// import DeviceCard from '../components/specific/DeviceCard';

// const StatWidget = ({ icon: Icon, label, value, unit, color }) => (
//   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:scale-105 transition-transform">
//     <div className={`p-3 rounded-xl ${color} text-white`}><Icon size={24} /></div>
//     <div>
//       <p className="text-slate-500 text-sm font-medium">{label}</p>
//       <p className="text-2xl font-bold text-slate-800">{value}<span className="text-sm text-slate-400 font-normal ml-1">{unit}</span></p>
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   return (
//     <div className="space-y-8">
//       {/* Banner */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
//         <div className="relative z-10">
//           <h1 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h1>
//           <p className="text-blue-100 max-w-lg mb-6">Your home is currently 24°C with 65% humidity. All security systems are active.</p>
//           <div className="flex gap-3">
//             <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">Manage Devices</button>
//             <button className="bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors">View Reports</button>
//           </div>
//         </div>
//         <CloudRain size={200} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
//       </div>

//       {/* Widgets */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatWidget icon={Thermometer} label="Temperature" value="24" unit="°C" color="bg-orange-500" />
//         <StatWidget icon={Droplets} label="Humidity" value="65" unit="%" color="bg-blue-500" />
//         <StatWidget icon={Zap} label="Consumption" value="12.5" unit="kWh" color="bg-yellow-500" />
//         <StatWidget icon={Wifi} label="Network" value="300" unit="Mb/s" color="bg-emerald-500" />
//       </div>

//       {/* Quick Devices */}
//       <div>
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-xl font-bold text-slate-800">Favorites</h2>
//           <button className="text-blue-600 text-sm font-semibold hover:underline">See all</button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <DeviceCard name="Living Room Lamp" room="Living Room" icon={Lamp} isOn={true} onToggle={() => {}} />
//           <DeviceCard name="Smart TV" room="Living Room" icon={Tv} isOn={false} onToggle={() => {}} />
//           <DeviceCard name="AC Master" room="Bedroom" icon={Fan} isOn={true} onToggle={() => {}} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// // import React from 'react';
// // import { Lamp, Fan, Tv, Speaker } from 'lucide-react';
// // import DeviceCard from '../components/Devices/DeviceCard';

// // const Dashboard = () => {
// //   const devices = [
// //     { id: 1, name: "Smart Lamp", room: "Living Room", icon: Lamp, defaultStatus: true },
// //     { id: 2, name: "Air Conditioner", room: "Bedroom", icon: Fan },
// //     { id: 3, name: "Smart TV", room: "Living Room", icon: Tv },
// //   ];

// //   return (
// //     <div>
// //       <h2 className="text-2xl font-bold mb-6 text-slate-800">My Devices</h2>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {devices.map(dev => <DeviceCard key={dev.id} {...dev} />)}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;