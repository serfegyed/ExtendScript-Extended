/**
 * Returns an iterator object that generates values of the Map.
 *
 * @return {Object}
 */
Map.prototype.values = function () {
    var map = this;
    var visited = [];

    var iterator = {
        next: function () {
            var i;
            var j;
            var wasVisited;

            for (i = 0; i < map._entries.length; i++) {
                wasVisited = false;
                for (j = 0; j < visited.length; j++) {
                    if (visited[j] === map._entries[i]) {
                        wasVisited = true;
                        break;
                    }
                }
                if (!wasVisited) {
                    visited.push(map._entries[i]);
                    return {done: false, value: map._entries[i][1]};
                }
            }
            return {done: true, value: undefined};
        },
    };
    return iterator;
};
