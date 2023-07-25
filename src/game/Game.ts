export const Modes = {
    MODE_NOSE: {
        label: "Nose",
        tag: "MODE_NOSE",
        keypoints: ["nose"],
    },
    MODE_HANDS: {
        label: "Hands",
        tag: "MODE_HANDS",
        keypoints: ["right_wrist", "left_wrist"],
    },
};

export const ModesList = Object.keys(Modes).map((key) => Modes[key]);
