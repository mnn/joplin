import shim from '../../../shim';
import MigrationHandler from '../MigrationHandler';
const { useEffect, useState } = shim.react();
import Setting from '../../../models/Setting';
import { reg } from '../../../registry';
import Synchronizer from '../../../Synchronizer';

export interface SyncTargetUpgradeResult {
	done: boolean;
	error: any;
}

export default function useSyncTargetUpgrade(): SyncTargetUpgradeResult {
	const [upgradeResult, setUpgradeResult] = useState({
		done: false,
		error: null,
	});

	async function upgradeSyncTarget() {
		reg.logger().info('useSyncTargetUpgrade: Starting process...');

		let error = null;
		try {
			reg.logger().info('useSyncTargetUpgrade: Acquire synchronizer...');
			const synchronizer: Synchronizer = await reg.syncTarget().synchronizer();

			reg.logger().info('useSyncTargetUpgrade: Create migration handler...');
			const migrationHandler = new MigrationHandler(
				synchronizer.api(),
				synchronizer.db(),
				synchronizer.lockHandler(),
				Setting.value('appType'),
				Setting.value('clientId')
			);

			reg.logger().info('useSyncTargetUpgrade: Start upgrade...');
			await migrationHandler.upgrade();
		} catch (e) {
			error = e;
		}

		reg.logger().info('useSyncTargetUpgrade: Error:', error);

		if (!error) {
			Setting.setValue('sync.upgradeState', Setting.SYNC_UPGRADE_STATE_IDLE);
			await Setting.saveAll();
		}

		setUpgradeResult({
			done: true,
			error: error,
		});
	}

	useEffect(function() {
		void upgradeSyncTarget();
	}, []);

	return upgradeResult;
}
