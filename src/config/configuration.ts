
function convertToBoolean(input: string, df: boolean): boolean {
  try {
    return input.toLocaleLowerCase() === 'true'
  }
  catch (e) {
    return df;
  }
}

export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  TUNNEL: {
    DOMAIN: process.env.TUNNEL_DOMAIN || 'tuna.meca.in.th.',
    TTL: parseInt(process.env.TUNNEL_TTL, 10) || 72000,
    MODE: parseInt(process.env.TUNNEL_MODE, 10) || 0,
    RELAYS: process.env.TUNNEL_RELAYS ? process.env.TUNNEL_RELAYS.split(',').map(s => s.trim()) : ['DEFAULT'],
    OWNER: process.env.TUNNEL_OWNER || 'daemon',
    AUTO_REMOVE: convertToBoolean(process.env.TUNNEL_AUTO_REMOVE, true),
  },
  DATABASE: {
    URL: process.env.DATABASE_URL || 'sqlite://'+process.env.PWD+'/db.sqlite',
    SYNCHRONIZE: convertToBoolean(process.env.DATABASE_SYNCHRONIZE, false),
    LOGGING: convertToBoolean(process.env.DATABASE_LOGGING, false),
  }
});

