import { useState } from 'react';
import { MoreVertical, ArrowUpDown, Star } from 'lucide-react';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import imgArtisan from "../../imports/Dashboard-2/6c4009bed7a62ce79249e3e38d12c49f634b5f89.png";

interface Artisan {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobsCompleted: number;
  rating: number;
  lastActive: string;
  location: string;
  avatar: string;
}

const mockArtisans: Artisan[] = Array(8).fill(null).map((_, i) => ({
  id: `artisan-${i + 1}`,
  name: 'Alex Smith',
  email: 'justinleo@gmail.com',
  phone: '+1 887 839 8383',
  jobsCompleted: 30,
  rating: 5.0,
  lastActive: '1h ago',
  location: 'San Farncisco CA',
  avatar: imgArtisan,
}));

export default function ArtisanManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100">
        <SearchBar
          placeholder="Search"
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Artisans Table */}
      <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Phone number</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Jobs Completed</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Last Active</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {mockArtisans.map((artisan, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={artisan.avatar} alt={artisan.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-sm text-gray-700 font-medium">{artisan.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{artisan.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{artisan.phone}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{artisan.jobsCompleted} completed</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{artisan.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{artisan.lastActive}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{artisan.location}</td>
                  <td className="py-4 px-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {mockArtisans.map((artisan, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={artisan.avatar} alt={artisan.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{artisan.name}</p>
                    <p className="text-xs text-gray-500">{artisan.email}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-700">{artisan.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm text-gray-700">{artisan.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jobs Completed</p>
                  <p className="text-sm font-semibold text-gray-900">{artisan.jobsCompleted}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">{artisan.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Active</p>
                  <p className="text-sm text-gray-700">{artisan.lastActive}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={20}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
