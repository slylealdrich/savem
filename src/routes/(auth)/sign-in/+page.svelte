<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import type { PageServerData, PageServerLoad } from "./$types";
  import { goto } from "$app/navigation";

  const { data }: { data: PageServerData } = $props();

  const { form, enhance, errors } = superForm(data.signInForm);
</script>

<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
  <form
    method="post"
    use:enhance
    action="?/signIn"
    class="w-[90%] max-w-[500px] p-8 flex flex-col justify-center items-center gap-y-4 bg-emerald-900 text-emerald-200 rounded-md"
  >
    <span class="w-full text-center text-2xl font-bold">Sign In</span>
    <div class="w-full flex flex-col justify-center items-center gap-y-2">
      {#if $errors.username}
        <span class="w-full text-center text-sm text-red-400">
          {$errors.username.join(". ")}.
        </span>
      {/if}
      <label class="flex w-full h-10">
        <span class="w-32 flex justify-center items-center bg-emerald-600 rounded-l-md">
          Username
        </span>
        <input
          name="username"
          placeholder="johndoe"
          bind:value={$form.username}
          class="w-full px-2 bg-emerald-950 placeholder-emerald-900 rounded-r-md"
        />
      </label>
      {#if $errors.password}
        <span class="w-full text-center text-sm text-red-400">
          {$errors.password.join(". ")}.
        </span>
      {/if}
      <label class="flex w-full h-10">
        <span class="w-32 flex justify-center items-center bg-emerald-600 rounded-l-md">
          Password
        </span>
        <input
          name="password"
          type="password"
          placeholder="*******"
          bind:value={$form.password}
          class="w-full px-2 bg-emerald-950 placeholder-emerald-900 rounded-r-md"
        />
      </label>
    </div>
    <div class="w-full flex flex-col justify-center items-center gap-y-2">
      <button class="w-full h-10 bg-emerald-600 rounded-md">Sign In</button>
      <span class="text-sm">Don't have an account?</span>
      <button
        type="button"
        onclick={() => goto("/sign-up")}
        class="w-full h-10 bg-emerald-800 rounded-md"
      >
        Create a New Account
      </button>
    </div>
  </form>
</div>
