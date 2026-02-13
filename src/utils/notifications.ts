import { isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification';

let permissionChecked = false;

export async function checkNotificationPermission(): Promise<boolean> {
  if (permissionChecked) {
    return await isPermissionGranted();
  }

  let permissionGranted = await isPermissionGranted();
  
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }

  permissionChecked = true;
  return permissionGranted;
}

export async function ensureNotificationPermission(): Promise<void> {
  const granted = await checkNotificationPermission();
  
  if (!granted) {
    console.warn('Notification permission not granted');
  }
}
