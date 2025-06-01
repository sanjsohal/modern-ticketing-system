import React from 'react';
import { TicketOverview } from '../components/dashboard/TicketOverview';
import { RecentTickets } from '../components/dashboard/RecentTickets';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { BarChart2, Users, Clock, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your support operations
        </p>
      </div>
      
      <TicketOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTickets />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium">First Response</span>
                </div>
                <div className="text-lg font-semibold">2.4 hours</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Resolution Time</span>
                </div>
                <div className="text-lg font-semibold">18.2 hours</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium">Sarah Agent</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">28 tickets</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium">Mike Agent</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">22 tickets</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium">John Admin</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">15 tickets</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};