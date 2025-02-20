
type ActionOptions = {
    silent: boolean;
}

const action = async ({ silent }:  ActionOptions): Promise<void> => {

    if (silent) {
        console.log('========================');
        console.log('silent mode is turned on')
        console.log('========================');
    }
}

export default action