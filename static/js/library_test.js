    /*TEST LIB;RARY COTAINS FUNCTIONS USED DURING TESTING TASKS.*/
    var assert = function(condition, message) {
        console.log("inside assert function");
        if (!condition) {
            message = message || "Assertion failed";
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    };

    var testOK = function(condition, message) {
        return 1;
    }