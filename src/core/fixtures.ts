// Hand-written fixtures, not taken from a real mod (plan section 7, item 1).
export const FRONT = `{
"car_suspension_F": {
    "information":{
        "authors":"test",
        "name":"Front suspension with \\"variables\\" in the name",
    },
    // "variables": [["name","type"],["$camber_FAKE","range"]] inside a comment
    /* "variables": [ also in a block comment ] */
    "variables": [
        ["name", "type", "unit", "category", "default", "min", "max", "title", "description"]
        ["$camber_F", "range", "", "Wheel Alignment", 1, 0.95, 1.05, "Camber", "Adjusts camber"],
        ["$toe_F", "range", "", "Wheel Alignment", 0.99, 0.98, 1.02, "Toe", "Adjusts toe"]
        ["$trackoffset_F", "range", "+m", "Wheels", 0, -0.02, 0.02, "Track offset", "Spacers"],
        ["$springheight_F", "range", "+m", "Suspension", 0, -0.05, 0.05, "Ride height", ""],
        ["$spring_F", "range", "N/m", "Suspension", 90000, 40000, 160000, "Spring rate", ""],
        ["$camber_F_mode", "boolean", "", "Wheel Alignment", 0, 0, 1, "Not a range", ""],
        ["$toe_F_expr", "range", "", "Wheel Alignment", 1, "$base_min", 1.1, "Expression min", ""],
    ],
    "slots": [["type", "default", "description"], ["wheel_F", "wheel_F", "Wheels"]],
},
}
`;

export const REAR = FRONT.replace(/_F\b/g, '_R').replace(/_F"/g, '_R"').replace(/\n/g, '\r\n');
