<script lang="ts">
  import SuperDebug, { superForm } from "sveltekit-superforms";
  import type { PageServerLoad } from "./$types";

  const { data }: { data: PageServerLoad } = $props();

  const { form, enhance } = superForm(data.signInForm);
</script>

<form method="post" use:enhance action="?/signIn">
  <label>
    <span>username</span>
    <input name="username" bind:value={$form.username} />
  </label>
  <label>
    <span>password</span>
    <input name="username" type="password" bind:value={$form.password} />
  </label>
  <button>sign in</button>
</form>

<SuperDebug data={form} />
