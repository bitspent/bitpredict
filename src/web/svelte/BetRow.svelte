<script>
    export let event;
    export let user;
    import BitEth from '../js/BitEth'
</script>
{#if user.toLowerCase() === event.user.toLowerCase()}
    <tr class="w3-text-black" style="font-weight: bold">
        <td class="w3-teal">YOU</td>
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