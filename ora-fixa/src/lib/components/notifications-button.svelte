<script lang='ts'>
	import Button from "./ui/button/button.svelte";
	import { subscribeToPushNotifications } from "$lib/web-push";
	import { page } from "$app/state";

  $effect(() => {
    console.log(page.data.session?.user)
  })

</script>
<button onclick={() => subscribeToPushNotifications(page.data.session?.user.id || '')}>activeaza notifciarile</button>
<Button onclick={() => subscribeToPushNotifications(page.data.session?.user.id || '')}>Activeaza Notificarile</Button>
