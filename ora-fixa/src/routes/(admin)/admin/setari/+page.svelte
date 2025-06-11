<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types'

   export let data;

   type FormResponseType = {
    success?: boolean; // '?' înseamnă că proprietatea este OPȚIONALĂ
    message?: string;
    error?: boolean;   // Adăugăm și o posibilă proprietate de eroare
  } | null | undefined; // 'form' poate fi și null sau undefined la început

   export let form: FormResponseType

   $: ({workSchedules} = data)

   let isSubmitting = false

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
</script>

<!-- {#each daysOfWeek as day (day.id)}
{@const schedule = workSchedules.find(s => s.day_of_week === day.id) || {is_active: false, start_time: '09:00', end_time: '17:00'}}
<div class="flex items-center">
    <input type="checkbox" id="day_active_{day.id}" name="is_active_{day.id}" bind:checked={schedule.is_active} />
    <label class="ml-2" for="day_active_{day.id}">
        {day.name}
    </label>

    <input type="time" id="start_time_{day.id}" disabled={!schedule.is_active} name="start_time_{day.id}" bind:value={schedule.start_time} />

    <input type="time" id="end_time_{day.id}" disabled={!schedule.is_active} name="end_time_{day.id}" bind:value={schedule.end_time} />
</div>
{/each} -->

<div class="container bg-[#2c2c2c]">

    <h1 class="text-3xl font-bold mb-6 text-white">Setari Program de Lucru</h1>
    <p class="mb-6 text-white text-xl">
        Defineste zilele si orele in care esti disponibil pentru programari.
        Debifeaza o zi pentru a o marca drept libera.
    </p>

    {#if form?.success}
    <div class="p-4 mb-6 bg-green-950 text-green-200 border border-green-300 rounded-lg">
        {form.message}
    </div>
    {/if}
</div>

