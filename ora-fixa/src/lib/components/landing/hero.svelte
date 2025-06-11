<script lang="ts">
	import Navbar from "../layout/navbar.svelte";
</script>


<section class="relative h-screen bg-black font-sans">
    <div class="absolute inset-0">
      <img
        src="https://images.pexels.com/photos/3037239/pexels-photo-3037239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Frizer la lucru intr-un barbershop modern"
        class="w-full h-full object-cover grayscale brightness-50"
      />
      <div class="absolute inset-0 bg-black/60"></div>
    </div>

    <div class="relative h-full flex flex-col z-10">
      <Navbar />

      <main class="flex-grow flex items-center">
        <div class="container md:px-0 px-4 mx-auto mb-10">
          <div class="max-w-md text-left text-white">

            <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider">
              Barber
            </h1>

            <h2 class="mt-4 text-xl md:text-3xl lg:text-4xl text-white/90">
              Barbershop in Bailesti.
            </h2>

            <a
              href="/contact"
              class="mt-5 inline-block border border-white bg-transparent rounded-full px-8 py-3 text-sm md:px-10 md:py-4 md:text-base font-medium uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              Programeaza-te acum.
            </a>
          </div>
        </div>
      </main>

    </div>
  </section>