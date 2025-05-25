import designSystem from "./designSystem";

const POST_TYPES = [
  { 
    value: 'help', 
    label: 'Ask for help',
    color: designSystem.colors.semantic.error,
    bgColor: `${designSystem.colors.semantic.error}20`,
    borderColor: `${designSystem.colors.semantic.error}30`
  },
  { 
    value: 'recommendation', 
    label: 'Recommend a place',
    color: designSystem.colors.semantic.success,
    bgColor: `${designSystem.colors.semantic.success}20`,
    borderColor: `${designSystem.colors.semantic.success}30`
  },
  { 
    value: 'update', 
    label: 'Share a local update',
    color: designSystem.colors.primary.blue,
    bgColor: `${designSystem.colors.primary.blue}20`,
    borderColor: `${designSystem.colors.primary.blue}30`
  },
  { 
    value: 'event', 
    label: 'Event announcement',
    color: designSystem.colors.secondary.pink,
    bgColor: `${designSystem.colors.secondary.pink}20`,
    borderColor: `${designSystem.colors.secondary.pink}30`
  }
];


export default POST_TYPES;