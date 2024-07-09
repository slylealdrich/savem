<script lang="ts">
  import SuperDebug, { superForm } from "sveltekit-superforms";
  import type { PageServerLoad } from "./$types";

  const { data }: { data: PageServerLoad } = $props();

  const { form, enhance } = superForm(data.signUpForm);
</script>

<form method="post" use:enhance action="?/signUp">
  <label>
    <span>username</span>
    <input name="username" bind:value={$form.username} />
  </label>
  <label>
    <span>password</span>
    <input name="username" type="password" bind:value={$form.password} />
  </label>
  <button>sign up</button>
</form>

<SuperDebug data={form} />
