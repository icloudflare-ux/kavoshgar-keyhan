
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// --- Helper Functions for SVG Arc ---
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
    return d;
};


interface PlanetaryClockProps {
    timedHours: { day: any[]; night: any[] };
    sunrise: Date;
    sunset: Date;
    nextSunrise: Date;
    now: Date;
}

const centralPlanets = [
    { name: 'عطارد', r: 50, size: 3, color: '#9ca3af', speed: 8 },
    { name: 'زهره', r: 75, size: 5, color: '#fbbf24', speed: 12 },
    { name: 'زمین', r: 105, size: 5, color: '#3b82f6', speed: 18 },
    { name: 'مریخ', r: 135, size: 4, color: '#ef4444', speed: 25 },
];

const PlanetaryClock: React.FC<PlanetaryClockProps> = ({ timedHours, sunrise, sunset, nextSunrise, now }) => {
    const size = 600;
    const center = size / 2;

    const { dayArc, nightArc, dayHoursData, nightHoursData, currentAngle } = useMemo(() => {
        const sunriseMs = sunrise.getTime();
        const sunsetMs = sunset.getTime();
        const nextSunriseMs = nextSunrise.getTime();

        const dayDurationMs = sunsetMs - sunriseMs;
        const nightDurationMs = nextSunriseMs - sunsetMs;
        const totalDurationMs = dayDurationMs + nightDurationMs;

        const dayArcSpan = (dayDurationMs / totalDurationMs) * 360;
        const nightArcSpan = 360 - dayArcSpan;

        const sunriseAngle = (sunrise.getHours() * 60 + sunrise.getMinutes()) / (24 * 60) * 360;
        const sunsetAngle = sunriseAngle + dayArcSpan;

        const dayHourAngle = dayArcSpan / 12;
        const nightHourAngle = nightArcSpan / 12;

        const dayHours = timedHours.day.map((hour, i) => {
            const angle = sunriseAngle + (i + 0.5) * dayHourAngle;
            const pos = polarToCartesian(center, center, center - 45, angle);
            return { ...hour, pos, angle };
        });

        const nightHours = timedHours.night.map((hour, i) => {
            const angle = sunsetAngle + (i + 0.5) * nightHourAngle;
            const pos = polarToCartesian(center, center, center - 45, angle);
            return { ...hour, pos, angle };
        });

        let angleNow: number;
        const nowMs = now.getTime();
        if (nowMs >= sunriseMs && nowMs < sunsetMs) {
            const elapsed = nowMs - sunriseMs;
            angleNow = sunriseAngle + (elapsed / dayDurationMs) * dayArcSpan;
        } else {
            let elapsed;
            if (nowMs < sunriseMs) { // Before sunrise (previous day's night)
                const prevSunsetMs = sunriseMs - (nightDurationMs); // Approximation
                elapsed = nowMs - prevSunsetMs;
                angleNow = (sunriseAngle - nightArcSpan) + (elapsed / nightDurationMs) * nightArcSpan;
            } else { // After sunset
                elapsed = nowMs - sunsetMs;
                angleNow = sunsetAngle + (elapsed / nightDurationMs) * nightArcSpan;
            }
        }

        return {
            dayArc: { path: describeArc(center, center, center - 20, sunriseAngle, sunsetAngle), angle: dayArcSpan },
            nightArc: { path: describeArc(center, center, center - 20, sunsetAngle, sunriseAngle + 360), angle: nightArcSpan },
            dayHoursData: dayHours,
            nightHoursData: nightHours,
            currentAngle: angleNow,
        };
    }, [sunrise, sunset, nextSunrise, now, timedHours]);
    
    const getPlanetColor = (planet: any) => {
        const key = planet.auspiciousnessKey;
        if (key.includes('benefic')) return 'text-green-400';
        if (key.includes('malefic')) return 'text-red-400';
        if (key.includes('neutral')) return 'text-yellow-400';
        return 'text-gray-300';
    };

    return (
        <div className="w-full max-w-2xl mx-auto relative aspect-square">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                <defs>
                    <radialGradient id="sunGradientClock" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="70%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#b45309" />
                    </radialGradient>
                     <linearGradient id="dayArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FDE047" />
                        <stop offset="100%" stopColor="#a7f3d0" />
                    </linearGradient>
                    <linearGradient id="nightArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#4338ca" />
                    </linearGradient>
                </defs>

                {/* Day/Night Arcs */}
                <path d={dayArc.path} stroke="url(#dayArcGradient)" strokeWidth="40" fill="none" transform={`rotate(${dayArc.angle/2} ${center} ${center})`} />
                <path d={nightArc.path} stroke="url(#nightArcGradient)" strokeWidth="40" fill="none" transform={`rotate(${nightArc.angle/2} ${center} ${center})`} />
                <circle cx={center} cy={center} r={center - 40} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                 {/* Central Orrery */}
                <circle cx={center} cy={center} r={center - 85} fill="#0f172a" />
                <g>
                    {centralPlanets.map((planet) => (
                        <g key={planet.name}>
                            <circle cx={center} cy={center} r={planet.r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <motion.g style={{ transformOrigin: `${center}px ${center}px` }} animate={{ rotate: 360 }} transition={{ duration: planet.speed, ease: 'linear', repeat: Infinity }}>
                                <circle cx={center} cy={center - planet.r} r={planet.size} fill={planet.color} />
                            </motion.g>
                        </g>
                    ))}
                </g>
                <circle cx={center} cy={center} r={20} fill="url(#sunGradientClock)" />

                {/* Hour Planets */}
                {dayHoursData.map((hour, i) => (
                    <g key={`day-${i}`} transform={`translate(${hour.pos.x}, ${hour.pos.y})`}>
                        <text textAnchor="middle" dominantBaseline="central" fontSize="24" className={getPlanetColor(hour.planet)}>{hour.planet.icon}</text>
                    </g>
                ))}
                {nightHoursData.map((hour, i) => (
                     <g key={`night-${i}`} transform={`translate(${hour.pos.x}, ${hour.pos.y})`}>
                        <text textAnchor="middle" dominantBaseline="central" fontSize="24" className={getPlanetColor(hour.planet)}>{hour.planet.icon}</text>
                    </g>
                ))}

                {/* Current Time Hand */}
                <g transform={`rotate(${currentAngle} ${center} ${center})`}>
                    <line x1={center} y1={center-25} x2={center} y2={45} stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx={center} cy={40} r="5" fill="#f59e0b" />
                </g>

            </svg>
        </div>
    );
};

export default PlanetaryClock;
