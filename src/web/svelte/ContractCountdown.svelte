<script>
    import BitPredict from "../js/BitPredict";

    export let event;
    let status = '';
    let statNo = 0;

    function countdown(until, from) {
        if (from > until) {
            let tmp = until;
            until = from;
            from = tmp;
        }
        let evt = new Date(until);
        from = new Date(from);
        let sec_num = (evt - from) / 1000;
        let days = Math.floor(sec_num / (3600 * 24));
        let hours = Math.floor((sec_num - (days * (3600 * 24))) / 3600);
        let minutes = Math.floor((sec_num - (days * (3600 * 24)) - (hours * 3600)) / 60);
        let seconds = Math.floor(sec_num - (days * (3600 * 24)) - (hours * 3600) - (minutes * 60));
        if (hours < 10)
            hours = "0" + hours;
        if (minutes < 10)
            minutes = "0" + minutes;
        if (seconds < 10)
            seconds = "0" + seconds;
        if (days > 0)
            return days + ' Days ' + hours + ':' + minutes + ':' + seconds;
        return hours + ':' + minutes + ':' + seconds;
    }

    async function update() {

        if (event.contract) {

            let now = new Date().getTime();

            let execution = Number(String(event.execution).substring(0, 13));
            let closure = Number(String(event.closure).substring(0, 13));

            // not open anymore
            statNo = await BitPredict.instanceAt(event.contract).callAsync('status');
            statNo = Number(statNo);

            // 0 -> closed but not executed
            if (statNo === 0) {
                event.open = true;
                event.executed = false;
                if (closure > now) {
                    event.open = true;
                    event.closed = false;
                    event.executed = false;
                    status = `Closes in ${countdown(closure, now)}`;
                    status += `<br> Executes on ${new Date(execution).toLocaleString()}`;
                    event.notifyStatus && event.notifyStatus(event.open, status, event.executed);
                } else {
                    if (execution > now) {
                        status = `Closing → Executes in ${countdown(execution, now)} `;
                    } else {
                        status = `Closing → Executes on ${new Date(execution).toLocaleString()} `;

                        status += `<br> ${countdown(execution, now)}`;
                    }
                    event.notifyStatus && event.notifyStatus(event.open, status, event.executed);
                }
            }
            // 1 -> closed
            else if (statNo === 1) {
                event.open = false;
                event.closed = true;
                event.executed = false;
                if (execution > now) {
                    status = `Closed → Executes in ${countdown(execution, now)} `;
                } else {
                    status = `Closed → Executes on ${new Date(execution).toLocaleString()} `;
                    status += `<br> ${countdown(execution, now)} `;
                }
                event.notifyStatus && event.notifyStatus(event.open, status, event.executed);
            }
            // 2 -> executed awaiting rewards
            else if (statNo === 2) {
                event.open = false;
                event.executed = true;
                let sol = await BitPredict.instanceAt(event.contract).callAsync('winSolution');
                sol = sol / 1000000;
                status = `Executed → Awaiting rewards ${countdown(execution, now)} <br> Hit ${sol}`;

                event.notifyStatus && event.notifyStatus(event.open, status, event.executed);
            }
            // 3 -> executed or ended before
            else if (statNo === 3) {
                let counters = await BitPredict.instanceAt(event.contract).callAsync('counters');
                let subs = counters[0];
                if (subs > 0) {
                    status = 'Executed On ' + new Date(execution).toLocaleString();
                } else {
                    status = 'Executed Early, 0 Users';
                }
                event.open = false;
                event.closed = true;
                event.executed = true;
                event.notifyStatus && event.notifyStatus(event.open, status, event.executed);
                return;
            } else {
                event.open = false;
                event.executed = false;
                event.notifyStatus && event.notifyStatus(event.open, status, event.executed);
                status = 'Executing...';
                status += `<br> ${countdown(execution, now)} `;
            }
        }
        setTimeout(update, 1000);
    }

    update();
</script>
<b>{@html status}</b>