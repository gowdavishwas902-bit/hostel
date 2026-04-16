import { motion } from 'motion/react';
import { Clock, User, Home, Phone, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Complaint {
  id: string;
  studentName: string;
  roomNumber: string;
  contactNumber: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  submittedAt: string;
}

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusChange: (id: string, status: string) => void;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
};

export function ComplaintCard({ complaint, onStatusChange }: ComplaintCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                priorityColors[complaint.priority as keyof typeof priorityColors]
              }`}
            >
              {complaint.priority.toUpperCase()}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                statusColors[complaint.status as keyof typeof statusColors]
              }`}
            >
              {complaint.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          <h3 className="text-lg mb-1">{complaint.category}</h3>
         <div className="flex items-center gap-1 text-sm text-gray-600">
  <Clock className="w-3 h-3" />
  <span>
    {(() => {
      try {
        // 1. Create a date object, fallback to 'now' if missing
        const date = complaint.submittedAt ? new Date(complaint.submittedAt) : new Date();
        
        // 2. If the date is "Invalid", return a placeholder
        if (isNaN(date.getTime())) return 'Just now';

        // 3. Format it normally
        return formatDistanceToNow(date, { addSuffix: true });
      } catch (e) {
        return 'Just now';
      }
    })()}
  </span>
</div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{complaint.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
          <User className="w-4 h-4" />
          <span>{complaint.studentName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
          <Home className="w-4 h-4" />
          <span>Room {complaint.roomNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
          <Phone className="w-4 h-4" />
          <span>{complaint.contactNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
          <Tag className="w-4 h-4" />
          <span>ID: {complaint.id?.toString().slice(-6) || '...'}</span>
        </div>
      </div>

      {complaint.status !== 'resolved' && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {complaint.status === 'pending' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStatusChange(complaint.id, 'in-progress')}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-sm shadow-md"
            >
              Start Working
            </motion.button>
          )}
          {complaint.status === 'in-progress' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStatusChange(complaint.id, 'resolved')}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all text-sm shadow-md"
            >
              Mark Resolved
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}
