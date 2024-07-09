<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import type { PageServerLoad } from "./$types";
  import { goto } from "$app/navigation";

  const { data }: { data: PageServerLoad } = $props();

  const { form, enhance } = superForm(data.signInForm);
</script>

<form method="post" use:enhance action="?/signIn" class="flex flex-col bg-emerald-600">
  <label>
    <span>username</span>
    <input name="username" bind:value={$form.username} />
  </label>
  <label>
    <span>password</span>
    <input name="password" type="password" bind:value={$form.password} />
  </label>
  <button>sign in</button>
</form>
<button onclick={() => goto("/sign-up")}>Create an Account</button>
