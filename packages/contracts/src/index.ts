import type { z } from 'zod';
import type { InferContractRouterInputs, InferContractRouterOutputs } from '@orpc/contract';

export { contract } from './contract';

// Re-export all schemas for consumer use
export * from './schemas/shared';
export * from './schemas/spots';
export * from './schemas/maps';
export * from './schemas/media';
export * from './schemas/profiles';
export * from './schemas/admin';

// Inferred types from the contract
export type ContractInputs = InferContractRouterInputs<typeof import('./contract').contract>;
export type ContractOutputs = InferContractRouterOutputs<typeof import('./contract').contract>;

// ============================================================================
// Convenience type aliases inferred from Zod schemas
// ============================================================================

import type { SpotSchema } from './schemas/spots';
import type { MediaSchema, ClipSchema } from './schemas/media';

/** Spot type inferred from the contract schema */
export type Spot = z.infer<typeof SpotSchema>;

/** Media type inferred from the contract schema */
export type Media = z.infer<typeof MediaSchema>;

/** Clip type inferred from the contract schema */
export type Clip = z.infer<typeof ClipSchema>;
