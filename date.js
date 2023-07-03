exports.getDay = function() {
    const dayOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    const currentDay = new Date();
    return currentDay.toLocaleDateString("en-US", dayOptions);
}