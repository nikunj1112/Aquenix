import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
    } from "recharts";
    
    const data = [
    
    {month:"Jan",orders:40},
    
    {month:"Feb",orders:70},
    
    {month:"Mar",orders:55},
    
    {month:"Apr",orders:90}
    
    ];
    
    function Dashboard(){
    
    return(
    
    <div>
    
    <h2>Admin Dashboard</h2>
    
    <div className="cards">
    
    <div className="card">
    
    <h3>Total Customers</h3>
    <p>120</p>
    
    </div>
    
    <div className="card">
    
    <h3>Total Orders</h3>
    <p>340</p>
    
    </div>
    
    <div className="card">
    
    <h3>Total Deliveries</h3>
    <p>300</p>
    
    </div>
    
    </div>
    
    <h3>Monthly Orders</h3>
    
    <BarChart
    width={500}
    height={300}
    data={data}
    >
    
    <CartesianGrid strokeDasharray="3 3" />
    
    <XAxis dataKey="month" />
    
    <YAxis />
    
    <Tooltip />
    
    <Bar dataKey="orders" fill="#392f97" />
    
    </BarChart>
    
    </div>
    
    );
    
    }
    
    export default Dashboard;