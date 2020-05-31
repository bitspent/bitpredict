<script>
    import ContractCountdown from "./ContractCountdown.svelte";

    export let event;

    event.notifyStatus = (open, status, executed) => {
        event.open = open;
        event.executed = executed;
    }

</script>
<tr>
    <td class="w3-padding-small">
        {#if event.open}
            <a class="w3-button w3-deep-purple w3-round"
               rel="noopener" target="_blank" style="width: 50px"
               href=".?contract={event.contract}">
                <b>Bet</b>
            </a>
        {:else}
            <a class="w3-button w3-round {event.executed ? 'w3-amber' : 'w3-teal'}"
               rel="noopener" target="_blank" style="width: 50px"
               href=".?contract={event.contract}">
                <b>&#x1F50D;</b>
            </a>
        {/if}
    </td>
    <td><b>{event.ticker}</b></td>
    <td><b><i>{event.ticket}</i></b></td>
    <td class="w3-text-gray">
        <ContractCountdown event="{event}"/>
    </td>
</tr>