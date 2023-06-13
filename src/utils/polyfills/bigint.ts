/* eslint-disable no-extend-native */
/* eslint-disable dot-notation */

BigInt.prototype['toJSON'] = function () {
    return this.toString();
};
