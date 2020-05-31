<script>
    export let event;
    export let user;
    import BitEth from '../js/BitEth'
</script>
{#if user === event.user}
    <tr class="w3-text-black" style="font-weight: bold">
        <td>YOU</td>
        <td>{event.bet/100}</td>
        <td>{new Date(event.time*1000).toLocaleString()}</td>
    </tr>
{:else}
    <tr>
        <td>{BitEth.cutAddress(event.user)}</td>
        <td>{event.bet/100}</td>
        <td>{new Date(event.time*1000).toLocaleString()}</td>
    </tr>
{/if}