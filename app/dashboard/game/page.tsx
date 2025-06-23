/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Orbit,
  Coins,
  Package,
  Battery,
  Rocket,
  Wrench,
  Radar,
  ShieldPlus,
  CircleGauge,
  Percent,
  Menu,
  Volume2,
  HelpCircle,
  X,
  CircleArrowLeft,
  House,
} from "lucide-react";

import { COLORS } from "@/lib/constants";
import { Asteroid, Bubble, Stats } from "@/types";
import Link from "next/link";

export type UpgradeKey = (typeof UPGRADES)[number]["key"];
export type UpgradesState = Record<UpgradeKey, number>;
// Upgrade definitions
const UPGRADES = [
  {
    key: "droneEfficiency",
    label: "Drone Efficiency",
    desc: "Boost resource collection speed",
    color: COLORS.neonGreen,
    max: 10,
    icon: <Rocket className="w-6 h-6" />,
    costBase: 120,
  },
  {
    key: "cargoCapacity",
    label: "Cargo Capacity",
    desc: "Increase minerals per mining",
    color: COLORS.neonBlue,
    max: 10,
    icon: <Package className="w-6 h-6" />,
    costBase: 120,
  },
  {
    key: "energyCells",
    label: "Energy Cells",
    desc: "Improve energy regeneration",
    color: COLORS.neonMagenta,
    max: 10,
    icon: <Battery className="w-6 h-6" />,
    costBase: 120,
  },
  {
    key: "autoRepair",
    label: "Auto-Repair",
    desc: "Reduce energy decay",
    color: COLORS.neonBlue,
    max: 5,
    icon: <Wrench className="w-6 h-6" />,
    costBase: 150,
  },
  {
    key: "scanSpeed",
    label: "Scan Speed",
    desc: "Faster tier progression",
    color: COLORS.neonGreen,
    max: 7,
    icon: <Radar className="w-6 h-6" />,
    costBase: 130,
  },
] as const;

// Asteroid definitions
const ASTEROIDS: Asteroid[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  mineral: ["Iridium", "Platinum", "Nickel", "Palladium"][i % 4],
  richness: Math.floor(50 + Math.random() * 200),
  tapped: false,
  color: [COLORS.neonGreen, COLORS.neonBlue, COLORS.neonMagenta, COLORS.fg][
    i % 4
  ],
}));

// Initial state
const initialStats: Stats = { credits: 1000, minerals: 0, energy: 100 };
const initialUpgrades: UpgradesState = UPGRADES.reduce(
  (obj, up) => ({ ...obj, [up.key]: 0 }),
  {} as UpgradesState
);

// Subcomponents
const StatBadge: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div
    className="h-8 flex items-center gap-2 p-2 border-1 rounded bg-bg"
    style={{ borderColor: color }}
    aria-label={`${label}: ${value}`}
  >
    {icon}
    <span style={{ color }} className="font-light">
      {value}
    </span>
  </div>
);

const HowToPlayPopup: React.FC<{
  popoverRef: React.RefObject<HTMLDivElement>;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ popoverRef, setIsPopoverOpen }) => {
  return (
    <div
      ref={popoverRef}
      className="scrollable absolute -top-12 -right-0 max-w-64 max-h-screen overflow-y-auto p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50"
    >
      <div className="scrollable">
        <div className="flex items-center justify-between ">
          <h2 className="text-sm font-light mb-2 text-blue-400">
            How to Play SpacMiner
          </h2>
          <button
            onClick={() => setIsPopoverOpen(false)}
            className="text-gray-400 hover:text-gray-200 cursor-pointer"
            title="Close button"
          >
            <X size={14} className=" text-blue-500 hover:text-blue-300 mx-2" />
          </button>
        </div>
        <p className="text-sm font-light mb-4 text-gray-700 dark:text-gray-300">
          Welcome to SpacMiner! Your goal is to mine asteroids for resources,
          upgrade your equipment, and progress through tiers.
        </p>
        <ul className="text-xs font-light list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          <li>
            Click on asteroids to mine them and gain minerals and credits.
          </li>
          <li>Use credits to purchase upgrades in the sidebar.</li>
          <li>
            Adjust resource allocation to balance between drones and storage.
          </li>
          <li>Progress through tiers by collecting resources and upgrading.</li>
        </ul>
      </div>
    </div>
  );
};

const UpgradeLevelBar: React.FC<{
  value: number;
  max: number;
  color: string;
}> = ({ value, max, color }) => (
  <div className="w-full h-2 bg-inactive mt-2 rounded">
    <motion.div
      className="h-full rounded"
      style={{ backgroundColor: color, width: `${(value / max) * 100}%` }}
      transition={{ duration: 0.3 }}
    />
  </div>
);

const UpgradeItem: React.FC<{
  upgrade: (typeof UPGRADES)[number];
  level: number;
  onUpgrade: () => void;
  canAfford: boolean;
  isMaxed: boolean;
}> = ({ upgrade, level, onUpgrade, canAfford, isMaxed }) => {
  const cost = upgrade.costBase * (level + 1);
  return (
    <div
      className="p-4 bg-bg flex flex-col justify-between"
      style={{ border: `1px solid ${upgrade.color}` }}
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          {upgrade.icon}
          <h3 className="font-light text-lg" style={{ color: upgrade.color }}>
            {upgrade.label}
          </h3>
        </div>
        <p className="text-sm text-gray-300">{upgrade.desc}</p>
        <p className="text-xs mt-1">Cost: {cost} Credits</p>
      </div>
      <div>
        <UpgradeLevelBar
          value={level}
          max={upgrade.max}
          color={upgrade.color}
        />
        <motion.button
          onClick={onUpgrade}
          disabled={!canAfford || isMaxed}
          className={`mt-3 w-full p-2 border-1 text-sm font-normal uppercase tracking-wide ${
            canAfford && !isMaxed
              ? "hover:bg-neonMagenta hover:text-black cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }`}
          style={{ borderColor: upgrade.color }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Upgrade ${upgrade.label}`}
        >
          {isMaxed ? "Maxed" : "Upgrade"}
        </motion.button>
      </div>
    </div>
  );
};

const StatsHeader: React.FC<{ stats: Stats }> = ({ stats }) => (
  <div className="h-12 flex items-center px-4 gap-3 transition-colors duration-200 bg-gray-800/70 border-gray-700 backdrop-blur-sm border-b">
    <StatBadge
      icon={<Coins size={16} className="mr-1 text-blue-500" />}
      label="Credits"
      value={Math.floor(stats.credits)}
      color={COLORS.neonGreen}
    />
    <StatBadge
      icon={<Package size={16} className="mr-1 text-green-500" />}
      label="Minerals"
      value={Math.floor(stats.minerals)}
      color={COLORS.neonBlue}
    />
    <StatBadge
      icon={<Battery size={16} className="mr-1 text-green-500" />}
      label="Energy"
      value={Math.floor(stats.energy)}
      color={COLORS.neonMagenta}
    />
    <span className="sr-only" aria-live="polite">
      Credits: {Math.floor(stats.credits)}, Minerals:{" "}
      {Math.floor(stats.minerals)}, Energy: {Math.floor(stats.energy)}
    </span>
  </div>
);

const Sidebar: React.FC<{
  upgrades: UpgradesState;
  stats: Stats;
  resourceAlloc: number;
  setResourceAlloc: (value: number) => void;
  tier: number;
  tierProgress: number;
  isSideBarOpen: boolean;
  handleUpgrade: (key: UpgradeKey) => void;
  soundVolume: number;
  setSoundVolume: (value: number) => void;
}> = ({
  upgrades,
  stats,
  resourceAlloc,
  setResourceAlloc,
  tier,
  tierProgress,
  isSideBarOpen,
  handleUpgrade,
  soundVolume,
  setSoundVolume,
}) => (
  <div
    className={`${
      isSideBarOpen ? "translate-x-0" : "-translate-x-full"
    } fixed top-12 left-0 z-50 w-64 h-[calc(100%-3rem)] transition-transform duration-300 md:translate-x-0 md:static  md:h-full md:z-auto`}
  >
    <div className="scrollable w-full h-full p-4 bg-gray-800/50 border-gray-700 backdrop-blur-sm border-r overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium mb-3 uppercase tracking-wider text-gray-500 flex items-center">
          <ShieldPlus size={16} className="mr-2 text-blue-500" />
          Upgrades
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {UPGRADES.map((up) => {
          const level = upgrades[up.key];
          const cost = up.costBase * (level + 1);
          const canAfford = stats.credits >= cost;
          const isMaxed = level >= up.max;
          return (
            <UpgradeItem
              key={up.key}
              upgrade={up}
              level={level}
              onUpgrade={() => handleUpgrade(up.key)}
              canAfford={canAfford}
              isMaxed={isMaxed}
            />
          );
        })}
      </div>
      {/* Sound Volume Control Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <label
            id="sound-volume-label"
            className="text-sm font-medium mb-3 uppercase tracking-wider text-gray-500 flex items-center"
          >
            <Volume2 size={16} className="mr-2 text-blue-500" />
            Sound Volume
          </label>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            value={soundVolume * 100}
            onChange={(e) => setSoundVolume(Number(e.target.value) / 100)}
            className="w-full h-2 bg-blue-500 rounded-full cursor-pointer focus:outline-none focus:ring-0 focus:ring-blue-400"
            aria-labelledby="sound-volume-label"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={soundVolume * 100}
            aria-valuetext={`${Math.round(soundVolume * 100)}%`}
          />
        </div>
        <p className="text-center mt-3 text-xs">
          Volume:{" "}
          <span className="mx-1 text-blue-500">
            {Math.round(soundVolume * 100)}%
          </span>
        </p>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <label
            id="resource-allocation-label"
            className="text-sm font-medium mb-3 uppercase tracking-wider text-gray-500 flex items-center"
          >
            <Percent size={16} className="mr-2 text-blue-500" />
            Resource Allocation
          </label>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={10}
            max={90}
            value={resourceAlloc}
            onChange={(e) => setResourceAlloc(Number(e.target.value))}
            className="w-full h-2 bg-blue-500 rounded-full cursor-pointer focus:outline-none focus:ring-0 focus:ring-blue-400"
            aria-labelledby="resource-allocation-label"
            aria-valuemin={10}
            aria-valuemax={90}
            aria-valuenow={resourceAlloc}
            aria-valuetext={`${resourceAlloc}% Drones / ${
              100 - resourceAlloc
            }% Storage`}
          />
        </div>
        <p className="text-center mt-3 text-xs">
          Allocating{" "}
          <span className="mx-1 text-blue-500">{resourceAlloc}%</span> to drones
          (credits) and
          <span className="mx-1 text-blue-500">{100 - resourceAlloc}%</span> to
          storage (minerals)
        </p>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium mb-3 uppercase tracking-wider text-gray-500 flex items-center">
            <CircleGauge size={16} className="mr-2 text-blue-500" />
            Tier Level: <span className="mx-1 text-blue-500">{tier}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div
            role="progressbar"
            aria-valuenow={tierProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tier progress"
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-purple-600 dark:bg-purple-500 rounded-full"
              style={{ width: `${Math.min(tierProgress, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Bubble Component
const BubbleComponent: React.FC<{ bubble: Bubble }> = ({ bubble }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      backgroundColor: bubble.color,
      width: bubble.size,
      height: bubble.size,
      left: bubble.left,
      top: bubble.top,
    }}
    initial={{ opacity: 1, top: bubble.top }}
    animate={{ opacity: 0, top: "0%" }}
    transition={{ duration: bubble.duration, ease: "easeOut" }}
  />
);

// AsteroidBelt Component
const AsteroidBelt: React.FC<{
  asteroids: Asteroid[];
  onAsteroidTap: (id: number) => void;
  bubbles: Bubble[];
}> = ({ asteroids, onAsteroidTap, bubbles }) => {
  const time = useMotionValue(0);
  useEffect(() => {
    const animation = animate(time, 2 * Math.PI, {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    });
    return () => animation.stop();
  }, [time]);

  return (
    <div className="relative w-full max-w-2xl aspect-[4/3]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
        <ellipse
          cx="200"
          cy="150"
          rx="180"
          ry="80"
          stroke="#555555"
          fill="none"
          strokeWidth="2"
          strokeDasharray="8 12"
        />
      </svg>
      <div className="absolute inset-0">
        {asteroids.map((ast, idx) => {
          const offset = (2 * Math.PI * idx) / asteroids.length;
          const left = useTransform(
            time,
            (t) => `${50 + 45 * Math.cos(t + offset)}%`
          );
          const top = useTransform(
            time,
            (t) => `${50 + 27 * Math.sin(t + offset)}%`
          );
          return (
            <motion.button
              type="button"
              key={ast.id}
              onClick={() => {
                requestAnimationFrame(() => onAsteroidTap(ast.id));
              }}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && onAsteroidTap(ast.id)
              }
              disabled={ast.tapped}
              className={`absolute w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-light border-2 focus:outline-none focus:ring-2 focus:ring-neonMagenta transform -translate-x-1/2 -translate-y-1/2 will-change-transform ${
                ast.tapped
                  ? "bg-inactive border-inactive cursor-not-allowed"
                  : "bg-bg cursor-pointer"
              }`}
              style={{
                left,
                top,
                borderColor: ast.color,
                boxShadow: ast.tapped ? "none" : `0 0 12px ${ast.color}`,
                pointerEvents: "auto",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={ast.tapped ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={
                ast.tapped ? { repeat: Infinity, duration: 1 } : undefined
              }
              aria-label={`Mine ${ast.mineral} asteroid`}
            >
              {ast.tapped ? (
                <span className="text-neonMagenta text-sm md:text-base animate-pulse">
                  Mining...
                </span>
              ) : (
                <span
                  className="text-sm md:text-base"
                  style={{ color: ast.color }}
                >
                  {ast.mineral}
                </span>
              )}
            </motion.button>
          );
        })}
        {bubbles.map((bubble) => (
          <BubbleComponent key={bubble.id} bubble={bubble} />
        ))}
      </div>
    </div>
  );
};

const Game = () => {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [upgrades, setUpgrades] = useState<UpgradesState>(initialUpgrades);
  const [asteroidStates, setAsteroidStates] = useState<Asteroid[]>(ASTEROIDS);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [, setSelectedAsteroid] = useState<number | null>(null);
  const [resourceAlloc, setResourceAlloc] = useState<number>(50);
  const [tier, setTier] = useState<number>(1);
  const [tierProgress, setTierProgress] = useState<number>(0);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [soundVolume, setSoundVolume] = useState<number>(0.5);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // close popover when clicking outside
  const popoverRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Resource collection and tier progression
  useEffect(() => {
    const interval = setInterval(() => {
      const droneAlloc = resourceAlloc / 100;
      const storageAlloc = 1 - droneAlloc;
      const tierMultiplier = 1 + (tier - 1) * 0.2;
      const creditsPerSec =
        (2 + upgrades.droneEfficiency * 0.5) * droneAlloc * tierMultiplier;
      const mineralsPerSec =
        (1 + upgrades.cargoCapacity * 0.2) * storageAlloc * tierMultiplier;
      const energyPerSec =
        -1 + upgrades.energyCells * 0.1 + upgrades.autoRepair * 0.05;

      setStats((prev) => ({
        credits: prev.credits + creditsPerSec,
        minerals: prev.minerals + mineralsPerSec,
        energy: Math.max(prev.energy + energyPerSec, -100),
      }));

      const progressPerSec = 1 + upgrades.scanSpeed * 0.5;
      setTierProgress((prev) => {
        const newProgress = prev + progressPerSec;
        if (newProgress >= 100) {
          setTier((t) => t + 1);
          return newProgress - 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [upgrades, resourceAlloc, tier]);

  // Handle asteroid mining with sound effect
  const handleAsteroidTap = useCallback(
    (id: number) => {
      const asteroid = asteroidStates.find((a) => a.id === id);
      if (!asteroid || asteroid.tapped) return;

      // Play mining sound effect
      const miningSound = new Audio("/sounds/gun-shot.mp3");
      miningSound.volume = soundVolume;
      miningSound.play();

      setSelectedAsteroid(id);
      setAsteroidStates((prev) =>
        prev.map((a) => (a.id === id ? { ...a, tapped: true } : a))
      );

      const bubbleInterval = setInterval(() => {
        const timeValue = time.get();
        const offset = (2 * Math.PI * id) / ASTEROIDS.length;
        const left = `${50 + 45 * Math.cos(timeValue + offset)}%`;
        const top = `${50 + 27 * Math.sin(timeValue + offset)}%`;
        const size = Math.random() * 20 + 10;
        const duration = 1.5;
        const newBubble: Bubble = {
          id: Date.now() + Math.random(),
          left,
          top,
          size,
          color: asteroid.color,
          duration,
        };
        setBubbles((prev) => [...prev, newBubble]);
        setTimeout(() => {
          setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
        }, duration * 1000);
      }, 200);

      setTimeout(() => {
        clearInterval(bubbleInterval);
        const mineralsGained =
          asteroid.richness * (1 + upgrades.cargoCapacity * 0.1);
        const creditsGained = mineralsGained * 2;
        setStats((prev) => ({
          ...prev,
          minerals: prev.minerals + mineralsGained,
          credits: prev.credits + creditsGained,
          energy: prev.energy - 10,
        }));
        setAsteroidStates((prev) =>
          prev.map((a) => (a.id === id ? { ...a, tapped: false } : a))
        );
        setSelectedAsteroid(null);
      }, 2000);
    },
    [asteroidStates, upgrades.cargoCapacity, soundVolume]
  );

  const time = useMotionValue(0);
  useEffect(() => {
    const animation = animate(time, 2 * Math.PI, {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    });
    return () => animation.stop();
  }, [time]);

  // Handle upgrade purchase
  const handleUpgrade = (key: UpgradeKey) => {
    const upgrade = UPGRADES.find((u) => u.key === key);
    if (!upgrade) return;
    const cost = upgrade.costBase * (upgrades[key] + 1);
    if (stats.credits >= cost && upgrades[key] < upgrade.max) {
      setStats((prev) => ({ ...prev, credits: prev.credits - cost }));
      setUpgrades((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    }
  };

  return (
    <div className={`h-screen flex flex-col dark bg-gray-900 text-gray-100`}>
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 bg-gray-800/80 border-gray-700 backdrop-blur-md border-b transition-colors duration-300 shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <button
            title="Toggle Sidebar"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            className="md:hidden mr-3 text-teal-400 cursor-pointer"
          >
            <Menu size={24} className="hover:text-teal-600 transition-colors" />
          </button>

          <h1 className="hidden sm:flex text-2xl font-bold bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent items-center">
            <Orbit size={24} className="mr-2 text-blue-500" />
            SMiner
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="text-gray-400 hover:text-gray-200 cursor-pointer"
            title="How to Play"
          >
            <HelpCircle
              size={24}
              className="text-blue-500 hover:text-blue-300"
            />
          </button>

          <Link
            title="Back to Dashboard"
            href="/dashboard"
            className="text-gray-400 hover:text-gray-200 cursor-pointer"
          >
            <CircleArrowLeft
              size={24}
              className="text-blue-500 hover:text-blue-300"
            />
          </Link>

          <Link
            title="Back to Home"
            href="/"
            className="text-gray-400 hover:text-gray-200 cursor-pointer"
          >
            <House size={24} className="text-blue-500 hover:text-blue-300" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          upgrades={upgrades}
          stats={stats}
          resourceAlloc={resourceAlloc}
          setResourceAlloc={setResourceAlloc}
          tier={tier}
          tierProgress={tierProgress}
          isSideBarOpen={isSideBarOpen}
          handleUpgrade={handleUpgrade}
          soundVolume={soundVolume}
          setSoundVolume={setSoundVolume}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <StatsHeader stats={stats} />
          {/* Popover Content */}
          {isPopoverOpen && (
            <HowToPlayPopup
              popoverRef={popoverRef}
              setIsPopoverOpen={setIsPopoverOpen}
            />
          )}
          <main className="flex-1 p-6 flex items-center justify-center scrollable">
            <AsteroidBelt
              asteroids={asteroidStates}
              onAsteroidTap={handleAsteroidTap}
              bubbles={bubbles}
            />
          </main>
        </div>
      </div>
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}
    </div>
  );
};

export default Game;
