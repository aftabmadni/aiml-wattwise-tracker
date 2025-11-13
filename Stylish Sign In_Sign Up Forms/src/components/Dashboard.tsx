import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { LogOut, Zap, User, Mail, Calendar, Sparkles, Activity } from 'lucide-react';

interface DashboardProps {
  profile: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  onLogout: () => void;
}

export function Dashboard({ profile, onLogout }: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
            animate={{
              rotate: [0, 5, -5, 0],
              boxShadow: [
                '0 0 20px rgba(251, 191, 36, 0.5)',
                '0 0 40px rgba(251, 191, 36, 0.8)',
                '0 0 20px rgba(251, 191, 36, 0.5)',
              ],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity },
              boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-white">WattWise Tracker</h1>
            <p className="text-white/60">Energy Management Dashboard</p>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </motion.div>

      {/* Welcome Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-xl border-white/20 p-8 mb-6 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <div className="relative z-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Welcome back, {profile.name}!
              </h2>
              <p className="text-white/70">
                Track your energy consumption and make smarter decisions
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Profile Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* User Info Card */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, rotateY: 5 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 h-full">
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <User className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-white/60 mb-1">Full Name</p>
                <p className="text-white">{profile.name}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Email Card */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02, rotateY: -5 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 h-full">
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl flex items-center justify-center"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Mail className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-white/60 mb-1">Email Address</p>
                <p className="text-white break-all">{profile.email}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Account Created Card */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02, rotateY: 5 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 h-full">
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl flex items-center justify-center"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Calendar className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-white/60 mb-1">Member Since</p>
                <p className="text-white">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* User ID Card */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02, rotateY: -5 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 h-full">
            <div className="flex items-start gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Activity className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-white/60 mb-1">User ID</p>
                <p className="text-white text-xs break-all">{profile.id}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Feature Coming Soon Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-white/20 p-8 text-center relative overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <div className="relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </motion.div>
            <h3 className="text-white mb-2">Energy Tracking Dashboard</h3>
            <p className="text-white/70">
              Start tracking your energy consumption and monitor your usage patterns
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Floating energy particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 bg-yellow-400 rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}
