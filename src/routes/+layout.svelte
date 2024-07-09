<script lang="ts">
  import "../app.css";
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import { enhance } from "$app/forms";
</script>

<h1
  class="w-full h-12 flex justify-center items-center bg-emerald-900 text-xl font-bold text-emerald-200"
>
  Budget App
</h1>
<form method="post" use:enhance action="?/signOut">
  <button type="submit">Sign Out</button>
</form>

<slot />
