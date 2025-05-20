import { fetchInvites as serverFetchInvites } from '@/actions/systems/fetchInvites';

export const fetchInvitesClient = async (systemId: string, userId: string) => {
  return await serverFetchInvites(systemId, userId);
};
