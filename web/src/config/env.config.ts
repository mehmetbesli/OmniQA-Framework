import * as path from 'path';
import * as fs from 'fs';

export interface EnvironmentModel {
  name: string;
  baseUrl: string;
  apiBaseUrl: string;
  apiPath: string;
  retries?: number;
  parallelWorkers?: number;
  auth: {
    username: string;
    password: string;
  };
  database: {
    url: string;
    user: string;
    password: string;
  };
  performance: {
    host: string;
    threads: number;
    rampUp: number;
    loops: number;
  };
  timeouts: {
    element: number;
    pageLoad: number;
    api: number;
  };
  headless: boolean;
}

export interface EnvironmentsFile {
  defaultEnv: string;
  environments: Record<string, EnvironmentModel>;
}

// Load environments.json from config directory
const projectRoot = path.resolve(__dirname, '../../../');
const configPath = path.resolve(projectRoot, 'config/environments.json');

let envsData: EnvironmentsFile = {
  defaultEnv: 'qa',
  environments: {},
};

if (fs.existsSync(configPath)) {
  try {
    envsData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (err) {
    console.error(`Failed to parse environments.json at ${configPath}:`, err);
  }
}

// Determine active environment
const activeEnvName = (
  process.env.TEST_ENV ||
  process.env.ENV ||
  process.env.NODE_ENV ||
  envsData.defaultEnv ||
  'qa'
).toLowerCase().trim();

const targetEnvConfig: EnvironmentModel = envsData.environments[activeEnvName] || envsData.environments[envsData.defaultEnv] || {
  name: activeEnvName,
  baseUrl: 'https://www.bstackdemo.com',
  apiBaseUrl: 'https://www.bstackdemo.com',
  apiPath: '/api',
  retries: 1,
  parallelWorkers: 3,
  auth: { username: 'demouser', password: 'testingisfun99' },
  database: { url: 'jdbc:h2:mem:omniqa_db;DB_CLOSE_DELAY=-1', user: 'sa', password: '' },
  performance: { host: 'www.bstackdemo.com', threads: 3, rampUp: 1, loops: 1 },
  timeouts: { element: 10000, pageLoad: 30000, api: 15000 },
  headless: true,
};

export interface EnvironmentConfig {
  readonly ENV_NAME: string;
  readonly BASE_URL: string;
  readonly API_BASE_URL: string;
  readonly API_PATH: string;
  readonly RETRIES: number;
  readonly PARALLEL_WORKERS: number;
  readonly TIMEOUT: {
    readonly ELEMENT: number;
    readonly PAGE_LOAD: number;
    readonly API: number;
  };
  readonly AUTH: {
    readonly DEFAULT_USER: string;
    readonly DEFAULT_PASSWORD: string;
  };
  readonly DB: {
    readonly URL: string;
    readonly USER: string;
    readonly PASS: string;
  };
  readonly PERF: {
    readonly HOST: string;
    readonly THREADS: number;
    readonly RAMPUP: number;
    readonly LOOPS: number;
  };
  readonly HEADLESS: boolean;
}

export const EnvConfig: EnvironmentConfig = {
  ENV_NAME: activeEnvName,
  BASE_URL: process.env.BASE_URL || targetEnvConfig.baseUrl,
  API_BASE_URL: process.env.API_BASE_URL || targetEnvConfig.apiBaseUrl,
  API_PATH: process.env.API_PATH || targetEnvConfig.apiPath,
  RETRIES: parseInt(process.env.RETRIES || `${targetEnvConfig.retries ?? 1}`, 10),
  PARALLEL_WORKERS: parseInt(process.env.WORKERS || process.env.PARALLEL_WORKERS || `${targetEnvConfig.parallelWorkers ?? 3}`, 10),
  TIMEOUT: {
    ELEMENT: parseInt(process.env.TIMEOUT_ELEMENT || `${targetEnvConfig.timeouts?.element || 10000}`, 10),
    PAGE_LOAD: parseInt(process.env.TIMEOUT_PAGE_LOAD || `${targetEnvConfig.timeouts?.pageLoad || 30000}`, 10),
    API: parseInt(process.env.TIMEOUT_API || `${targetEnvConfig.timeouts?.api || 15000}`, 10),
  },
  AUTH: {
    DEFAULT_USER: process.env.TEST_USERNAME || targetEnvConfig.auth?.username || 'demouser',
    DEFAULT_PASSWORD: process.env.TEST_PASSWORD || targetEnvConfig.auth?.password || 'testingisfun99',
  },
  DB: {
    URL: process.env.DB_URL || targetEnvConfig.database?.url || 'jdbc:h2:mem:omniqa_db;DB_CLOSE_DELAY=-1',
    USER: process.env.DB_USER || targetEnvConfig.database?.user || 'sa',
    PASS: process.env.DB_PASSWORD || targetEnvConfig.database?.password || '',
  },
  PERF: {
    HOST: process.env.PERF_HOST || targetEnvConfig.performance?.host || 'www.bstackdemo.com',
    THREADS: parseInt(process.env.PERF_THREADS || `${targetEnvConfig.performance?.threads || 3}`, 10),
    RAMPUP: parseInt(process.env.PERF_RAMPUP || `${targetEnvConfig.performance?.rampUp || 1}`, 10),
    LOOPS: parseInt(process.env.PERF_LOOPS || `${targetEnvConfig.performance?.loops || 1}`, 10),
  },
  HEADLESS: process.env.HEADLESS !== undefined ? process.env.HEADLESS !== 'false' : targetEnvConfig.headless,
};

// Environment Helper Functions
export const getActiveEnv = (): string => EnvConfig.ENV_NAME;
export const isDev = (): boolean => EnvConfig.ENV_NAME === 'dev' || EnvConfig.ENV_NAME === 'local';
export const isQa = (): boolean => EnvConfig.ENV_NAME === 'qa';
export const isStaging = (): boolean => EnvConfig.ENV_NAME === 'staging' || EnvConfig.ENV_NAME === 'stage';
export const isProd = (): boolean => EnvConfig.ENV_NAME === 'prod' || EnvConfig.ENV_NAME === 'production';
