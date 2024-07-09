<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import type { PageServerLoad } from "./$types";
  import { goto } from "$app/navigation";

  const { data }: { data: PageServerLoad } = $props();

  const { form, enhance } = superForm(data.signUpForm);
</script>

<form method="post" use:enhance action="?/signUp" class="flex flex-col bg-emerald-600">
  <label>
    <span>username</span>
    <input name="username" bind:value={$form.username} />
  </label>
  <label>
    <span>password</span>
    <input name="password" type="password" bind:value={$form.password} />
  </label>
  <button>sign up</button>
</form>

<button onclick={() => goto("/sign-in")}>Sign In</button>
