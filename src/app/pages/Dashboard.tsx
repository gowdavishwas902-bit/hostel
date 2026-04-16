import { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Clock, CheckCircle2, AlertCircle, Info, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ComplaintForm } from '../components/ComplaintForm';
import { ComplaintCard } from '../components/ComplaintCard';
import { MetricCard } from '../components/MetricCard';
import { motion, AnimatePresence } from 'motion/react';
import DynamicBackground from '../components/DynamicBackground';
import { supabase } from '../../lib/supabase';
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



export function Dashboard() {

  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    async function fetchComplaints() {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (data) {
        const formattedData = data.map((c: any) => ({
          ...c,
          studentName: c.student_name || 'Anonymous',
          roomNumber: c.room_number || 'N/A',
          contactNumber: c.contact_number || '',
          // This line ensures there is ALWAYS a date, even if the DB row is empty
          submittedAt: c.submitted_at ? new Date(c.submitted_at).toISOString() : new Date().toISOString()
        }));
        setComplaints(formattedData);
      }
      setLoading(false);
    }
    fetchComplaints();
  }, []);

  const handleSubmitComplaint = async (newComplaint: any) => {
    // 1. Send to Supabase
    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        student_name: newComplaint.studentName,
        room_number: newComplaint.roomNumber,
        contact_number: newComplaint.contactNumber,
        category: newComplaint.category,
        priority: newComplaint.priority,
        description: newComplaint.description,
        status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Save Error:', error.message);
      alert('Error: ' + error.message);
    } else if (data) {
      // 2. Add the real database row to your screen
      setComplaints([data[0], ...complaints]);
      setShowForm(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Update the status in Supabase
    const { error } = await supabase
      .from('complaints')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Update Error:', error.message);
    } else {
      // Update the screen locally
      setComplaints(
        complaints.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    }
  };

  const handleLogout = async() => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  // --- PASTE THE CODE BELOW THIS LINE ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your complaints...</p>
        </div>
      </div>
    );
  }
  // --- PASTE THE CODE ABOVE THIS LINE ---

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' || complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const metrics = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'pending').length,
    inProgress: complaints.filter((c) => c.status === 'in-progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DynamicBackground />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-white-600-3xl mb-2">Complaint Management</h1>
            <p className="text-white-600">Track and resolve hostel complaints efficiently</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-grey-600 hover:text-red-900 hover:bg-white/50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Total Complaints"
            value={metrics.total}
            icon={FileText}
            color="bg-blue-100 text-blue-600"
          />
          <MetricCard
            label="Pending"
            value={metrics.pending}
            icon={Clock}
            color="bg-yellow-100 text-yellow-600"
          />
          <MetricCard
            label="In Progress"
            value={metrics.inProgress}
            icon={AlertCircle}
            color="bg-orange-100 text-orange-600"
          />
          <MetricCard
            label="Resolved"
            value={metrics.resolved}
            icon={CheckCircle2}
            color="bg-green-100 text-green-600"
          />
        </div>



        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaints..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 appearance-none bg-white transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 appearance-none bg-white transition-all"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg"
              >
                <Plus className="w-5 h-5" />
                New Complaint
              </motion.button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-12 text-center shadow-lg">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No complaints found</p>
            </div>
          ) : (
            filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ComplaintCard
                  complaint={complaint}
                  onStatusChange={handleStatusChange}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <ComplaintForm
            onSubmit={handleSubmitComplaint}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>

  );
}

