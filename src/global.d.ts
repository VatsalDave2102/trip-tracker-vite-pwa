export default null;
declare let self: ServiceWorkerGlobalScope;
interface SyncManager {
	getTags(): Promise<string[]>;
	register(tag: string): Promise<void>;
}

declare global {
	interface ServerWorkerRegistration {
		readonly sync: SyncManager;
	}
}
