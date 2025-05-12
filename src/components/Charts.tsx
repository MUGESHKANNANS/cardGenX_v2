import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Statistics } from '../types';

interface ChartsProps {
  stats: Statistics;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const Charts: React.FC<ChartsProps> = ({ stats }) => {
  const departmentData = Object.entries(stats.departmentCounts).map(([name, value]) => ({
    name,
    value
  }));

  const quotaData = Object.entries(stats.quotaCounts).map(([name, value]) => ({
    name,
    value
  }));

  const communityData = Object.entries(stats.communityCounts).map(([name, value]) => ({
    name,
    value
  }));

  // Generate trend data based on departments
  const trendData = departmentData.map((dept, index) => ({
    name: dept.name,
    students: dept.value,
    average: Math.round(stats.totalStudents / departmentData.length),
    trend: dept.value + Math.sin(index) * 5 // Adding some variation for visualization
  }));

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Data Visualization</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Department Distribution</h3>
          <RechartsBarChart width={400} height={300} data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" name="Students" />
          </RechartsBarChart>
        </div>

        {/* Quota Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Quota Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={quotaData}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {quotaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Community Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Community Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={communityData}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {communityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Department Trends */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Department Trends</h3>
          <LineChart width={400} height={300} data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="students" stroke="#8884d8" name="Students" />
            <Line type="monotone" dataKey="average" stroke="#82ca9d" name="Average" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="trend" stroke="#ffc658" name="Trend" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};