let BitEth = {
    /*
     * Get Default Account[0]
     */
    getAddressAsync() {
        return new Promise((res, rej) => {
            if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
                web3.eth.getAccounts((e, accounts) => {
                    if (accounts && accounts.length === 0) {
                        web3.currentProvider.enable().then(() => window.location.reload());
                    } else {
                        res(accounts[0]);
                    }
                });
            }
        });
    },
    cutAddress(address) {
        return address.substring(0, 8) + '...' + address.substring(36);
    }
};

export default BitEth;