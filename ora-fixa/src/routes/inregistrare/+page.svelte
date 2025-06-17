<script lang='ts'>
  import type {PageData} from './$types'
  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData
  const { form, errors, submitting, message } = superForm(data.form);


</script>

<div class="flex h-screen">
  <div class="hidden lg:flex w-1/2 relative">
    <img src="https://images.pexels.com/photos/18377448/pexels-photo-18377448.jpeg" alt="Community illustration" class="object-cover w-full h-full"/>
    <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/70"></div>
  </div>

  <div class="w-full lg:w-1/2 flex items-center justify-center bg-[#181818] p-4">
    <div class="max-w-md w-full p-8 bg-[#2c2c2c] rounded-lg shadow-xl">
      <h1 class="text-4xl font-bold mb-4 text-white uppercase tracking-wide text-center select-none">
        Creează un Cont
      </h1>
      <p class="text-neutral-300 mb-8 text-center font-sans text-base">
        Alătură-te comunității noastre - E gratuit!
      </p>

      {#if $message}
        <div class="p-4 mb-6 bg-green-200 text-green-800 rounded-lg text-center">
          {$message}
        </div>
      {/if}

      <form method="POST" class="space-y-6">

        <div>
          <label for="email" class="block text-neutral-300 font-medium text-sm mb-2 select-none">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="nume@exemplu.com"
            required
            bind:value={$form.email}
            class="w-full px-4 py-3 bg-transparent border rounded-full text-neutral-100 font-sans text-base placeholder-neutral-500 focus:outline-none focus:ring-2 transition-colors duration-200"
            class:border-red-500={$errors.email}
            class:border-white={!$errors.email}
            aria-invalid={$errors.email ? 'true' : 'false'}
          />
          {#if $errors.email}<p class="text-red-500 text-xs mt-1 ml-4">{$errors.email}</p>{/if}
        </div>

        <div>
          <label for="password" class="block text-neutral-300 font-medium text-sm mb-2 select-none">Parola</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Minim 8 caractere"
            required
            bind:value={$form.password}
            class="w-full px-4 py-3 bg-transparent border rounded-full text-neutral-100 font-sans text-base placeholder-neutral-500 focus:outline-none focus:ring-2 transition-colors duration-200"
            class:border-red-500={$errors.password}
            class:border-white={!$errors.password}
            aria-invalid={$errors.password ? 'true' : 'false'}
          />
          {#if $errors.password}<p class="text-red-500 text-xs mt-1 ml-4">{$errors.password}</p>{/if}
        </div>

        <div>
          <label for="passwordConfirm" class="block text-neutral-300 font-medium text-sm mb-2 select-none">Confirmare Parola</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            placeholder="Repetă parola"
            required
            bind:value={$form.passwordConfirm}
            class="w-full px-4 py-3 bg-transparent border rounded-full text-neutral-100 font-sans text-base placeholder-neutral-500 focus:outline-none focus:ring-2 transition-colors duration-200"
            class:border-red-500={$errors.passwordConfirm}
            class:border-white={!$errors.passwordConfirm}
            aria-invalid={$errors.passwordConfirm ? 'true' : 'false'}
          />
          {#if $errors.passwordConfirm}<p class="text-red-500 text-xs mt-1 ml-4">{$errors.passwordConfirm}</p>{/if}
        </div>

        <button
          type="submit"
          disabled={$submitting}
          class="w-full bg-white border border-white rounded-full text-black font-semibold text-base py-3 uppercase tracking-wider hover:bg-transparent hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-neutral-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {#if $submitting}Se creează...{:else}Creează Cont{/if}
        </button>
      </form>

      <p class="mt-8 text-center text-neutral-400 font-sans text-sm select-none">
        Ai deja un cont?
        <a href="/login" class="text-white hover:text-neutral-300 font-medium underline transition-colors duration-200">Autentifică-te aici</a>
      </p>
    </div>
  </div>
</div>