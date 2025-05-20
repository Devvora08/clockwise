"use client"

import React, { useState } from "react";

interface WorkHoursInputProps {
    initialValue?: number;
    onChange?: (value: number | null) => void;
}

const WorkHoursInput: React.FC<WorkHoursInputProps> = ({ initialValue = 0, onChange }) => {
    const [value, setValue] = useState<string>(initialValue.toString());

    // Handler to allow only digits and convert to number or null
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        // Allow empty input to clear
        if (val === "") {
            setValue("");
            if (onChange) onChange(null);
            return;
        }

        // Regex: only digits allowed (no decimals)
        if (/^\d+$/.test(val)) {
            setValue(val);
            if (onChange) onChange(parseInt(val, 10));
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <label
                htmlFor="work-hours-input"
                style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}
            >
                Work Hours
            </label>
            <input
                id="work-hours-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={value}
                onChange={handleChange}
                placeholder="Enter work hours (e.g. 8)"
                style={{
                    padding: "0.5rem 1rem",
                    borderRadius: 6,
                    border: "1.5px solid #ccc",
                    fontSize: "1rem",
                    width: 120,
                    outline: "none",
                    transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0070f3")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            />
        </div>
    );
};

export default WorkHoursInput;
