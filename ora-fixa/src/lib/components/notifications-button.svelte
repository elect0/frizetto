<script lang='ts'>
	import Button from "./ui/button/button.svelte";
	import { subscribeToPushNotifications } from "$lib/web-push";
	import { page } from "$app/state";
	import { Bell } from "@lucide/svelte";
</script>
<Button variant="outline" onclick={() => subscribeToPushNotifications(page.data.session?.user.id || '')}><Bell /> Activează Notificări</Button>
