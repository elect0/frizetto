<script lang="ts">
	import SectionCards from '$lib/components/section-cards.svelte';
	import ChartAreaInteractive from '$lib/components/chart-area-interactive.svelte';
	import DataTable from '$lib/components/data-table.svelte';
	import { Calendar, Interaction, TimeGrid } from '@event-calendar/core';
	import { format, parse } from 'date-fns';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
  import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
	import { supabase } from '$lib/supabaseClient.js';

	let { data } = $props();
	let kpis = $derived(data.kpis);
	let weeklyRevenue = $derived(data.weeklyRevenue);

	let events = $derived(
		data.appointments
			.filter((appointment) => appointment.status != 'anulata')
			.map((appointment) => {
				return {
					id: appointment.id.toString(),
					start: new Date(appointment.start_time),
					end: new Date(appointment.end_time),
					title: `${appointment.services.name} - ${appointment.profiles.full_name}`,
					backgroundColor: ''
				};
			})
	);
	let options = $derived({
		view: 'timeGridDay',
		date: page.url.searchParams.get('date') ? page.url.searchParams.get('date') : new Date(),
		events: events,
		slotMinTime: '08:00:00',
		slotMaxTime: '18:00:00',
		slotDuration: '00:15:00',
		datesSet: function (info: any) {
			console.log(format(info.start, 'yyyy-MM-dd'));
			goto(`/admin/dashboard?date=${format(info.start, 'yyyy-MM-dd')}`, {
				noScroll: true,
				keepFocus: true
			});
		},
		locale: 'ro',
		allDayContent: 'Ora',
		eventLongPressDelay: 10,
		buttonText: function (next: any) {
			return { ...next, today: 'Astazi' };
		}
	});
	function urlBase64ToUint8Array(base64String: string) {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
		const rawData = atob(base64);
		const outputArray = new Uint8Array(rawData.length);
		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

  async function subsribeToPush(){
    if(!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Notificarile push nu sunt suportate de acest browser')
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready

      const permission = await Notification.requestPermission()
      if(permission !== 'granted') {
        alert('Permisiunea pentru notificari a fost refuzata');
        return
      }

      console.log('Permisiune acordata')

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_PUBLIC_KEY)
      })

      const {error} = await supabase.from('push_subscriptions').upsert({
        user_id: page.data.session?.user.id,
        subscription_details: subscription,
      }, {
          onConflict: "user_id, subscription_details"
        })

      if (error) throw error

    alert("Te-ai abonat la notificari cu success")

    } catch (error) {
      console.error("Eroare:", error)
      alert("A aparut o eroare")
    }
  }
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<SectionCards {kpis} />
			<div class="px-4 lg:px-6">
				<ChartAreaInteractive {weeklyRevenue} />
			</div>
      <div class="my-8">
      <button onclick={subsribeToPush}>Activeaza notificari</button>
      </div>
			<div class="px-4 lg:px-6">
				<DataTable
					form={data.form}
					services={data.services}
					clients={data.clients}
					appointments={data.appointments}
					date={data.currentDate}
				/>
				<Calendar plugins={[TimeGrid, Interaction]} {options} />
			</div>
		</div>
	</div>
</div>
