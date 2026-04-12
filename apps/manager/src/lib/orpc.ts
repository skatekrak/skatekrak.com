import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { ContractRouterClient } from '@orpc/contract';

import type { contract } from '@krak/contracts';

import { env } from '@/env';

function getBaseUrl() {
    if (typeof window === 'undefined') {
        return env.KRAK_API_URL ?? env.NEXT_PUBLIC_KRAK_API_URL;
    }
    return env.NEXT_PUBLIC_KRAK_API_URL;
}

// ============================================================================
// Client-side link (browser) — includes credentials for cookie auth
// ============================================================================

const link = new RPCLink({
    url: getBaseUrl() + '/rpc',
    fetch: (url, options) => fetch(url, { ...options, credentials: 'include' }),
});

export const client: ContractRouterClient<typeof contract> = createORPCClient(link);

// ============================================================================
// Tanstack Query integration — used in React components
// ============================================================================

export const orpc = createTanstackQueryUtils(client);
