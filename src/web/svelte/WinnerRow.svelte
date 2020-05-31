<script>
    export let event;
    export let user;
    import BitEth from '../js/BitEth'
</script>
{#if user === event.winner}
    <tr class="w3-text-teal" style="font-weight: bold">
        <td>YOU</td>
        <td>{event.guess/100}</td>
        <td>{event.solution/1e6}</td>
        <td>{event.reward/1e18} ETH</td>
    </tr>
{:else}
    <tr>
        <td>{BitEth.cutAddress(event.winner)}</td>
        <td>{event.guess/100}</td>
        <td>{event.solution/1e6}</td>
        <td>{event.reward/1e18} ETH</td>
    </tr>
{/if}