import { env } from '$env/dynamic/public';
import { supabase } from './supabaseClient';

// This function converts the VAPID key to the required format
function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export async function subscribeToPushNotifications(userId: string) {
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
		console.error('Push notifications are not supported.');
		return;
	}

	const registration = await navigator.serviceWorker.ready;
	const existingSubscription = await registration.pushManager.getSubscription();

	if (existingSubscription) {
		console.log('User is already subscribed.');
		return;
	}

	const VAPID_PUBLIC_KEY = env.PUBLIC_VAPID_PUBLIC_KEY; // Paste your public key here
  console.log(VAPID_PUBLIC_KEY)

	try {
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
		});

		// Save the subscription to Supabase
			const { error } = await supabase.from('push_subscriptions').insert({
				user_id: userId,
				subscription_details: subscription
			});
			console.error(error);
	} catch (error) {
		console.log('eroare', error);
		console.error('Failed to subscribe to push notifications:', error);
	}
}
