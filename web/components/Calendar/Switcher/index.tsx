import { useState, useRef, useEffect } from "react";

import "./index.css";

interface SwitcherProps {
    currentView: "day" | "week" | "month";
    onChange: (view: "day" | "week" | "month") => void;
}

export default function Switcher({ currentView, onChange }: SwitcherProps) {
    const [indicatorPos, setIndicatorPos] = useState({ left: 0, width: 0 });
    const tabsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const viewIndices: Record<string, number> = {
            day: 0,
            week: 1,
            month: 2,
        };

        const activeIndex = viewIndices[currentView];
        const currentTab = tabsRef.current[activeIndex];

        if (currentTab) {
            setIndicatorPos({
                left: currentTab.offsetLeft,
                width: currentTab.offsetWidth,
            });
        }
    }, [currentView]);

    return (
        <div className="dwm-switcher-area">
            <div className="dwm-switcher">
                <div
                    className="indicator"
                    style={{
                        left: `${indicatorPos.left}px`,
                        width: "114px",
                    }}
                ></div>
                <div
                    ref={(el) => {
                        tabsRef.current[0] = el;
                    }}
                    className={`day-switcher ${currentView === "day" ? "active" : ""}`}
                    onClick={() => onChange("day")}
                >
                    Day
                </div>
                <div
                    ref={(el) => {
                        tabsRef.current[1] = el;
                    }}
                    className={`week-switcher ${currentView === "week" ? "active" : ""}`}
                    onClick={() => onChange("week")}
                >
                    Week
                </div>
                <div
                    ref={(el) => {
                        tabsRef.current[2] = el;
                    }}
                    className={`month-switcher ${currentView === "month" ? "active" : ""}`}
                    onClick={() => onChange("month")}
                >
                    Month
                </div>
            </div>
        </div>
    );
}
