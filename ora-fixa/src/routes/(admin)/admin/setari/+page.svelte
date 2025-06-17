<script lang="ts">
	import type { ActionData } from './$types'
    import { enhance } from '$app/forms';

    interface WorkSchedule {
  id: number
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

    export let data: {
        workSchedules: WorkSchedule[]
    }

   export let form : ActionData

   $: ({workSchedules} = data)

   const daysOfWeek = [
    {id: 1, name: 'Luni',
    },
    {id: 2, name: 'Marti'},
    {id: 3, name: 'Miercuri'},
    {id: 4, name: 'Joi'},
    {id: 5, name: 'Vineri'},
    {id: 6, name: 'Sambata'},
    {id: 7, name: 'Duminica'},
   ]

   let isSubmitting = false;

</script>
<div class="container bg-[#181818] text-white">
    <div class="text-3xl mb-6 text-white">
        Setari Program de lucru
    </div>
    <p class="mb-6 text-white">
        Defineste zilele
    </p>
    <div class="p-4 mb-6 bg-#[2c2c2c] border border-gray-200 rounded-lg">
        {form?.message}
    </div>

    <form method="POST" use:enhance={() => {
        isSubmitting = true
        return async ({update}) => {
            await update()
            isSubmitting = false
        }
    }}
    >
    <div class="space-y-5 bg-[#2c2c2c] p-6 md:p-8 rounded-lg ">

    {#each daysOfWeek as day (day.id)}
    {@const schedule = workSchedules.find(s => s.day_of_week === day.id) || {is_active: false, start_time: '09:00', end_time: "17:00"}}
    <div class="grid grid-cols-1 mg:grid-cols-3 gap-4 items-center border-b border-gray-200 pb-5">
        <div class="flex items-center space-x-3">
            <input
              type="checkbox"
              id="day_active_{day.id}"
              name="is_active_{day.id}"
              bind:checked={schedule.is_active}
              class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              for="day_active_{day.id}"
              class="w-24 font-bold text-gray-700"
            >
              {day.name}
            </label>
          </div>

          <div class="flex items-center space-x-2 md:col-span-2">
            <input
              type="time"
              name="start_time_{day.id}"
              bind:value={schedule.start_time}
              disabled={!schedule.is_active}
              class="w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:opacity-50 disabled:bg-gray-100"
            />
            <span class="text-gray-500" class:opacity-50={!schedule.is_active}>-</span>
            <input
              type="time"
              name="end_time_{day.id}"
              bind:value={schedule.end_time}
              disabled={!schedule.is_active}
              class="w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:opacity-50 disabled:bg-gray-100"
            />
          </div>
    </div>
{/each}
<button
type="submit"
disabled={isSubmitting}
class="mt-8 w-full md:w-auto px-8 py-3 text-white font-bold rounded-lg transition-colors"
>
{#if isSubmitting}
  Se salvează...
{:else}
  Salvează Modificările
{/if}
</button>
</div>
</form>
</div>