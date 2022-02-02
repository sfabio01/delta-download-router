import { writable } from 'svelte/store';

function createOptionObject() {
    const { subscribe, set, update } = writable({});

    return {
        subscribe,
        set,
        update,
    };
}

export const objs = createOptionObject();