export const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

export const isProdEnv = () => process.env.NODE_ENV === 'production';
