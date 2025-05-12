import React from 'react';
import { Statistics } from '../types';
import { BarChart, Users, BookOpen, Users2, TrendingUp, Award, Calendar, Percent } from 'lucide-react';

interface StatsProps {
  stats: Statistics;
}

export const StatisticsPanel: React.FC<StatsProps> = ({ stats }) => {
  // Calculate percentages for each category
  const calculatePercentage = (count: number) => ((count / stats.totalStudents) * 100).toFixed(1);

  // Find the highest count department
  const topDepartment = Object.entries(stats.departmentCounts)
    .sort(([,a], [,b]) => b - a)[0];

  // Calculate gender distribution (if TYPE contains gender info)
  const genderDistribution = Object.entries(stats.quotaCounts).reduce((acc, [quota, count]) => {
    if (quota.toLowerCase().includes('female')) acc.female = (acc.female || 0) + count;
    else if (quota.toLowerCase().includes('male')) acc.male = (acc.male || 0) + count;
    return acc;
  }, {} as { female?: number; male?: number });

  // Calculate year-wise distribution from Batch
  const yearDistribution = Object.entries(stats.departmentCounts).reduce((acc, [, count]) => {
    acc.total += count;
    return acc;
  }, { total: 0 });

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-2 text-blue-700">
            <Users size={20} />
            <h3 className="font-semibold">Total Students</h3>
          </div>
          <p className="text-2xl font-bold text-blue-800 mt-2">{stats.totalStudents}</p>
          <p className="text-sm text-blue-600 mt-1">Active Enrollments</p>
          {genderDistribution.female && (
            <p className="text-xs text-blue-500 mt-1">
              Gender Ratio: {calculatePercentage(genderDistribution.female)}% Female
            </p>
          )}
        </div>

        <div className="bg-green-50 p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-2 text-green-700">
            <BookOpen size={20} />
            <h3 className="font-semibold">Departments</h3>
          </div>
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
            {Object.entries(stats.departmentCounts).map(([dept, count]) => (
              <div key={dept} className="flex justify-between text-sm hover:bg-green-100 p-1 rounded">
                <span>{dept}:</span>
                <span className="font-semibold">{count} ({calculatePercentage(count)}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-2 text-purple-700">
            <Award size={20} />
            <h3 className="font-semibold">Quota Distribution</h3>
          </div>
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
            {Object.entries(stats.quotaCounts).map(([quota, count]) => (
              <div key={quota} className="flex justify-between text-sm hover:bg-purple-100 p-1 rounded">
                <span>{quota}:</span>
                <span className="font-semibold">{count} ({calculatePercentage(count)}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-2 text-orange-700">
            <Users2 size={20} />
            <h3 className="font-semibold">Community</h3>
          </div>
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
            {Object.entries(stats.communityCounts).map(([comm, count]) => (
              <div key={comm} className="flex justify-between text-sm hover:bg-orange-100 p-1 rounded">
                <span>{comm}:</span>
                <span className="font-semibold">{count} ({calculatePercentage(count)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Summary Section */}
        <div className="md:col-span-4 bg-indigo-50 p-4 rounded-lg mt-4">
          <div className="flex items-center gap-2 text-indigo-700 mb-4">
            <TrendingUp size={20} />
            <h3 className="font-semibold">Advanced Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Award size={16} />
                <p className="font-medium">Department Statistics</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Largest:</span>{' '}
                  <span className="text-indigo-800">{topDepartment[0]} ({topDepartment[1]} students)</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Average Size:</span>{' '}
                  <span className="text-indigo-800">
                    {(stats.totalStudents / Object.keys(stats.departmentCounts).length).toFixed(1)} students
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Total Departments:</span>{' '}
                  <span className="text-indigo-800">{Object.keys(stats.departmentCounts).length}</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Calendar size={16} />
                <p className="font-medium">Batch Overview</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Total Enrollment:</span>{' '}
                  <span className="text-indigo-800">{yearDistribution.total}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Average per Batch:</span>{' '}
                  <span className="text-indigo-800">
                    {(yearDistribution.total / 4).toFixed(1)}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Percent size={16} />
                <p className="font-medium">Distribution Metrics</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Dept. Distribution:</span>{' '}
                  <span className="text-indigo-800">
                    {(stats.totalStudents / Object.keys(stats.departmentCounts).length).toFixed(1)}%
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Community Diversity:</span>{' '}
                  <span className="text-indigo-800">
                    {Object.keys(stats.communityCounts).length} types
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};