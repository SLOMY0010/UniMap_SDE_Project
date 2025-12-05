import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Wrench,
  Cpu,
  Zap,
  Car,
  Building2,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EngineeringCampusProps {
  onBack: () => void;
}

const facilities = [
  {
    id: 'mechanical-lab',
    name: 'Mechanical Engineering Lab',
    description: 'Advanced manufacturing and materials testing facilities',
    icon: <Wrench className="text-primary" size={24} />,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwZW5naW5lZXJpbmclMjBsYWJ8ZW58MXx8fHwxNzU5ODU2NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Mon-Fri: 8:00-20:00',
    capacity: '80 students'
  },
  {
    id: 'computer-lab',
    name: 'Computer Science Lab',
    description: 'High-performance computing and software development',
    icon: <Cpu className="text-primary" size={24} />,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGxhYiUyMHVuaXZlcnNpdHl8ZW58MXx8fHwxNzU5ODU2NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Mon-Sun: 7:00-22:00',
    capacity: '120 students'
  },
  {
    id: 'electrical-lab',
    name: 'Electrical Engineering Lab',
    description: 'Circuit design, power systems, and electronics',
    icon: <Zap className="text-primary" size={24} />,
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwZW5naW5lZXJpbmclMjBsYWJ8ZW58MXx8fHwxNzU5ODU2NTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Mon-Fri: 8:00-19:00',
    capacity: '60 students'
  },
  {
    id: 'automotive-lab',
    name: 'Automotive Engineering Lab',
    description: 'Vehicle design, testing, and sustainable mobility',
    icon: <Car className="text-primary" size={24} />,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwZW5naW5lZXJpbmclMjBsYWJ8ZW58MXx8fHwxNzU5ODU2NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    hours: 'Mon-Fri: 9:00-18:00',
    capacity: '40 students'
  }
];

const departments = [
  {
    name: 'Mechanical Engineering',
    students: 420,
    programs: ['Manufacturing', 'Robotics', 'Materials Science']
  },
  {
    name: 'Computer Science',
    students: 680,
    programs: ['Software Engineering', 'AI & Machine Learning', 'Cybersecurity']
  },
  {
    name: 'Electrical Engineering',
    students: 340,
    programs: ['Power Systems', 'Electronics', 'Telecommunications']
  },
  {
    name: 'Automotive Engineering',
    students: 180,
    programs: ['Vehicle Design', 'Sustainable Mobility', 'Autonomous Systems']
  }
];

const quickStats = [
  { label: 'Total Students', value: '1,620', icon: <Users className="text-primary" size={20} /> },
  { label: 'Research Labs', value: '15', icon: <Building2 className="text-primary" size={20} /> },
  { label: 'Faculty Members', value: '85', icon: <GraduationCap className="text-primary" size={20} /> },
  { label: 'Active Projects', value: '42', icon: <Cpu className="text-primary" size={20} /> }
];

export default function EngineeringCampus({ onBack }: EngineeringCampusProps) {
  return (
    <div className="w-full">
      {/* Back Button */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted/50 rounded-lg"
        >
          <ArrowLeft size={20} />
          <span>Back to All Campuses</span>
        </button>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="border-b-2 border-dotted border-accent pb-4 mb-6">
          <h1 className="text-accent text-2xl">Engineering Campus</h1>
          <p className="text-muted-foreground mt-2">
            Advanced engineering education and research facilities
          </p>
        </div>

        {/* Campus Info */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-1" size={20} />
                <div>
                  <h3 className="text-foreground">Address</h3>
                  <p className="text-muted-foreground text-sm">
                    Technology Park 1, Debrecen<br />
                    4032 Hungary
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-primary mt-1" size={20} />
                <div>
                  <h3 className="text-foreground">Contact</h3>
                  <p className="text-muted-foreground text-sm">
                    +36 52 417 777<br />
                    engineering@unideb.hu
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="text-primary mt-1" size={20} />
                <div>
                  <h3 className="text-foreground">Operating Hours</h3>
                  <p className="text-muted-foreground text-sm">
                    Monday - Friday: 7:00 - 22:00<br />
                    Saturday: 8:00 - 18:00<br />
                    Sunday: 10:00 - 16:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-card rounded-lg p-4 border border-border shadow-sm text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-2xl text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Facilities */}
        <div className="xl:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl text-foreground mb-6">Research Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facilities.map((facility, index) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-48 overflow-hidden bg-muted">
                    <ImageWithFallback 
                      src={facility.image}
                      alt={facility.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {facility.icon}
                      <h3 className="text-foreground">{facility.name}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {facility.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{facility.hours}</span>
                      <span>{facility.capacity}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-xl p-6 border border-border shadow-sm"
          >
            <h3 className="text-lg text-foreground mb-4">Departments</h3>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <div key={index} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-foreground text-sm">{dept.name}</h4>
                    <span className="text-primary text-sm">{dept.students} students</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dept.programs.map((program, idx) => (
                      <span key={idx} className="bg-muted px-2 py-1 rounded text-xs text-muted-foreground">
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Campus News */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-card rounded-xl p-6 border border-border shadow-sm"
          >
            <h3 className="text-lg text-foreground mb-4">Recent Updates</h3>
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-sm text-primary mb-1">New Equipment</div>
                <div className="text-xs text-muted-foreground">3D printing lab expansion completed</div>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-sm text-accent-foreground mb-1">Research Grant</div>
                <div className="text-xs text-muted-foreground">€2M funding for renewable energy project</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-foreground mb-1">Student Achievement</div>
                <div className="text-xs text-muted-foreground">Engineering team wins national competition</div>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-card rounded-xl p-6 border border-border shadow-sm"
          >
            <h3 className="text-lg text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors">
                Lab Reservations
              </button>
              <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors">
                Equipment Manual
              </button>
              <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors">
                Safety Guidelines
              </button>
              <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors">
                Project Portal
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}