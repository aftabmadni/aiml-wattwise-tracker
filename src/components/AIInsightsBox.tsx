// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { AIInsight } from "../lib/types";
// import {
//   Brain,
//   AlertTriangle,
//   Lightbulb,
//   Trophy,
//   AlertCircle,
//   ChevronRight,
//   X,
// } from "lucide-react";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { formatRelativeTime } from "../lib/formatters";

// interface AIInsightsBoxProps {
//   insights: AIInsight[];
//   onMarkAsRead: (insightId: string) => void;
// }

// export const AIInsightsBox: React.FC<AIInsightsBoxProps> = ({
//   insights,
//   onMarkAsRead,
// }) => {
//   const [expandedId, setExpandedId] = useState<string | null>(null);

//   const getIcon = (type: AIInsight["type"]) => {
//     switch (type) {
//       case "warning":
//         return AlertTriangle;
//       case "tip":
//         return Lightbulb;
//       case "achievement":
//         return Trophy;
//       case "anomaly":
//         return AlertCircle;
//     }
//   };

//   const getColorScheme = (type: AIInsight["type"]) => {
//     switch (type) {
//       case "warning":
//         return {
//           bg: "bg-red-50",
//           border: "border-red-200",
//           icon: "text-red-600",
//           badge: "bg-red-100 text-red-700",
//         };
//       case "tip":
//         return {
//           bg: "bg-blue-50",
//           border: "border-blue-200",
//           icon: "text-blue-600",
//           badge: "bg-blue-100 text-blue-700",
//         };
//       case "achievement":
//         return {
//           bg: "bg-green-50",
//           border: "border-green-200",
//           icon: "text-green-600",
//           badge: "bg-green-100 text-green-700",
//         };
//       case "anomaly":
//         return {
//           bg: "bg-orange-50",
//           border: "border-orange-200",
//           icon: "text-orange-600",
//           badge: "bg-orange-100 text-orange-700",
//         };
//     }
//   };

//   const getPriorityBadge = (priority: AIInsight["priority"]) => {
//     const variants = {
//       high: "destructive",
//       medium: "default",
//       low: "secondary",
//     };
//     return variants[priority] as any;
//   };

//   // Show only unread insights, top 3
//   const displayInsights = insights
//     .filter(
//       (i) =>
//         !i.read &&
//         i.title !== "7-Day Saving Streak!" &&
//         i.type !== "achievement"
//     )
//     .map((insight) => {
//       // Fix expanded washing machine insight to show correct info
//       if (
//         insight.title === "Washing Machine Usage Timing" &&
//         insight.actionable
//       ) {
//         return {
//           ...insight,
//           action: "View washing machine schedule suggestions",
//         };
//       }
//       return insight;
//     })
//     .slice(0, 3);

//   return (
//     <Card className="w-full" style={{ width: "100%" }}>
//   <CardHeader>
//     <div className="flex items-start justify-between">
//       <div>
//         <CardTitle className="flex items-center gap-2">
//           <Brain className="w-5 h-5 text-purple-600" />
//           Electricity Usage Tracker – Powering a Sustainable Future
//         </CardTitle>
//         <CardDescription>
//           A modern initiative designed to make every household an active
//           participant in energy conservation.
//         </CardDescription>
//       </div>
//       <Badge variant="outline" className="gap-1">
//         <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
//         Active Project
//       </Badge>
//     </div>
//   </CardHeader>

//   <CardContent className="space-y-4">
//     <div className="text-gray-700 text-sm leading-relaxed">
//       <p>
//         <strong>Electricity Usage Tracker</strong> is more than a monitoring tool —
//         it’s a step toward transforming how individuals and communities understand
//         and manage energy. In today’s world, where energy demand is rapidly rising,
//         inefficient usage directly contributes to environmental degradation,
//         increased carbon emissions, and rising electricity costs.
//       </p>

//       <p className="mt-3">
//         This project identifies <strong>real-world problems</strong> such as:
//       </p>
//       <ul className="list-disc list-inside mt-2 space-y-1">
//         <li>Unawareness of real-time appliance-level power consumption.</li>
//         <li>Wastage of electricity due to standby loads and inefficient scheduling.</li>
//         <li>Difficulty in understanding usage patterns and predicting monthly costs.</li>
//         <li>Lack of actionable insights to promote responsible energy consumption.</li>
//       </ul>

//       <p className="mt-3">
//         Our system uses smart data tracking and intuitive visualization to help
//         users monitor their daily consumption, identify energy-hungry appliances,
//         and adopt efficient habits. By integrating analytics, it enables
//         <strong> household-level decision-making </strong> for sustainable living.
//       </p>

//       <p className="mt-3">
//         <strong>How it helps the current generation and society:</strong>
//       </p>
//       <ul className="list-disc list-inside mt-2 space-y-1">
//         <li>
//           Encourages <strong>energy literacy</strong> by showing users how their
//           actions impact both costs and the environment.
//         </li>
//         <li>
//           Reduces unnecessary consumption, helping to
//           <strong> lower carbon footprints</strong>.
//         </li>
//         <li>
//           Promotes the use of renewable energy by providing time-based usage
//           optimization.
//         </li>
//         <li>
//           Helps cities and institutions build <strong>data-driven energy policies</strong>.
//         </li>
//       </ul>

//       <p className="mt-3">
//         In essence, this project bridges the gap between
//         <strong> technology and sustainability </strong>. By using intelligent
//         monitoring and predictive analytics, the Electricity Usage Tracker empowers
//         individuals to take control of their energy footprint and collectively move
//         toward a more <strong>eco-efficient future</strong>.
//       </p>
//     </div>

//     <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
//       <div className="flex items-start gap-2">
//         <Brain className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
//         <p className="text-xs text-gray-700">
//           <strong>About the Project:</strong> The Electricity Usage Tracker is
//           designed to analyze consumption trends, provide personalized feedback, and
//           foster a culture of energy efficiency. It transforms raw energy data into
//           meaningful insights — turning awareness into action and ensuring a
//           brighter, more sustainable tomorrow.
//         </p>
//       </div>
//     </div>
//   </CardContent>
// </Card>

//   );
// };


// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Brain, ChevronLeft, ChevronRight, Info } from "lucide-react";
// import { Badge } from "./ui/badge";
// import { motion, AnimatePresence } from "framer-motion";

// export const AIInsightsBox: React.FC = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [showFullScreen, setShowFullScreen] = useState(false);

//   const slides = [
//     {
//       title: "Electricity Usage Tracker – Powering a Sustainable Future",
//       content: (
//         <>
//           <p className="text-sm text-gray-700 leading-relaxed">
//             <strong>Electricity Usage Tracker</strong> is a smart solution that
//             helps users monitor and optimize household energy consumption.
//             Rising demand and inefficiency in electricity usage contribute to
//             global warming, high energy bills, and unnecessary load on power
//             grids.
//           </p>
//           <ul className="list-disc list-inside mt-3 text-sm text-gray-700 space-y-1">
//             <li>Identifies high-energy appliances in real time.</li>
//             <li>Predicts monthly usage and potential cost spikes.</li>
//             <li>Suggests efficiency improvements dynamically.</li>
//           </ul>
//         </>
//       ),
//     },
//     {
//       title: "Current Challenges in Electricity Management",
//       content: (
//         <>
//           <p className="text-sm text-gray-700 leading-relaxed">
//             Modern society faces severe challenges related to energy usage:
//           </p>
//           <ul className="list-disc list-inside mt-3 text-sm text-gray-700 space-y-1">
//             <li>Over-reliance on non-renewable energy sources.</li>
//             <li>Lack of awareness of appliance-level consumption.</li>
//             <li>
//               Unoptimized peak-hour usage leading to unstable power distribution.
//             </li>
//             <li>Rising carbon footprints due to inefficient demand response.</li>
//           </ul>
//           <p className="mt-3 text-sm text-gray-700">
//             Our tracker aims to build awareness and promote data-driven
//             behavioral changes to achieve energy balance.
//           </p>
//         </>
//       ),
//     },
//     {
//       title: "Mathematical Modeling & Predictive System",
//       content: (
//         <>
//           <p className="text-sm text-gray-700 leading-relaxed">
//             The system uses regression-based AI models to predict energy
//             consumption:
//           </p>
//           <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
//             <code className="text-xs text-gray-800 block">
//               E(t) = α × P(t) + β × U(t) + γ × C(t) + ε
//             </code>
//             <p className="text-xs text-gray-600 mt-1">
//               Where:
//               <br />
//               • E(t): Expected energy usage at time t
//               <br />
//               • P(t): Power load pattern
//               <br />
//               • U(t): Appliance usage probability
//               <br />
//               • C(t): Cost prediction coefficient
//               <br />
//               • ε: Model error term
//             </p>
//           </div>
//           <p className="mt-3 text-sm text-gray-700">
//             The tracker combines this model with real-time IoT sensor data to
//             forecast electricity needs and help users optimize consumption.
//           </p>
//         </>
//       ),
//     },
//   ];

//   const handleNext = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const handlePrev = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   return (
//     <>
//       {/* Glass Styled Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         <Card className="relative w-full overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 backdrop-blur-md">
//           <CardHeader>
//             <div className="flex items-start justify-between">
//               <div>
//                 <CardTitle className="flex items-center gap-2 text-lg font-semibold">
//                   <Brain className="w-5 h-5 text-purple-600" />
//                   {slides[currentSlide].title}
//                 </CardTitle>
//                 <CardDescription>
//                   Swipe through to explore how technology, sustainability, and
//                   AI intersect in energy management.
//                 </CardDescription>
//               </div>
//               <Badge variant="outline" className="gap-1">
//                 <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
//                 Active
//               </Badge>
//             </div>
//           </CardHeader>

//           <CardContent className="relative h-[260px] flex flex-col justify-between">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentSlide}
//                 initial={{ opacity: 0, x: 100 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -100 }}
//                 transition={{ duration: 0.6 }}
//                 className="flex-1"
//               >
//                 {slides[currentSlide].content}
//               </motion.div>
//             </AnimatePresence>

//             <div className="flex justify-between items-center mt-4">
//               <button
//                 onClick={handlePrev}
//                 className="p-2 rounded-full hover:bg-white border transition-all"
//               >
//                 <ChevronLeft className="w-5 h-5 text-gray-700" />
//               </button>
//               <button
//                 onClick={() => setShowFullScreen(true)}
//                 className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg flex items-center gap-1 shadow hover:bg-purple-700 transition"
//               >
//                 <Info className="w-4 h-4" />
//                 Learn More
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="p-2 rounded-full hover:bg-white border transition-all"
//               >
//                 <ChevronRight className="w-5 h-5 text-gray-700" />
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Full-Screen Info Modal */}
//       <AnimatePresence>
//         {showFullScreen && (
//           <motion.div
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.5 }}
//               className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 overflow-y-auto max-h-[90vh]"
//             >
//               <h2 className="text-xl font-bold text-purple-700 mb-3">
//                 Deeper Insights: The Future of Smart Energy Analytics
//               </h2>
//               <p className="text-sm text-gray-700 leading-relaxed">
//                 Electricity is the backbone of modern civilization. However,
//                 with urban growth and the rise of electric mobility, balancing
//                 energy demand and sustainability has become crucial. Our tracker
//                 integrates mathematical forecasting, IoT sensors, and machine
//                 learning to optimize energy use.
//               </p>
//               <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-4 rounded-lg">
//                 <p className="text-sm text-gray-700 font-semibold">
//                   Predictive Model Equation:
//                 </p>
//                 <code className="block text-xs mt-1 text-gray-800">
//                   P<sub>predicted</sub> = Σ (W<sub>i</sub> × F<sub>i</sub>(t)) + δ
//                 </code>
//                 <p className="text-xs text-gray-600 mt-2">
//                   Here, F<sub>i</sub>(t) are temporal features (hour, day, usage
//                   frequency), and W<sub>i</sub> are learned weights obtained via
//                   gradient descent optimization minimizing:
//                 </p>
//                 <code className="block text-xs mt-1 text-gray-800">
//                   Loss = (P<sub>actual</sub> − P<sub>predicted</sub>)²
//                 </code>
//               </div>
//               <p className="mt-3 text-sm text-gray-700">
//                 This approach improves electricity forecasting accuracy and
//                 enables real-time anomaly detection in power usage.
//               </p>

//               <button
//                 onClick={() => setShowFullScreen(false)}
//                 className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
//               >
//                 Close
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };



import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AIInsight } from "../lib/types";
import {
  Brain,
  AlertTriangle,
  Lightbulb,
  Trophy,
  AlertCircle,
  ChevronRight,
  X,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Info,
  BarChart3,
  Cpu,
  Shield,
  Calculator,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatRelativeTime } from "../lib/formatters";
import { motion, AnimatePresence } from "framer-motion";

interface AIInsightsBoxProps {
  insights: AIInsight[];
  onMarkAsRead: (insightId: string) => void;
}

export const AIInsightsBox: React.FC<AIInsightsBoxProps> = ({
  insights,
  onMarkAsRead,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Slide data configuration
  const slides = [
    {
      id: "slide-1",
      title: "Real-time Monitoring",
      content: "Track appliance-level consumption with live data streaming",
      color: "from-blue-500 to-purple-600",
      icon: BarChart3
    },
    {
      id: "slide-2", 
      title: "AI Predictions",
      content: "35% accuracy with confidence intervals for monthly forecasts",
      color: "from-green-500 to-teal-600",
      icon: Brain
    },
    {
      id: "slide-3",
      title: "Cost Analysis",
      content: "Understand your spending patterns and optimize savings",
      color: "from-orange-500 to-red-600",
      icon: Calculator
    },
    {
      id: "slide-4",
      title: "Sustainability Score",
      content: "Measure your environmental impact in real-time",
      color: "from-purple-500 to-pink-600",
      icon: Trophy
    }
  ];

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4000);

    return () => clearInterval(slideInterval);
  }, [autoPlay, slides.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  // Icon mapping function
  const getIcon = (type: AIInsight["type"]) => {
    const iconMap = {
      warning: AlertTriangle,
      tip: Lightbulb,
      achievement: Trophy,
      anomaly: AlertCircle
    };
    return iconMap[type];
  };

  // Color scheme mapping function
  const getColorScheme = (type: AIInsight["type"]) => {
    const colorSchemes = {
      warning: {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "text-red-600",
        badge: "bg-red-100 text-red-700",
      },
      tip: {
        bg: "bg-blue-50", 
        border: "border-blue-200",
        icon: "text-blue-600",
        badge: "bg-blue-100 text-blue-700",
      },
      achievement: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        badge: "bg-green-100 text-green-700",
      },
      anomaly: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "text-orange-600",
        badge: "bg-orange-100 text-orange-700",
      }
    };
    return colorSchemes[type];
  };

  // Priority badge mapping function - FIXED
  const getPriorityBadge = (priority: AIInsight["priority"]) => {
    const priorityVariants = {
      high: "destructive",
      medium: "default", 
      low: "secondary"
    };
    return priorityVariants[priority];
  };

  // Filter and process insights
  const displayInsights = insights
    .filter((insight) => 
      !insight.read &&
      insight.title !== "7-Day Saving Streak!" &&
      insight.type !== "achievement"
    )
    .map((insight) => {
      if (insight.title === "Washing Machine Usage Timing" && insight.actionable) {
        return {
          ...insight,
          action: "View washing machine schedule suggestions",
        };
      }
      return insight;
    })
    .slice(0, 3);

  // Full screen toggle
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={`space-y-6 ${isFullScreen ? "fixed inset-0 z-50 bg-white p-4 overflow-auto" : ""}`}>
      {/* Main Card with Enhanced Styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={isFullScreen ? "h-full" : ""}
      >
        <Card className={`w-full bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-2xl relative overflow-hidden ${
          isFullScreen ? "h-full" : ""
        }`}>
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-100 to-blue-100 rounded-full -translate-y-32 translate-x-32 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100 to-teal-100 rounded-full translate-y-24 -translate-x-24 opacity-40"></div>
          
          {/* Header with Full Screen Control */}
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-8 h-8 text-purple-600" />
                  </motion.div>
                  Electricity Usage Tracker – Powering a Sustainable Future
                </CardTitle>
                <CardDescription className="text-lg mt-2 text-gray-600">
                  A modern initiative designed to make every household an active
                  participant in energy conservation.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge variant="outline" className="gap-2 px-4 py-2 border-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    Active Project
                  </Badge>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFullScreen}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Slider Section */}
            <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800">
              <AnimatePresence mode="wait" custom={1}>
                <motion.div
                  key={currentSlide}
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].color} flex items-center justify-center text-white p-8`}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      {React.createElement(slides[currentSlide].icon, { className: "w-12 h-12 text-white opacity-90" })}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{slides[currentSlide].title}</h3>
                    <p className="text-lg opacity-90">{slides[currentSlide].content}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full p-2 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full p-2 transition-all duration-200"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.button>

              {/* Auto-play Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.5)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAutoPlay(!autoPlay)}
                className="absolute top-4 right-4 bg-black/30 rounded-full p-2 transition-all duration-200"
              >
                {autoPlay ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
              </motion.button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Challenge Section */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">The Challenge</h3>
                  <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                    <p>
                      <strong>Electricity Usage Tracker</strong> is more than a monitoring tool —
                      it's a step toward transforming how individuals and communities understand
                      and manage energy.
                    </p>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <strong>Real-world problems we solve:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>Unawareness of real-time appliance-level power consumption</li>
                        <li>Wastage due to standby loads and inefficient scheduling</li>
                        <li>Difficulty in understanding usage patterns and predicting costs</li>
                        <li>Lack of actionable insights for responsible consumption</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-4 mt-6"
                >
                  {/* <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-green-600">46.8 kWh</div>
                    <div className="text-sm text-gray-600">Current Usage</div>
                  </div> */}
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                    <div className="text-2xl font-bold text-blue-600">12.5%</div>
                    <div className="text-sm text-gray-600">Expected Savings</div>
                  </div>
                </motion.div>
              </div>

              {/* Solution Section */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Solution</h3>
                  <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                    <p>
                      Our system uses smart data tracking and intuitive visualization to help
                      users monitor consumption and adopt efficient habits.
                    </p>

                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                      <strong>Benefits for society:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>Encourages <strong>energy literacy</strong> and awareness</li>
                        <li>Reduces carbon footprints through optimized usage</li>
                        <li>Promotes renewable energy integration</li>
                        <li>Supports data-driven energy policies</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons with Hover Effects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3 mt-6 text-black"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgb(126, 34, 206)",
                      backgroundImage: "linear-gradient(to right, rgb(126, 34, 206), rgb(37, 99, 235))"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInfoModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-black px-6 py-3 rounded-lg font-medium transition-all duration-200 group"
                  >
                    <Info className="w-4 h-4 text-black" />
                    <span className="text-black">Technical Details</span>
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  {/* <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgb(243, 244, 246)",
                      borderColor: "rgb(107, 114, 128)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 group"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Analytics
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button> */}
                </motion.div>
              </div>
            </div>

            {/* AI Insights Preview
            {displayInsights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Insights</h3>
                <div className="grid gap-3">
                  {displayInsights.map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                    >
                      <Card className={`border-l-4 ${
                        insight.type === 'warning' ? 'border-l-red-400' :
                        insight.type === 'tip' ? 'border-l-blue-400' :
                        insight.type === 'anomaly' ? 'border-l-orange-400' : 'border-l-green-400'
                      } hover:shadow-md transition-shadow`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {React.createElement(getIcon(insight.type), {
                                className: `w-5 h-5 ${
                                  insight.type === 'warning' ? 'text-red-600' :
                                  insight.type === 'tip' ? 'text-blue-600' :
                                  insight.type === 'anomaly' ? 'text-orange-600' : 'text-green-600'
                                }`
                              })}
                              <span className="font-medium">{insight.title}</span>
                            </div>
                            <Badge variant={getPriorityBadge(insight.priority) as any}>
                              {insight.priority}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )} */}
          </CardContent>
        </Card>
      </motion.div>

      {/* Information Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Technical Implementation</h2>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgb(243, 244, 246)" }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg transition-colors"
                  onClick={() => setShowInfoModal(false)}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Security Challenges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-600" />
                        Security Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-gray-700">
                        <strong>Current Security Problems:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Data privacy and user information protection</li>
                          <li>Secure real-time data transmission</li>
                          <li>Prevention of unauthorized access to energy controls</li>
                          <li>Encryption of sensitive consumption patterns</li>
                        </ul>
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>Solutions Implemented:</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>End-to-end encryption using AES-256</li>
                          <li>OAuth 2.0 for secure authentication</li>
                          <li>Regular security audits and penetration testing</li>
                          <li>GDPR-compliant data handling</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Mathematical Models */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-green-600" />
                        Predictive Models
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-gray-700">
                        <strong>Time Series Forecasting (ARIMA):</strong>
                        <div className="bg-gray-50 p-3 rounded-lg mt-2 font-mono text-xs">
                          Xₜ = c + Σ(φᵢXₜ₋ᵢ) + Σ(θⱼεₜ₋ⱼ) + εₜ
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>Energy Consumption Prediction:</strong>
                        <div className="bg-gray-50 p-3 rounded-lg mt-2 font-mono text-xs">
                          Ê = β₀ + β₁T + β₂H + β₃D + ε
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>Cost Optimization:</strong>
                        <div className="bg-gray-50 p-3 rounded-lg mt-2 font-mono text-xs">
                          min Σ(Pₜ × Cₜ) subject to Eₜ ≤ Eₘₐₓ
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* System Architecture */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-2"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-blue-600" />
                        System Architecture & Machine Learning Pipeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-700 space-y-4">
                        <div>
                          <strong>Data Collection Layer:</strong>
                          <p>Real-time streaming from smart meters and IoT sensors</p>
                        </div>
                        <div>
                          <strong>Processing Pipeline:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Apache Kafka for data ingestion</li>
                            <li>Apache Spark for real-time processing</li>
                            <li>TensorFlow for ML model serving</li>
                          </ul>
                        </div>
                        <div>
                          <strong>ML Models Used:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>LSTM networks for time series prediction</li>
                            <li>Random Forest for anomaly detection</li>
                            <li>K-means clustering for usage pattern analysis</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};