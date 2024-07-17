var backspace_string = function (str1, str2) {
    var iter_i = str1.length - 1;
    var iter_j = str2.length - 1;
    var backspace_iter_i = 0;
    var backspace_iter_j = 0;
    while (iter_i >= 0 || iter_j >= 0) {
        while (backspace_iter_i > 0 || str1[iter_i] === '#') {
            if (str1[iter_i] === '#') {
                backspace_iter_i++;
            }
            else {
                backspace_iter_i--;
            }
            iter_i--;
        }
        while (backspace_iter_j > 0 || str2[iter_j] === '#') {
            if (str2[iter_j] === '#') {
                backspace_iter_j++;
            }
            else {
                backspace_iter_j--;
            }
            iter_j--;
        }
        // make an assert
        if (backspace_iter_i > 0 || backspace_iter_j > 0) {
            throw new Error('Invalid input');
        }
        if (str1[iter_i] !== str2[iter_j]) {
            return false;
        }
        iter_i--;
        iter_j--;
    }
    // Function body needs implementation
    return true; // Placeholder return value
};
// calculate backspace_string
console.log(backspace_string('xy#z', 'xzz#'));
console.log(backspace_string('xy#z', 'xyz#'));
