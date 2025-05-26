import designSystem from "./designSystem";

const POST_TYPES = [
  { 
    id: "1",
    value: 'help', 
    label: 'Ask for help',
    icon: '🙏',  // SOS button emoji
    color: designSystem.colors.semantic.error,
    bgColor: `${designSystem.colors.semantic.error}20`,
    borderColor: `${designSystem.colors.semantic.error}30`
  },
  { 
    id: "2",
    value: 'recommendation', 
    label: 'Recommend a place',
    icon: '👍',  // thumbs up emoji
    color: designSystem.colors.semantic.success,
    bgColor: `${designSystem.colors.semantic.success}20`,
    borderColor: `${designSystem.colors.semantic.success}30`
  },
  { 
    id: "3",
    value: 'update', 
    label: 'Share a local update',
    icon: '📢',  // megaphone emoji
    color: designSystem.colors.primary.blue,
    bgColor: `${designSystem.colors.primary.blue}20`,
    borderColor: `${designSystem.colors.primary.blue}30`
  },
  { 
    id: "4",
    value: 'event', 
    label: 'Event announcement',
    icon: '🎉',  // party popper emoji
    color: designSystem.colors.secondary.pink,
    bgColor: `${designSystem.colors.secondary.pink}20`,
    borderColor: `${designSystem.colors.secondary.pink}30`
  }
];

export default POST_TYPES;