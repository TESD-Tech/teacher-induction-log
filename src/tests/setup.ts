// Polyfill TextEncoder if necessary
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

global.TextEncoder = NodeTextEncoder as typeof global.TextEncoder;
global.TextDecoder = NodeTextDecoder as typeof global.TextDecoder;

// Import matchers from @testing-library/jest-dom
import '@testing-library/jest-dom/vitest';