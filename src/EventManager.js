class EventManager {
    constructor() {
        this.events = {};
    }

    subscribe(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    unsubscribe(event, listenerToRemove) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
        }
    }

    publish(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(listener => {
                listener(data);
            });
        }
    }
}

export const eventManager = new EventManager();